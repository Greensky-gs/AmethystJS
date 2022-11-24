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
                isChatInput: true,
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
                isChatInput: true,
                interaction
            };
        return {
            ok: true,
            isChatInput: true,
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
                isChatInput: false,
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
                isChatInput: false,
                channelMessage: message
            };
        return {
            ok: true,
            isChatInput: false,
            channelMessage: message
        };
    })
    .setButtonRun(({ message }) => {
        if (message.channel.type !== ChannelType.GuildText || ChannelType.GuildAnnouncement || ChannelType.GuildForum) {
            return {
                ok: false,
                message: 'Could not determine channel type',
                metadata: {
                    code: ButtonDeniedCode.UnknownChannelType
                },
                isChatInput: false,
                channelMessage: message
            };
        }
        if (!message.channel.nsfw)
            return {
                ok: false,
                message: 'Channel is not NSFW',
                metadata: {
                    code: ButtonDeniedCode.NsfwOnly
                },
                isChatInput: false,
                channelMessage: message
            };
        return {
            ok: true,
            isChatInput: false,
            channelMessage: message
        };
    });
