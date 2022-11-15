import {
    CacheType,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    PermissionsString
} from 'discord.js';
import cooldowns from '../maps/cooldowns';
import { AmethystEvent } from '../structures/Event';
import { commandDeniedCode, DebugImportance, errorCode } from '../typings/Client';
import { commandInteractionType } from '../typings/Command';

export default new AmethystEvent('interactionCreate', async(interaction) => {
    if (interaction.isCommand()) {
        const cmd = interaction.client.chatInputCommands.find((x) => x.options.name === interaction.commandName);
        if (!cmd) {
            interaction.client.emit(
                'commandError',
                {
                    isMessage: false,
                    interaction: interaction,
                    command: cmd
                },
                {
                    code: errorCode.UnknownChatInputCommand,
                    message: `Unable to find command`,
                    metadata: {
                        commandName: cmd.options.name
                    }
                }
            );
            return;
        }

        if (cmd.options?.clientPermissions?.length > 0 && interaction.guild) {
            let missingPerms: PermissionsString[] = [];
            for (const perm of cmd.options.clientPermissions) {
                if (!interaction.guild.members.me.permissions.has(perm)) missingPerms.push(perm);
            }

            if (missingPerms.length > 0) {
                return interaction.client.emit(
                    'commandDenied',
                    {
                        isMessage: false,
                        interaction,
                        command: cmd
                    },
                    {
                        message: 'Client needs permissions that not have in the guild',
                        code: commandDeniedCode.ClientMissingPerms,
                        metadata: {
                            permissions: {
                                need: cmd.options.clientPermissions,
                                got: cmd.options.clientPermissions.filter((x) => !missingPerms.includes(x)),
                                missing: missingPerms
                            }
                        }
                    }
                );
            }
        }
        if (cmd.options?.permissions?.length > 0 && interaction.guild) {
            let missingPerms: PermissionsString[] = [];
            for (const perm of cmd.options.permissions) {
                if (!(interaction.member as GuildMember).permissions.has(perm)) missingPerms.push(perm);
            }

            if (missingPerms.length > 0) {
                return interaction.client.emit(
                    'commandDenied',
                    {
                        isMessage: false,
                        interaction,
                        command: cmd
                    },
                    {
                        message: 'User needs permissions that not have in the guild',
                        code: commandDeniedCode.UserMissingPerms,
                        metadata: {
                            permissions: {
                                need: cmd.options.permissions,
                                got: cmd.options.permissions.filter((x) => !missingPerms.includes(x)),
                                missing: missingPerms
                            }
                        }
                    }
                );
            }
        }
        if (cmd.options.messageInputChannelTypes?.length > 0) {
            if (!cmd.options.messageInputChannelTypes.includes(interaction.channel.type)) {
                return interaction.client.emit(
                    'commandDenied',
                    {
                        command: cmd,
                        isMessage: false,
                        interaction
                    },
                    {
                        code: commandDeniedCode.InvalidChannelType,
                        message: 'Command runned in ian invalid channel type',
                        metadata: {
                            channelType: {
                                expected: cmd.options.messageInputChannelTypes,
                                got: interaction.channel.type
                            }
                        }
                    }
                );
            }
        }

        let alreadyStopped = false;
        cmd.options.preconditions?.forEach((precondition) => {
            const prec = precondition.chatInputFunction({
                interaction,
                command: cmd,
                options: interaction.options as CommandInteractionOptionResolver
            });

            if (!prec.ok && !alreadyStopped) {
                alreadyStopped = true;

                return interaction.client.emit(
                    'commandDenied',
                    {
                        command: cmd,
                        interaction,
                        isMessage: false
                    },
                    {
                        code: commandDeniedCode.CustomPrecondition,
                        message: prec.message ?? 'Custom precondition failure',
                        metadata: prec.metadata ?? {}
                    }
                );
            }
        });
        if (alreadyStopped) return;

        const cdCode = `${interaction.user.id}.${interaction.commandName}`;
        if (cooldowns.has(cdCode)) {
            return interaction.client.emit(
                'commandDenied',
                {
                    isMessage: false,
                    interaction,
                    command: cmd
                },
                {
                    code: commandDeniedCode.UnderCooldown,
                    message: 'User under cooldown',
                    metadata: { remainingCooldownTime: cooldowns.get(cdCode) - Date.now() }
                }
            );
        }
        cooldowns.set(
            cdCode,
            Date.now() + (cmd.options.cooldown || interaction.client.configs.defaultCooldownTime) * 1000
        );
        setTimeout(() => {
            cooldowns.delete(cdCode);
        }, cmd.options.cooldown * 1000);

        const options: {
            options: CommandInteractionOptionResolver;
            interaction: CommandInteraction<CacheType>;
        } = {
            options: interaction.options as CommandInteractionOptionResolver,
            interaction: interaction as CommandInteraction<commandInteractionType<false>>
        };
        if (interaction.guild) {
            options.interaction = interaction as CommandInteraction<commandInteractionType<true>>;
        }
        cmd.chatInputRun(options);
    }
    if (interaction.isButton()) {
        interaction.client.emit('buttonInteraction', interaction, interaction.message);
    }
    if (interaction.isModalSubmit()) {
        interaction.client.emit('modalSubmit', interaction);
    }
    if (interaction.isSelectMenu()) {
        interaction.client.emit('selectMenuInteraction', interaction, interaction.message)
    }
    if (interaction.isAutocomplete()) {
        const listeners = interaction.client.autocompleteListeners.filter(x => x.name === interaction.commandName);
        if (listeners.length === 0) return interaction.client.debug(`No autocomplete listeners found for ${interaction.commandName}`, DebugImportance.Information);

        const result = await listeners[0].run({
            interaction,
            options: interaction.options
        });

        interaction.respond(result);
    }
});
