import { CommandInteractionOptionResolver } from 'discord.js';
import cooldowns from '../maps/cooldowns';
import { AmethystEvent } from '../structures/Event';
import { commandDeniedCode, errorCode } from '../typings/Client';

export default new AmethystEvent('interactionCreate', (interaction) => {
    if (interaction.isCommand()) {
        const cmd = interaction.client.chatInputCommands.find((x) => x.options.name === interaction.commandName);
        if (!cmd) {
            interaction.client.emit('commandError', {
                isMessage: false,
                interaction: interaction,
                command: cmd
            }, {
                code: errorCode.UnknownChatInputCommand,
                message: `Unable to find command`,
                metadata: {
                    commandName: cmd.options.name
                }
            });
            return;
        }
        const cdCode = `${interaction.user.id}.${interaction.commandName}`;
        if (cooldowns.has(cdCode)) {
            return interaction.client.emit('commandDenied', {
                isMessage: false,
                interaction,
                command: cmd
            }, { code: commandDeniedCode.UnderCooldown, message: 'User under cooldown', metadata: { remainingCooldownTime: Date.now() - cooldowns.get(cdCode) } });
        }

        let alreadyStopped = false;
        cmd.options.preconditions?.forEach((precondition) => {
            const prec = precondition.run({
                isMessage: false,
                interaction,
                command: cmd,
                options: interaction.options as CommandInteractionOptionResolver
            });

            if (!prec.ok && !alreadyStopped) {
                alreadyStopped = true;

                return interaction.client.emit('commandDenied', {
                    command: cmd,
                    interaction,
                    isMessage: false
                }, {
                    code: commandDeniedCode.CustomPrecondition,
                    message: prec.message ?? 'Custom precondition failure',
                    metadata: prec.metadata ?? {}
                })
            }
        })
    }
});
