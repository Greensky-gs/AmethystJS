import { AnySelectMenuInteraction, Client, MessageComponentType } from 'discord.js';
import { componentToInteraction, waitForInteractionComponent, waitForInteractionOptions } from '../typings/Client';
import { log4js } from '..';

type waitForInteractionReturn<T extends waitForInteractionComponent> = Promise<componentToInteraction<T>>;

export const waitForInteraction = <T extends waitForInteractionComponent>({
    message,
    componentType,
    whoCanReact,
    user,
    replies,
    onCollect = 'nothing',
    onCollectReply,
    time = message?.client?.configs?.defaultWaitTime ?? 120000
}: waitForInteractionOptions<T>): waitForInteractionReturn<T> =>
    new Promise(async (resolve, reject) => {
        const collector = message
            .createMessageComponentCollector({
                time,
                componentType: componentType
            })
            .on('collect', async (interaction: componentToInteraction<T>) => {
                if (whoCanReact === 'useronly' && interaction.user.id !== user.id) {
                    return interaction.reply(
                        replies?.user?.({
                            user: interaction.user,
                            interaction
                        }) ?? message.client.configs.defaultReplies.user({ user: interaction.user, interaction })
                    );
                }
                if (whoCanReact === 'everyoneexceptuser' && interaction.user.id === user.id) {
                    return interaction.reply(
                        replies?.everyone?.({
                            user: interaction.user,
                            interaction
                        }) ?? message.client.configs.defaultReplies.everyone({ user: interaction.user, interaction })
                    );
                }

                if (onCollect === 'deferReply' || onCollect === 'deferUpdate') {
                    interaction[onCollect]().catch(log4js.trace);
                }
                if (onCollect === 'reply') {
                    if (!onCollectReply) {
                        log4js.trace({
                            message: 'onCollectReply is not defined, please define it in the options',
                            interaction: interaction.toJSON()
                        })
                    } else {
                        interaction.reply(onCollectReply({ user: interaction.user, interaction })).catch(log4js.trace);
                    }
                }

                resolve(interaction);
                collector.stop('interaction');
            })
            .on('end', (_c, reason) => {
                if (reason === 'interaction') return;
                if (reason === 'time' || reason === 'idle') return reject('time');
                reject(reason);
            });
    });
