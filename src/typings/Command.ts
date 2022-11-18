import {
    ChatInputApplicationCommandData,
    CommandInteractionOptionResolver,
    CommandInteraction,
    PermissionsString,
    Message,
    ChannelType
} from 'discord.js';
import { AmethystCommand } from '../structures/Command';
import { Precondition } from '../structures/Precondition';

export type commandOptions = {
    cooldown?: number;
    permissions?: PermissionsString[];
    clientPermissions?: PermissionsString[];
    preconditions?: Precondition[];
    messageInputChannelTypes?: ChannelType[];
    aliases?: string[];
} & ChatInputApplicationCommandData;

export type ChatInputRun = (options: {
    interaction: CommandInteraction;
    options: CommandInteractionOptionResolver;
}) => void | unknown;
export type MessageRun = (options: {
    message: Message;
    options: {
        first: string | null;
        second: string | null;
        args: string[];
        emptyArgs: boolean;
        commandName: string;
    };
}) => void | unknown;
export type commandDeniedPayload = {
    isMessage: boolean;
    command: AmethystCommand;
    interaction?: CommandInteraction;
    message?: Message;
};
export type commandInteractionType<K extends boolean> = K extends true ? 'cached' : K extends false ? 'raw' : 'raw';
