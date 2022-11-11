import { ChatInputApplicationCommandData, CommandInteractionOptionResolver, CommandInteraction, PermissionsString, Message, ChannelType } from 'discord.js';
import { Precondition } from '../structures/Precondition';

export type commandOptions = {
    cooldown?: number;
    permissions?: PermissionsString[];
    clientPermissions?: PermissionsString[];
    preconditions?: Precondition[];
    messageInputChannelTypes?: ChannelType[];
} & ChatInputApplicationCommandData;

export type ChatInputRun = (options: { interaction: CommandInteraction, options: CommandInteractionOptionResolver }) => void | unknown;
export type MessageRun = (options: { message: Message }) => void | unknown;
