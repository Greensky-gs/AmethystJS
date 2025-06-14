import { PermissionsString, Locale, Message } from 'discord.js';
import cooldowns from '../maps/cooldowns';
import { commandDeniedCode, DebugImportance, errorCode } from '../typings/Client';
import { testMessage } from '../utils/functions';
import { AmethystClient } from '../structures/AmethystClient';


export const messageInputRun = (message: Message) => {
    const test = testMessage(message);

    if (!test.valid || message.author.bot || message.webhookId) return;

    const args = message.content.slice(test.length).trim().split(/ +/g);
    const cmdName = args.shift();
    const cmd = message.client.messageCommands.find(
        (x) =>
            x.options.name === cmdName.toLowerCase() ||
            x.options.aliases.includes(cmdName.toLowerCase()) ||
            (message.client.configs.commandLocalizationsUsedAsNames &&
                Object.keys(x.options.nameLocalizations ?? {})
                    .map((y) => (x.options.nameLocalizations ?? {})[y as keyof Partial<Record<Locale, string>>])
                    .includes(cmdName.toLowerCase()))
    );
    const argumentOptions = {
        args: args,
        first: args[0] ?? null,
        second: args[1] ?? null,
        emptyArgs: args.length === 0,
        commandName: cmdName
    };

    if (!cmd) {
        message.client.debug(`An user used an unexisting command: ${cmdName}`, DebugImportance.Information);
        return;
    }
    if (!cmd.messageRun) {
        return message.client.emit(
            'commandError',
            {
                isMessage: true,
                type: 'message',
                message,
                command: cmd,
                user: message.author,
                client: message.client as AmethystClient
            },
            {
                code: errorCode.NoMessageRun,
                message: `The command hasn't a run proprety. Use <#AmethytCommand>.setMessageRun()`,
                metadata: {
                    commandName: cmd.options.name
                }
            }
        );
    }

    if (cmd.options.clientPermissions?.length > 0 && message.guild) {
        let missing: PermissionsString[] = [];
        cmd.options.clientPermissions.forEach((perm) => {
            if (!message.guild.members.me.permissions.has(perm)) missing.push(perm);
        });

        if (missing.length > 0) {
            return message.client.emit(
                'commandDenied',
                {
                    command: cmd,
                    type: 'message',
                    message,
                    isMessage: true,
                    user: message.author,
                    client: message.client as AmethystClient
                },
                {
                    message: 'Client is missing permissions',
                    code: commandDeniedCode.ClientMissingPerms,
                    metadata: {
                        permissions: {
                            need: cmd.options.clientPermissions,
                            got: cmd.options.clientPermissions.filter((x) => !missing.includes(x)),
                            missing: missing
                        }
                    }
                }
            );
        }
    }
    if (cmd.options.permissions?.length > 0 && message.guild) {
        let missing: PermissionsString[] = [];
        cmd.options.permissions.forEach((perm) => {
            if (!message.guild.members.me.permissions.has(perm)) missing.push(perm);
        });

        if (missing.length > 0) {
            return message.client.emit(
                'commandDenied',
                {
                    command: cmd,
                    message,
                    type: 'message',
                    isMessage: true,
                    user: message.author,
                    client: message.client as AmethystClient
                },
                {
                    message: 'User is missing permissions',
                    code: commandDeniedCode.UserMissingPerms,
                    metadata: {
                        permissions: {
                            need: cmd.options.clientPermissions,
                            got: cmd.options.clientPermissions.filter((x) => !missing.includes(x)),
                            missing: missing
                        }
                    }
                }
            );
        }
    }

    let ok = true;
    if (
        cmd.options.preconditions?.length > 0 &&
        cmd.options.preconditions.filter((x) => x.messageRun !== undefined).length > 0
    ) {
        cmd.options.preconditions
            .filter((x) => x.messageRun !== undefined)
            .forEach((prec) => {
                if (!ok) return;
                const result = prec.messageRun({
                    message,
                    command: cmd,
                    client: message.client as AmethystClient,
                    arguments: argumentOptions
                });
                if (!result.ok) {
                    ok = false;
                    return message.client.emit(
                        'commandDenied',
                        {
                            command: cmd,
                            type: 'message',
                            isMessage: true,
                            message,
                            user: message.author,
                            client: message.client as AmethystClient
                        },
                        {
                            message: `A precondition failed: ${prec.name}`,
                            code: result?.metadata?.code ?? commandDeniedCode.CustomPrecondition,
                            metadata: result.metadata ?? {}
                        }
                    );
                }
            });
    }
    if (!ok) return;
    if (cmd.options.messageInputChannelTypes?.length > 0) {
        if (!cmd.options.messageInputChannelTypes.includes(message.channel.type)) {
            return message.client.emit(
                'commandDenied',
                {
                    command: cmd,
                    type: 'message',
                    isMessage: true,
                    message,
                    user: message.author,
                    client: message.client as AmethystClient
                },
                {
                    code: commandDeniedCode.InvalidChannelType,
                    message: 'Command runned in an invalid channel type',
                    metadata: {
                        channelType: {
                            expected: cmd.options.messageInputChannelTypes,
                            got: message.channel.type
                        }
                    }
                }
            );
        }
    }

    const cdCode = `${message.author.id}.${cmd.options.name}`;
    if (cooldowns.has(cdCode)) {
        return message.client.emit(
            'commandDenied',
            {
                isMessage: true,
                message,
                type: 'message',
                command: cmd,
                user: message.author,
                client: message.client as AmethystClient
            },
            {
                message: 'User is under cooldown',
                metadata: {
                    remainingCooldownTime: cooldowns.get(cdCode) - Date.now()
                },
                code: commandDeniedCode.UnderCooldown
            }
        );
    }
    cooldowns.set(cdCode, Date.now() + (cmd.options.cooldown || message.client.configs.defaultCooldownTime) * 1000);
    setTimeout(
        () => {
            cooldowns.delete(cdCode);
        },
        (cmd.options.cooldown || message.client.configs.defaultCooldownTime) * 1000
    );

    cmd.messageRun({
        message,
        options: argumentOptions,
        client: message.client as AmethystClient
    });
}