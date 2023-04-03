import { Precondition } from '../structures/Precondition';
import { ButtonDeniedCode } from '../typings/ButtonHandler';
import { commandDeniedCode } from '../typings/Client';

export default new Precondition('GuildOnly')
    .setChatInputRun(({ interaction }) => {
        if (!interaction.guild)
            return {
                ok: false,
                message: 'Command executable in a guild only',
                type: 'chatInput',
                metadata: {
                    code: commandDeniedCode.GuildOnly
                },
                interaction
            };
        return {
            ok: true,
            type: 'chatInput',
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
                type: 'message'
            };
        return {
            ok: true,
            channelMessage: message,
            type: 'message'
        };
    })
    .setButtonRun(({ button }) => {
        if (!button.guild) {
            return {
                ok: false,
                message: 'Button usable in a guild only',
                metadata: {
                    code: ButtonDeniedCode.GuildOnly
                },
                type: 'button',
                button
            };
        }
        return {
            ok: true,
            button,
            type: 'button'
        };
    });
