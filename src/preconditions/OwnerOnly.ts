import { Precondition } from '../structures/Precondition';
import { commandDeniedCode } from '../typings/Client';

export default new Precondition('OwnerOnly')
    .setChatInputRun(({ interaction }) => {
        if (!interaction.guild) return { ok: true, type: 'chatInput', interaction };
        if (interaction.user.id !== interaction.guild.ownerId)
            return {
                ok: false,
                type: 'chatInput',
                interaction,
                message: 'Command usable by the owner only',
                metadata: { code: commandDeniedCode.OwnerOnly }
            };
        return {
            ok: true,
            type: 'chatInput',
            interaction
        };
    })
    .setButtonRun(({ button }) => {
        if (!button.guild) return { ok: true, type: 'button', button };
        if (button.user.id !== button.guild.ownerId)
            return {
                ok: false,
                type: 'button',
                button,
                message: 'Command usable by the owner only',
                metadata: { code: commandDeniedCode.OwnerOnly }
            };
        return {
            ok: true,
            type: 'button',
            button
        };
    })
    .setMessageContextMenuRun(({ interaction }) => {
        if (!interaction.guild) return { ok: true, type: 'messageContextMenu', contextMenu: interaction };
        if (interaction.user.id !== interaction.guild.ownerId)
            return {
                ok: false,
                type: 'messageContextMenu',
                contextMenu: interaction,
                message: 'Command usable by the owner only',
                metadata: { code: commandDeniedCode.OwnerOnly }
            };
        return {
            ok: true,
            type: 'messageContextMenu',
            contextMenu: interaction
        };
    })
    .setMessageRun(({ message }) => {
        if (!message.guild) return { ok: true, type: 'message', channelMessage: message };
        if (message.author.id !== message.guild.ownerId)
            return {
                ok: false,
                type: 'message',
                channelMessage: message,
                message: 'Command usable by the owner only',
                metadata: { code: commandDeniedCode.OwnerOnly }
            };
        return {
            ok: true,
            type: 'message',
            channelMessage: message
        };
    })
    .setUserContextMenuRun(({ interaction }) => {
        if (!interaction.guild) return { ok: true, type: 'userContextMenu', contextMenu: interaction };
        if (interaction.user.id !== interaction.guild.ownerId)
            return {
                ok: false,
                type: 'userContextMenu',
                contextMenu: interaction,
                message: 'Command usable by the owner only',
                metadata: { code: commandDeniedCode.OwnerOnly }
            };
        return {
            ok: true,
            type: 'userContextMenu',
            contextMenu: interaction
        };
    })
    .setModalRun(({ modal }) => {
        if (!modal.guild) return { ok: true, type: 'modal', modal };
        if (modal.user.id !== modal.guild.ownerId) return { ok: false, type: 'modal', modal };
        return {
            ok: true,
            type: 'modal',
            modal
        };
    });
