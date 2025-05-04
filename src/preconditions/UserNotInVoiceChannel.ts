import { GuildMember } from "discord.js";
import { Precondition } from "../structures/Precondition";
import { commandDeniedCode } from "../typings/Client";

export default new Precondition('UserNotInVoiceChannel').setMessageRun(({ message }) => {
    if (message.member?.voice?.channelId) return {
        ok: false,
        message: 'Command executable only if user not in voice channel',
        metadata: {
            code: commandDeniedCode.UserInVoiceChannel
        },
        type: 'message',
        channelMessage: message
    }
    return {
        ok: true,
        type: 'message',
        channelMessage: message
    }

}).setButtonRun(({ button }) => {
    if ((button.member as GuildMember)?.voice?.channelId) return {
        ok: false,
        message: 'Command executable only if user not in voice channel',
        metadata: {
            code: commandDeniedCode.UserInVoiceChannel
        },
        type: 'button',
        buttonInteraction: button
    }
    return {
        ok: true,
        type: 'button',
        buttonInteraction: button
    }
}
).setChatInputRun(({ interaction }) => {
    if ((interaction.member as GuildMember)?.voice?.channelId) return {
        ok: false,
        message: 'Command executable only if user not in voice channel',
        metadata: {
            code: commandDeniedCode.UserInVoiceChannel
        },
        type: 'chatInput',
        interaction
    }
    return {
        ok: true,
        type: 'chatInput',
        interaction
    }
}
).setMessageContextMenuRun(({ interaction }) => {
    if ((interaction.member as GuildMember)?.voice?.channelId) return {
        ok: false,
        message: 'Command executable only if user not in voice channel',
        metadata: {
            code: commandDeniedCode.UserInVoiceChannel
        },
        type: 'messageContextMenu',
        interaction
    }
    return {
        ok: true,
        type: 'messageContextMenu',
        interaction
    }
}
).setUserContextMenuRun(({ interaction }) => {
    if ((interaction.member as GuildMember)?.voice?.channelId) return {
        ok: false,
        message: 'Command executable only if user not in voice channel',
        metadata: {
            code: commandDeniedCode.UserInVoiceChannel
        },
        type: 'userContextMenu',
        interaction
    }
    return {
        ok: true,
        type: 'userContextMenu',
        interaction
    }
}).setModalRun(({ modal }) => {
    if ((modal.member as GuildMember)?.voice?.channelId) return {
        ok: false,
        message: 'Modal executable only if user not in voice channel',
        metadata: {
            code: commandDeniedCode.UserInVoiceChannel
        },
        type: 'modal',
        modal
    }
    return {
        ok: true,
        type: 'modal',
        modal
    }
})