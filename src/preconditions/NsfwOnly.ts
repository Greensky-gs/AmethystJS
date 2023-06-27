import { ChannelType } from 'discord.js';
import { Precondition } from '../structures/Precondition';
import { ButtonDeniedCode } from '../typings/ButtonHandler';
import { commandDeniedCode } from '../typings/Client';

export default new Precondition('NsfwOnly')
    .setChatInputRun(({ interaction }) => {
        if (
            interaction.channel.type !== ChannelType.GuildText ||
            ChannelType.GuildAnnouncement ||
            ChannelType.GuildForum
        ) {
            return {
                ok: false,
                message: 'Could not determine channel type',
                metadata: {
                    code: commandDeniedCode.UnknownChannelType
                },
                type: 'chatInput',
                interaction
            };
        }
        if (!interaction.channel.nsfw)
            return {
                ok: false,
                message: 'Channel is not nsfw',
                metadata: {
                    code: commandDeniedCode.ChannelNotNsfw
                },
                type: 'chatInput',
                interaction
            };
        return {
            ok: true,
            type: 'chatInput',
            interaction
        };
    })
    .setMessageRun(({ message }) => {
        if (message.channel.type !== ChannelType.GuildText || ChannelType.GuildAnnouncement || ChannelType.GuildForum) {
            return {
                ok: false,
                message: 'Could not determine channel type',
                metadata: {
                    code: commandDeniedCode.UnknownChannelType
                },
                type: 'message',
                channelMessage: message
            };
        }
        if (!message.channel.nsfw)
            return {
                ok: false,
                message: 'Channel is not NSFW',
                metadata: {
                    code: commandDeniedCode.ChannelNotNsfw
                },
                type: 'message',
                channelMessage: message
            };
        return {
            ok: true,
            type: 'message',
            channelMessage: message
        };
    })
    .setButtonRun(({ message, button }) => {
        if (message.channel.type !== ChannelType.GuildText || ChannelType.GuildAnnouncement || ChannelType.GuildForum) {
            return {
                ok: false,
                message: 'Could not determine channel type',
                metadata: {
                    code: ButtonDeniedCode.UnknownChannelType
                },
                type: 'button',
                button
            };
        }
        if (!message.channel.nsfw)
            return {
                ok: false,
                message: 'Channel is not NSFW',
                metadata: {
                    code: ButtonDeniedCode.NsfwOnly
                },
                type: 'button',
                button
            };
        return {
            ok: true,
            type: 'button',
            button
        };
    })
    .setModalRun(({ modal }) => {
        if (
            modal.message.channel.type !== ChannelType.GuildText ||
            ChannelType.GuildAnnouncement ||
            ChannelType.GuildForum
        ) {
            return {
                ok: false,
                message: 'Could not determine channel type',
                metadata: {
                    code: ButtonDeniedCode.UnknownChannelType
                },
                type: 'modal',
                modal
            };
        }
        if (!modal.message.channel.nsfw)
            return {
                ok: false,
                message: 'Channel is not NSFW',
                metadata: {
                    code: ButtonDeniedCode.NsfwOnly
                },
                type: 'modal',
                modal
            };
        return {
            ok: true,
            type: 'modal',
            modal
        };
    })
    .setUserContextMenuRun(({ interaction }) => {
        if (
            interaction.channel.type !== ChannelType.GuildText ||
            ChannelType.GuildAnnouncement ||
            ChannelType.GuildForum
        ) {
            return {
                ok: false,
                message: 'Could not determine channel type',
                metadata: {
                    code: commandDeniedCode.UnknownChannelType
                },
                type: 'userContextMenu',
                contextMenu: interaction
            };
        }
        if (!interaction.channel.nsfw)
            return {
                ok: false,
                message: 'Channel is not NSFW',
                metadata: {
                    code: commandDeniedCode.ChannelNotNsfw
                },
                type: 'userContextMenu',
                contextMenu: interaction
            };
        return {
            ok: true,
            type: 'userContextMenu',
            contextMenu: interaction
        };
    })
    .setMessageContextMenuRun(({ interaction, message }) => {
        if (message.channel.type !== ChannelType.GuildText || ChannelType.GuildAnnouncement || ChannelType.GuildForum) {
            return {
                ok: false,
                message: 'Could not determine channel type',
                metadata: {
                    code: commandDeniedCode.UnknownChannelType
                },
                type: 'messageContextMenu',
                contextMenu: interaction
            };
        }
        if (!message.channel.nsfw)
            return {
                ok: false,
                message: 'Channel is not NSFW',
                metadata: {
                    code: commandDeniedCode.ChannelNotNsfw
                },
                type: 'messageContextMenu',
                contextMenu: interaction
            };
        return {
            ok: true,
            type: 'messageContextMenu',
            contextMenu: interaction
        };
    });
