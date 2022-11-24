import { Precondition } from '../structures/Precondition';
import { ButtonDeniedCode } from '../typings/ButtonHandler';
import { commandDeniedCode } from '../typings/Client';

export default new Precondition('DMOnly')
    .setChatInputRun(({ interaction }) => {
        if (interaction.guild)
            return {
                ok: false,
                message: 'Command usable in private messages only',
                isChatInput: true,
                interaction,
                metadata: {
                    code: commandDeniedCode.DMOnly
                }
            };
        return {
            ok: true,
            interaction,
            isChatInput: true
        };
    })
    .setMessageRun(({ message }) => {
        if (message.guild) {
            return {
                ok: false,
                isChatInput: false,
                channelMessage: message,
                message: 'Command usable in private messages only',
                metadata: {
                    code: commandDeniedCode.DMOnly
                }
            };
        }
        return {
            ok: true,
            isChatInput: false,
            channelMessage: message
        };
    })
    .setButtonRun(({ button }) => {
        if (button.guild)
            return {
                ok: false,
                isChatInput: false,
                isButton: true,
                message: 'Button usable in direct messages only',
                button,
                metadata: {
                    code: ButtonDeniedCode.DMOnly
                }
            };
        return {
            ok: true,
            isChatInput: false,
            isButton: true,
            button
        };
    });
