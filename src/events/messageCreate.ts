import { PermissionsString } from "discord.js";
import cooldowns from "../maps/cooldowns";
import { AmethystEvent } from "../structures/Event";
import { commandDeniedCode, DebugImportance } from "../typings/Client";
import { generateMessageRegex } from "../utils/functions";

export default new AmethystEvent('messageCreate', (message) => {
    const regex = generateMessageRegex(message.client.configs, message.client);
    if (regex === 'invalid') return;

    if (!regex.test(message.content)) return;

    const length: number = message.content.startsWith(message.client.configs.prefix) ? message.client.configs.prefix.length : (message.content.startsWith(message.client.configs.botName) && message.client.configs.botNameWorksAsPrefix) ? message.client.configs.botName.length : (message.content.startsWith(`<@${message.client.user.id}>`) && message.client.configs.mentionWorksAsPrefix) ? (`<@${message.client.user.id}>`).length : (message.content.startsWith(`<@!${message.client.user.id}>`) && message.client.configs.mentionWorksAsPrefix) ? (`<@!${message.client.user.id}>`).length : message.client.configs.prefix.length;

    const args = message.content.slice(length).split(/ +/g);
    const cmdName = args.shift();
    const cmd = message.client.messageCommands.find(x => x.options.name === cmdName.toLowerCase());

    if (!cmd) {
        message.client.debug(`An user used an unexisting command: ${cmdName}`, DebugImportance.Information);
        return;
    }

    if (cmd.options.clientPermissions?.length > 0 && message.guild) {
        let missing: PermissionsString[] = [];
        cmd.options.clientPermissions.forEach((perm) => {
            if (!message.guild.members.me.permissions.has(perm)) missing.push(perm);
        })

        if (missing.length > 0) {
            return message.client.emit('commandDenied', {
                command: cmd,
                message,
                isMessage: true
            }, {
                message: "Client is missing permissions",
                code: commandDeniedCode.ClientMissingPerms,
                metadata: {
                    permissions: {
                        need: cmd.options.clientPermissions,
                        got: cmd.options.clientPermissions.filter(x => !missing.includes(x)),
                        missing: missing
                    }
                }
            })
        }
    }
    if (cmd.options.permissions?.length > 0 && message.guild) {
        let missing: PermissionsString[] = [];
        cmd.options.permissions.forEach((perm) => {
            if (!message.guild.members.me.permissions.has(perm)) missing.push(perm);
        })

        if (missing.length > 0) {
            return message.client.emit('commandDenied', {
                command: cmd,
                message,
                isMessage: true
            }, {
                message: "User is missing permissions",
                code: commandDeniedCode.UserMissingPerms,
                metadata: {
                    permissions: {
                        need: cmd.options.clientPermissions,
                        got: cmd.options.clientPermissions.filter(x => !missing.includes(x)),
                        missing: missing
                    }
                }
            })
        }
    }

    let ok = true;
    if (cmd.options.preconditions?.length > 0) {
        cmd.options.preconditions.forEach((prec) => {
            if (!ok) return;
            const result = prec.messageFunction({
                message,
                command: cmd
            });
            if (!result.ok) {
                ok = false;
                return message.client.emit('commandDenied', {
                    command: cmd,
                    isMessage: true,
                    message
                }, {
                    message: `A precondition failed: ${prec.name}`,
                    code: commandDeniedCode.CustomPrecondition
                })
            }
        })
    }
    if (!ok) return;

    const cdCode = `${message.author.id}.${cmd.options.name}`;
    if (cooldowns.has(cdCode)) {
        return message.client.emit('commandDenied', {
            isMessage: true,
            message,
            command: cmd
        }, {
            message: 'User is under cooldown',
            metadata: {
                remainingCooldownTime: cooldowns.get(cdCode) - Date.now()
            },
            code: commandDeniedCode.UnderCooldown
        });
    }
    cooldowns.set(cdCode, Date.now() + (cmd.options.cooldown || message.client.configs.defaultCooldownTime) * 1000);
    setTimeout(() => {
        cooldowns.delete(cdCode);
    }, (cmd.options.cooldown || message.client.configs.defaultCooldownTime) * 1000);

    cmd.messageRun(message, {
        message,
        args: args,
        options: {
            first: args[0] ?? null,
            second: args[1] ?? null
        },
        emptyArgs: args.length === 0
    })
})