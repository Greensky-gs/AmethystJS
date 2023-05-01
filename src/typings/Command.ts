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
    /**
     * Cooldown time in seconds of the command
     * 
     * Users will have to wait `<#AmethystCommand>.options.cooldown` seconds before use the command again
     * @event `commandDenied` When a command is denied by cooldown, the event `commandDenied` will be emited. The metadata object will contain `{ remainingCooldownTime: number }` as the remaining time in milliseconds
     * @default Default value is the same as `<#AmethystClient>.options.defaultCooldownTime`
     */
    cooldown?: number;
    /**
     * These are the permissions required for the user to use the command in a server
     * It is an array containing `PermissionsString` from discord.js
     * 
     * ```js
     * new AmethystCommand({
     *     permissions: [ "ManageChannels", "BanMembers" ]
     * });
     * ```
     * @event `commandDenied` When a command is denied by ermissions, the `commandDenied` event is emitted and the metadata will be `{ need: PermissionsString[]; got: PermissionsString[]; missing: PermissionsString[] }`
     */
    permissions?: PermissionsString[];
    /**
     * These are the permissions required for the client to use the command in a server.
     * Use this proprety to tell users what permissions your bot needs
     * It is an array containing `PermissionsString` from discord.js
     * 
     * ```js
     * new AmethystCommand({
     *     clientPermissions: [ 'BannMembers', 'ViewAuditLogs' ]
     * });
     * ```
     * @event `commandDenied` When a command is denied by clientPermissions, the `commandDenied` event is emitted and the metadata will be `{ need: PermissionsString[]; got: PermissionsString[]; missing: PermissionsString[] }`
     */
    clientPermissions?: PermissionsString[];
    /**
     * These are the preconditions required by the command before running
     * You can use your own preconditions from the preconditions folder or the default preconditions provided by AmethystJS
     * 
     * ```js
     * const { preconditions } = require('amethystjs');
     * const staffOnly = require('../preconditions/staffOnly');
     * new AmethystCommand({
     *     preconditions: [ preconditions.GuildOnly, staffOnly ]
     * });
     * ```
     * @event `commandDenied` When a command is denied by precondition, the `commandDenied` event is emitted and the metadata depends of your precondition. If you used a precondi
     */
    preconditions?: Precondition[];
    messageInputChannelTypes?: ChannelType[];
    aliases?: string[];
    messageInputDescription?: string;
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
