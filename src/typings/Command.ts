import {
    ChatInputApplicationCommandData,
    CommandInteractionOptionResolver,
    CommandInteraction,
    PermissionsString,
    Message,
    ChannelType,
    User,
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction
} from 'discord.js';
import { AmethystCommand } from '../structures/Command';
import { Precondition } from '../structures/Precondition';
import { AmethystClient } from '../structures/AmethystClient';

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
     * @event `commandDenied` When a command is denied by precondition, the `commandDenied` event is emitted and the metadata depends of your precondition. If you used a precondition from AmethystJS, a `commandDeniedCode` is provided in `<#PreconditionReturn>.metadata.code`
     */
    preconditions?: Precondition[];
    /**
     * These are the types of channel the command can run in
     * It is an array containing `ChannelType` from discord.js
     *
     * ```js
     * const { ChannelType } = require('discord.js');
     *
     * new AmethystCommand({
     *     messageInputChannelTypes: [ ChannelType.GuildText ]
     * });
     * ```
     * @event `commandDenied` When a command is denied by invalid channel type, the `commandDenied` event is emitted and the `metadata` object is `{ channelType: { expected: ChannelType[]; got: ChannelType; } }`
     */
    messageInputChannelTypes?: ChannelType[];
    /**
     * Aliases for the message input command
     * Use all the aliases you want in the array
     *
     * ```js
     * new AmethystCommand({
     *     name: 'mute',
     *     aliases: ['timeout', 'silent']
     * });
     * ```
     */
    aliases?: string[];
    /**
     * Description of the message input command, if you need to use a different description from the slash command description
     *
     * ```js
     * new AmethystComamnd({
     *     description: "Show your inventory",
     *     messageInputDescription: "Manage a member's inventory"
     * });
     * ```
     */
    messageInputDescription?: string;
    /**
     * Name gived to the user context command associated to this command
     *
     * ```js
     * new AmethystCommand({
     *     name: "ban",
     *     description: "Ban member",
     *     userContextName: "Ban the member"
     * })
     * ```
     */
    userContextName?: string;
    /**
     * Name gived to the message context command associated to this command
     *
     * ```js
     * new AmethystCommand({
     *     name: "google",
     *     description: "Google something",
     *     messageContextName: "Google content"
     * })
     * ```
     */
    messageContextName?: string;
} & ChatInputApplicationCommandData;

export type ChatInputRun = (options: {
    /**
     * Interaction that emitted the command
     */
    interaction: CommandInteraction;
    /**
     * Options of the interaction
     */
    options: CommandInteractionOptionResolver;
    /**
     * Amethyst Client
     */
    client: AmethystClient;
}) => void | unknown;
export type MessageRun = (options: {
    /**
     * Message that emitted the command
     */
    message: Message;
    /**
     * Options of the message
     */
    options: {
        /**
         * First argument parsed by the user
         * It can be null if the user parses no arguments
         */
        first: string | null;
        /**
         * Second argument parsed by the user
         * It can be null if the user parses only one argument
         */
        second: string | null;
        /**
         * Arguments parsed for the command
         * Arguments are the rest of the command, splitted by space, after the command name
         *
         * This proprety also includes `first` and `second` arguments in options
         */
        args: string[];
        /**
         * Indicates if arguments have been parsed by the user or not
         */
        emptyArgs: boolean;
        /**
         * Name of the command used by the user to trigger the command
         */
        commandName: string;
    };
    /**
     * Amethyst Client of the command
     */
    client: AmethystClient;
}) => void | unknown;

export type UserContextRun = (options: {
    interaction: UserContextMenuCommandInteraction;
    client: AmethystClient;
    /**
     * User targetted by the command
     * @type User
     */
    user: User;
}) => void | unknown;
export type deniedPayloadInteractionType = 'message' | 'chatInput' | 'userContextMenu' | 'messageContextMenu';
export type MessageContextRun = (options: {
    interaction: MessageContextMenuCommandInteraction;
    client: AmethystClient;
    message: Message;
}) => void | unknown;
export type commandDeniedPayload = {
    /**
     * Indicate if command used is a message input command.
     * If it is false, the command is a slash input comamnd
     * @deprecated Use the type instead
     */
    isMessage: boolean;
    /**
     * Type of the denied command
     */
    type: deniedPayloadInteractionType;
    /**
     * Command used by the user
     *
     * It is an `AmethystCommand`
     */
    command: AmethystCommand;
    /**
     * Interaction used by the user
     *
     * If the value of `isMessage` is true, this value is null
     * If the value of `isMessage` is false, this proprety is a `CommandInteraction`, from discord.js
     */
    interaction?: CommandInteraction;
    /**
     * Message sent by the user
     *
     * If the value of `isMessage` is true, this proprety is a `Message` from discord.js
     * If the value of `isMessage` is false, this proprety is null
     */
    message?: Message;
    /**
     * User that triggered the event and the command
     */
    user: User;
    /**
     * Amethyst client of the command
     */
    client: AmethystClient;
};
export type commandInteractionType<K extends boolean> = K extends true ? 'cached' : K extends false ? 'raw' : 'raw';
