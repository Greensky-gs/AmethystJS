import {
    CacheType,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    PermissionsString
} from 'discord.js';
import cooldowns from '../maps/cooldowns';
import { AmethystEvent } from '../structures/Event';
import { ButtonDeniedCode } from '../typings/ButtonHandler';
import { commandDeniedCode, DebugImportance, errorCode } from '../typings/Client';
import { commandInteractionType } from '../typings/Command';
import { AmethystClient } from '../structures/AmethystClient';

export default new AmethystEvent('interactionCreate', async (interaction) => {
    if (interaction.isCommand() && !interaction.isContextMenuCommand()) {
        const cmd = interaction.client.chatInputCommands.find((x) => x.options.name === interaction.commandName);
        if (!cmd) {
            interaction.client.emit(
                'commandError',
                {
                    isMessage: false,
                    type: 'chatInput',
                    interaction: interaction,
                    command: cmd,
                    user: interaction.user,
                    client: interaction.client as AmethystClient
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
        if (!cmd.chatInputRun) {
            return interaction.client.emit(
                'commandError',
                {
                    isMessage: false,
                    type: 'chatInput',
                    interaction,
                    command: cmd,
                    user: interaction.user,
                    client: interaction.client as AmethystClient
                },
                {
                    code: errorCode.NoChatInputRun,
                    message: `The command hasn't a run proprety. Use <#AmethytCommand>.setChatInputRun()`,
                    metadata: {
                        commandName: cmd.options.name
                    }
                }
            );
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
                    type: 'chatInput',
                    interaction,
                        command: cmd,
                        user: interaction.user,
                        client: interaction.client as AmethystClient
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
                    type: 'chatInput',
                    interaction,
                        command: cmd,
                        user: interaction.user,
                        client: interaction.client as AmethystClient
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
                    type: 'chatInput',
                    isMessage: false,
                        interaction,
                        user: interaction.user,
                        client: interaction.client as AmethystClient
                    },
                    {
                        code: commandDeniedCode.InvalidChannelType,
                        message: 'Command runned in an invalid channel type',
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
        if (cmd.options.preconditions?.filter((x) => x.chatInputRun !== undefined).length > 0)
            cmd.options.preconditions
                ?.filter((x) => x.chatInputRun !== undefined)
                .forEach((precondition) => {
                    if (alreadyStopped) return;
                    const prec = precondition.chatInputRun({
                        interaction,
                        command: cmd,
                        options: interaction.options as CommandInteractionOptionResolver
                    });

                    if (!prec.ok) {
                        alreadyStopped = true;

                        return interaction.client.emit(
                            'commandDenied',
                            {
                                command: cmd,
                    type: 'chatInput',
                    interaction,
                                isMessage: false,
                                user: interaction.user,
                                client: interaction.client as AmethystClient
                            },
                            {
                                code: prec?.metadata?.code ?? commandDeniedCode.CustomPrecondition,
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
                    type: 'chatInput',
                    interaction,
                    command: cmd,
                    user: interaction.user,
                    client: interaction.client as AmethystClient
                },
                {
                    code: commandDeniedCode.UnderCooldown,
                    message: 'User under cooldown',
                    metadata: { remainingCooldownTime: cooldowns.get(cdCode) - Date.now() }
                }
            );
        }
        const cdTime = cmd.options.cooldown || interaction.client.configs.defaultCooldownTime;
        cooldowns.set(cdCode, Date.now() + cdTime * 1000);
        setTimeout(() => {
            cooldowns.delete(cdCode);
        }, cdTime * 1000);

        const options: {
            options: CommandInteractionOptionResolver;
            interaction: CommandInteraction<CacheType>;
            client: AmethystClient;
        } = {
            options: interaction.options as CommandInteractionOptionResolver,
            interaction: interaction as CommandInteraction<commandInteractionType<false>>,
            client: interaction.client as AmethystClient
        };
        if (interaction.guild) {
            options.interaction = interaction as CommandInteraction<commandInteractionType<true>>;
        }
        cmd.chatInputRun(options);
    }
    if (interaction.isButton()) {
        interaction.client.emit('buttonInteraction', interaction, interaction.message);

        const handler = interaction.client.buttonHandlers.find(
            (x) =>
                x.options.customId === interaction.customId ||
                (x.options.identifiers && x.options.identifiers.includes(interaction.customId))
        );
        if (!handler)
            return interaction.client.debug(
                `No button handler found for ${interaction.customId} button`,
                DebugImportance.Information
            );

        if (handler) {
        }
        if (interaction.guild && handler.options?.clientPermissions?.length > 0) {
            const missing: PermissionsString[] = [];
            for (const perm of handler.options.clientPermissions) {
                if (!interaction.guild.members.me.permissions.has(perm)) missing.push(perm);
            }

            if (missing.length > 0) {
                return interaction.client.emit('buttonDenied', {
                    button: interaction,
                    message: 'Client is missing permissions',
                    metadata: {
                        permissions: {
                            got: interaction.guild.members.me.permissions.toArray().filter((x) => !missing.includes(x)),
                            need: handler.options.clientPermissions,
                            missing
                        },
                        code: ButtonDeniedCode.ClientMissingPerms
                    },
                    user: interaction.user
                });
            }
        }
        if (interaction.guild && handler.options?.permissions?.length > 0) {
            const missing: PermissionsString[] = [];
            const perms = (interaction.member as GuildMember).permissions;
            for (const perm of handler.options.permissions) {
                if (!perms.has(perm)) missing.push(perm);
            }

            if (missing.length > 0) {
                return interaction.client.emit('buttonDenied', {
                    button: interaction,
                    message: 'Client is missing permissions',
                    metadata: {
                        permissions: {
                            got: perms.toArray().filter((x) => !missing.includes(x)),
                            need: handler.options.clientPermissions,
                            missing
                        },
                        code: ButtonDeniedCode.ClientMissingPerms
                    },
                    user: interaction.user
                });
            }
        }
        if (handler.options.preconditions?.filter((x) => x.buttonRun !== undefined)?.length > 0) {
            let ok = true;
            handler.options.preconditions
                .filter((pr) => pr.buttonRun !== undefined)
                .forEach((prec) => {
                    if (ok) {
                        const rs = prec.buttonRun({
                            button: interaction,
                            user: interaction.user,
                            message: interaction.message
                        });
                        if (!rs.ok) {
                            ok = false;
                            interaction.client.emit('buttonDenied', {
                                message: 'A precondition failed',
                                button: interaction,
                                user: interaction.user,
                                metadata: Object.assign(rs?.metadata ?? {}, {
                                    code: rs?.metadata?.code ?? ButtonDeniedCode.CustomPrecondition
                                })
                            });
                        }
                    }
                });
            if (!ok) return;
        }
        handler.run({
            button: interaction,
            message: interaction.message,
            user: interaction.user
        });
    }
    if (interaction.isStringSelectMenu()) {
        interaction.client.emit('stringSelectInteraction', interaction);
    }
    if (interaction.isAnySelectMenu()) {
        interaction.client.emit('selectMenuInteraction', interaction);
    }
    if (interaction.isRoleSelectMenu()) {
        interaction.client.emit('roleSelectInteraction', interaction);
    }
    if (interaction.isUserSelectMenu()) {
        interaction.client.emit('userSelectInteraction', interaction);
    }
    if (interaction.isChannelSelectMenu()) {
        interaction.client.emit('channelSelectInteraction', interaction);
    }
    if (interaction.isMentionableSelectMenu()) {
        interaction.client.emit('mentionableSelectInteraction', interaction);
    }
    if (interaction.isAutocomplete()) {
        const listeners = interaction.client.autocompleteListeners.filter(
            (x) =>
                x.names.filter((y) => {
                    const n = y.commandName === interaction.commandName;
                    if (y.optionName === null) return n;

                    return n && y.optionName === interaction.options.getFocused(true).name;
                }).length > 0
        );

        if (listeners.length === 0)
            return interaction.client.debug(
                `No autocomplete listeners found for ${interaction.commandName}`,
                DebugImportance.Information
            );

        const result = await listeners[0].run({
            interaction,
            options: interaction.options,
            focused: interaction.options.getFocused(true),
            focusedValue: interaction.options.getFocused(false)
        });

        interaction.respond(result);
    }
    if (interaction.isModalSubmit()) {
        const modal = interaction.client.modalHandlers.find((x) => x.ids.includes(interaction.customId));
        if (!modal)
            return interaction.client.debug(
                `No modal handler found for modal ${interaction.customId}`,
                DebugImportance.Information
            );

        if (modal.options.preconditions?.length > 0) {
            let stopped = false;
            modal.options.preconditions
                .filter((pr) => pr.modalRun !== undefined)
                .forEach((precondition) => {
                    if (precondition.modalRun && !stopped) {
                        const render = precondition.modalRun({
                            modal: interaction,
                            user: interaction.user
                        });
                        if (!render.ok) {
                            stopped = false;
                            interaction.client.emit('modalRejected', {
                                message: 'A precondition failed',
                                modal: interaction,
                                user: interaction.user,
                                metadata: Object.assign(render?.metadata ?? {}, {
                                    code: render?.metadata?.code ?? 'Custom precondition'
                                })
                            });
                        }
                    }
                });

            if (!stopped) return;
        }
        modal.run({
            modal: interaction,
            user: interaction.user
        });
    }
    if (interaction.isUserContextMenuCommand()) {
        const cmd = interaction.client.userContextCommands.find(x => x.options.name === interaction.commandName);
        if (!cmd) {
            interaction.client.emit(
                'commandError',
                {
                    isMessage: false,
                    type: 'userContextMenu',
                    interaction: interaction,
                    command: cmd,
                    user: interaction.user,
                    client: interaction.client as AmethystClient
                },
                {
                    code: errorCode.UnknownUserContextCommand,
                    message: `Unable to find command`,
                    metadata: {
                        commandName: cmd.options.name
                    }
                }
            );
            return;
        }
        if (!cmd.userContextMenuRun) {
            return interaction.client.emit(
                'commandError',
                {
                    isMessage: false,
                    type: 'userContextMenu',
                    interaction,
                    command: cmd,
                    user: interaction.user,
                    client: interaction.client as AmethystClient
                },
                {
                    code: errorCode.NoUserContextCommand,
                    message: `The command hasn't a run proprety. Use <#AmethytCommand>.setUserContextRun()`,
                    metadata: {
                        commandName: cmd.options.name
                    }
                }
            );
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
                    type: 'userContextMenu',
                    interaction,
                        command: cmd,
                        user: interaction.user,
                        client: interaction.client as AmethystClient
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
                    type: 'userContextMenu',
                    interaction,
                        command: cmd,
                        user: interaction.user,
                        client: interaction.client as AmethystClient
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
                    type: 'userContextMenu',
                    isMessage: false,
                        interaction,
                        user: interaction.user,
                        client: interaction.client as AmethystClient
                    },
                    {
                        code: commandDeniedCode.InvalidChannelType,
                        message: 'Command runned in an invalid channel type',
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
        if (cmd.options.preconditions?.filter((x) => x.userContextMenuRun !== undefined).length > 0)
            cmd.options.preconditions
                ?.filter((x) => x.userContextMenuRun !== undefined)
                .forEach((precondition) => {
                    if (alreadyStopped) return;
                    const prec = precondition.userContextMenuRun({
                        interaction,
                        target: interaction.targetUser,
                        command: cmd
                    })

                    if (!prec.ok) {
                        alreadyStopped = true;

                        return interaction.client.emit(
                            'commandDenied',
                            {
                                command: cmd,
                                interaction,
                                isMessage: false,
                    type: 'userContextMenu',
                    user: interaction.user,
                                client: interaction.client as AmethystClient
                            },
                            {
                                code: prec?.metadata?.code ?? commandDeniedCode.CustomPrecondition,
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
                    type: 'userContextMenu',
                    interaction,
                    command: cmd,
                    user: interaction.user,
                    client: interaction.client as AmethystClient
                },
                {
                    code: commandDeniedCode.UnderCooldown,
                    message: 'User under cooldown',
                    metadata: { remainingCooldownTime: cooldowns.get(cdCode) - Date.now() }
                }
            );
        }
        const cdTime = cmd.options.cooldown || interaction.client.configs.defaultCooldownTime;
        cooldowns.set(cdCode, Date.now() + cdTime * 1000);
        setTimeout(() => {
            cooldowns.delete(cdCode);
        }, cdTime * 1000);

        cmd.userContextMenuRun({
            interaction,
            client: interaction.client as AmethystClient,
            user: interaction.targetUser
        })
    }
    if (interaction.isMessageContextMenuCommand()) {
        const cmd = interaction.client.messageContextCommands.find(x => x.options.name === interaction.commandName);
        if (!cmd) {
            interaction.client.emit(
                'commandError',
                {
                    isMessage: false,
                    type: 'messageContextMenu',
                    interaction: interaction,
                    command: cmd,
                    user: interaction.user,
                    client: interaction.client as AmethystClient
                },
                {
                    code: errorCode.UnknownMessageContextCommand,
                    message: `Unable to find command`,
                    metadata: {
                        commandName: cmd.options.name
                    }
                }
            );
            return;
        }
        if (!cmd.messageContextMenuRun) {
            return interaction.client.emit(
                'commandError',
                {
                    isMessage: false,
                    type: 'messageContextMenu',
                    interaction,
                    command: cmd,
                    user: interaction.user,
                    client: interaction.client as AmethystClient
                },
                {
                    code: errorCode.noMessageContextCommand,
                    message: `The command hasn't a run proprety. Use <#AmethytCommand>.setMessageContextRun()`,
                    metadata: {
                        commandName: cmd.options.name
                    }
                }
            );
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
                    type: 'messageContextMenu',
                    interaction,
                        command: cmd,
                        user: interaction.user,
                        client: interaction.client as AmethystClient
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
                    type: 'messageContextMenu',
                    interaction,
                        command: cmd,
                        user: interaction.user,
                        client: interaction.client as AmethystClient
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
                    type: 'messageContextMenu',
                    interaction,
                        user: interaction.user,
                        client: interaction.client as AmethystClient
                    },
                    {
                        code: commandDeniedCode.InvalidChannelType,
                        message: 'Command runned in an invalid channel type',
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
        if (cmd.options.preconditions?.filter((x) => x.messageContextMenuRun !== undefined).length > 0)
            cmd.options.preconditions
                ?.filter((x) => x.messageContextMenuRun !== undefined)
                .forEach((precondition) => {
                    if (alreadyStopped) return;
                    const prec = precondition.messageContextMenuRun({
                        interaction,
                        target: interaction.targetMessage,
                        command: cmd
                    })

                    if (!prec.ok) {
                        alreadyStopped = true;

                        return interaction.client.emit(
                            'commandDenied',
                            {
                                command: cmd,
                    type: 'messageContextMenu',
                    interaction,
                                isMessage: false,
                                user: interaction.user,
                                client: interaction.client as AmethystClient
                            },
                            {
                                code: prec?.metadata?.code ?? commandDeniedCode.CustomPrecondition,
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
                    type: 'messageContextMenu',
                    interaction,
                    command: cmd,
                    user: interaction.user,
                    client: interaction.client as AmethystClient
                },
                {
                    code: commandDeniedCode.UnderCooldown,
                    message: 'User under cooldown',
                    metadata: { remainingCooldownTime: cooldowns.get(cdCode) - Date.now() }
                }
            );
        }
        const cdTime = cmd.options.cooldown || interaction.client.configs.defaultCooldownTime;
        cooldowns.set(cdCode, Date.now() + cdTime * 1000);
        setTimeout(() => {
            cooldowns.delete(cdCode);
        }, cdTime * 1000);

        cmd.messageContextMenuRun({
            interaction,
            client: interaction.client as AmethystClient,
            message: interaction.targetMessage
        })
    }
});
