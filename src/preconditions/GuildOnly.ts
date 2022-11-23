import { Precondition } from '../structures/Precondition';
import { commandDeniedCode } from '../typings/Client';

export default new Precondition('GuildOnly')
    .setChatInputRun(({ interaction }) => {
        if (!interaction.guild)
            return {
                ok: false,
                message: 'Command executable in a guild only',
                isChatInput: true,
                metadata: {
                    code: commandDeniedCode.GuildOnly
                },
                interaction
            };
        return {
            ok: true,
            isChatInput: true,
            interaction
        };
    })
    .setMessageRun(({ message }) => {
        if (!message.guild)
            return {
                ok: false,
                message: 'Command executable in guild only',
                metadata: {
                    code: commandDeniedCode.GuildOnly
                },
                channelMessage: message,
                isChatInput: false
            };
        return {
            ok: true,
            channelMessage: message,
            isChatInput: false
        };
    })
    .setButtonRun(({ button }) => {
        if (!button.guild) {
            return {
                ok: false
            }
        }
    });
