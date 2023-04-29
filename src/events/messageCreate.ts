import { PermissionsString } from 'discord.js';
import cooldowns from '../maps/cooldowns';
import { AmethystEvent } from '../structures/Event';
import { commandDeniedCode, DebugImportance, errorCode } from '../typings/Client';
import { testMessage } from '../utils/functions';

export default new AmethystEvent('messageCreate', (message) => {
    const test = testMessage(message);

    if (!test.valid || message.author.bot || message.webhookId) return;

    const args = message.content.slice(test.length).trim().split(/ +/g);
    const cmdName = args.shift();
    const cmd = message.client.messageCommands.find(
        (x) => x.options.name === cmdName.toLowerCase() || x.options.aliases.includes(cmdName.toLowerCase())
    );

    if (!cmd) {
        message.client.debug(`An user used an unexisting command: ${cmdName}`, DebugImportance.Information);
        return;
    }
    if (!cmd.messageRun) {
        return message.client.emit(
            'commandError',
            {
                isMessage: true,
                message,
                command: cmd
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
                    message,
                    isMessage: true
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
                    isMessage: true
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
    if (cmd.options.preconditions?.length > 0 && cmd.options.preconditions.filter((x) => x.messageRun).filter(x => x !== undefined).length > 0) {
        cmd.options.preconditions.forEach((prec) => {
            if (!ok) return;
            const result = prec.messageRun({
                message,
                command: cmd
            });
            if (!result.ok) {
                ok = false;
                return message.client.emit(
                    'commandDenied',
                    {
                        command: cmd,
                        isMessage: true,
                        message
                    },
                    {
                        message: `A precondition failed: ${prec.name}`,
                        code: commandDeniedCode.CustomPrecondition,
                        metadata: result.metadata ?? {}
                    }
                );
            }
        });
    }
    if (!ok) return;

    const cdCode = `${message.author.id}.${cmd.options.name}`;
    if (cooldowns.has(cdCode)) {
        return message.client.emit(
            'commandDenied',
            {
                isMessage: true,
                message,
                command: cmd
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
    setTimeout(() => {
        cooldowns.delete(cdCode);
    }, (cmd.options.cooldown || message.client.configs.defaultCooldownTime) * 1000);

    cmd.messageRun({
        message,
        options: {
            args: args,
            first: args[0] ?? null,
            second: args[1] ?? null,
            emptyArgs: args.length === 0,
            commandName: cmdName
        }
    });
});
