import { Precondition } from '../structures/Precondition';
import { ButtonDeniedCode } from '../typings/ButtonHandler';
import { commandDeniedCode } from '../typings/Client';

export default new Precondition('DMOnly')
    .setChatInputRun(({ interaction }) => {
        if (interaction.guild)
            return {
                ok: false,
                message: 'Command usable in private messages only',
                type: 'chatInput',
                interaction,
                metadata: {
                    code: commandDeniedCode.DMOnly
                }
            };
        return {
            ok: true,
            interaction,
            type: 'chatInput'
        };
    })
    .setMessageRun(({ message }) => {
        if (message.guild) {
            return {
                ok: false,
                type: 'message',
                channelMessage: message,
                message: 'Command usable in private messages only',
                metadata: {
                    code: commandDeniedCode.DMOnly
                }
            };
        }
        return {
            ok: true,
            type: 'message',
            channelMessage: message
        };
    })
    .setButtonRun(({ button }) => {
        if (button.guild)
            return {
                ok: false,
                type: 'button',
                message: 'Button usable in direct messages only',
                button,
                metadata: {
                    code: ButtonDeniedCode.DMOnly
                }
            };
        return {
            ok: true,
            type: 'button',
            button
        };
    })
    .setModalRun(({ modal }) => {
        if (modal.guild) {
            return {
                ok: false,
                type: 'modal',
                message: 'Modal usable in DM only',
                metadata: {
                    code: commandDeniedCode.DMOnly
                },
                modal
            };
        }
        return {
            ok: true,
            type: 'modal',
            modal
        };
    })
    .setMessageContextMenuRun(({ interaction }) => {
        if (interaction.guild) {
            return {
                ok: false,
                type: 'messageContextMenu',
                message: 'Command usable in DM only',
                metadata: {
                    code: commandDeniedCode.DMOnly
                },
                contextMenu: interaction
            };
        }
        return {
            ok: true,
            type: 'messageContextMenu',
            metadata: {
                code: commandDeniedCode.DMOnly
            },
            contextMenu: interaction
        };
    })
    .setUserContextMenuRun(({ interaction }) => {
        if (interaction.guild) {
            return {
                ok: false,
                type: 'userContextMenu',
                message: 'Command usable in DM only',
                metadata: {
                    code: commandDeniedCode.DMOnly
                },
                contextMenu: interaction
            };
        }
        return {
            ok: true,
            type: 'userContextMenu',
            metadata: {
                code: commandDeniedCode.DMOnly
            },
            contextMenu: interaction
        };
    });
