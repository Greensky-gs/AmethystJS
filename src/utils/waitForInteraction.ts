import { ButtonInteraction, ComponentType, MessageComponentType, SelectMenuInteraction } from 'discord.js';
import { waitForType } from '../typings/Client';

type WaitForInteraction<T> =
    T extends waitForType<ComponentType.Button> ? ButtonInteraction<'cached'> : SelectMenuInteraction<'cached'>;

export const waitForInteraction = <T extends waitForType<MessageComponentType>>({
    componentType,
    message,
    user,
    time = 120000,
    whoCanReact = 'useronly',
    replies
}: T) => {
    return new Promise<WaitForInteraction<T>>((resolve, reject) => {
        const collector = message
            .createMessageComponentCollector({
                componentType,
                time
            })
            .on('collect', async (interaction: WaitForInteraction<T>) => {
                const fnt = interaction.replied || interaction.deferred ? 'editReply' : 'reply';
                if (whoCanReact === 'everyoneexceptuser' && user.id === interaction.user.id) {
                    interaction[fnt](
                        replies?.user ?? {
                            content: interaction.client.configs.waitForDefaultReplies.user,
                            ephemeral: true
                        }
                    ).catch(() => {});
                    return;
                }
                if (whoCanReact === 'useronly' && user.id !== interaction.user.id) {
                    interaction[fnt](
                        replies?.everyone ?? {
                            content: interaction.client.configs.waitForDefaultReplies.everyone,
                            ephemeral: true
                        }
                    ).catch(() => {});
                    return;
                }
                resolve(interaction);
                collector.stop();
            })
            .once('end', (_interactions, reason) => {
                if (reason === 'idle') return;
                reject(reason);
            });
    });
};
