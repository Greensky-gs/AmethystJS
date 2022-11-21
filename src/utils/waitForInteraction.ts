import { ButtonInteraction, ComponentType, MessageComponentType, SelectMenuInteraction } from 'discord.js';
import { waitForType } from '../typings/Client';

type WaitForInteraction<T> = T extends waitForType<ComponentType.Button>
    ? ButtonInteraction<'cached'>
    : SelectMenuInteraction<'cached'>;

export async function waitForInteraction<T extends waitForType<MessageComponentType>>({
    componentType,
    message,
    user,
    time = 120000,
    whoCanReact = 'useronly',
    replies
}: T) {
    return new Promise<WaitForInteraction<T>>((resolve, reject) => {
        message
            .createMessageComponentCollector({
                componentType,
                time
            })
            .on('collect', async (interaction: WaitForInteraction<T>) => {
                let valid = true;
                const fnt = interaction[interaction.replied || interaction.deferred ? 'editReply' : 'reply'];
                switch (whoCanReact) {
                    case 'everyoneexceptuser':
                        if (user.id === interaction.user.id) {
                            valid = false;
                            fnt(
                                replies?.user ?? {
                                    content: interaction.client.configs.waitForDefaultReplies.user,
                                    ephemeral: true
                                }
                            ).catch(() => {});
                        }
                        break;
                    case 'useronly':
                        if (user.id !== interaction.user.id) {
                            valid = false;
                            fnt(
                                replies?.everyone ?? {
                                    content: interaction.client.configs.waitForDefaultReplies.everyone,
                                    ephemeral: true
                                }
                            );
                        }
                        break;
                }
                if (!valid) return;
                resolve(interaction);
            })
            .once('end', (_interactions, reason) => {
                if (reason === 'idle') return;
                reject(reason);
            });
    });
}
