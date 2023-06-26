import { Client, ClientEvents, ClientOptions } from 'discord.js';
import {
    AmethystClientOptions,
    DebugImportance,
    deniedReason,
    errorReason,
    startOptions,
    commandDeniedCode,
    waitForType,
    canReactType,
    errorCode,
    waitForMessageType
} from './dist/typings/Client';
import {
    PreconditionButtonRun,
    PreconditionChatInputRun,
    PreconditionMessageRun,
    preconditionRunReturn,
    preconditionType,
    PreconditionModalRun,
    PreconditionMessageContextMenuRun,
    PreconditionUserContextMenuRun
} from './dist/typings/Precondition';
import {
    AutocompleteListenerOptions,
    AutocompleteListenerRun,
    autocompleteListenerNamesType
} from './dist/typings/autocompleteListener';
import {
    ChatInputRun,
    commandDeniedPayload,
    commandOptions,
    MessageContextRun,
    MessageRun,
    UserContextRun,
    commandInteractionType,
    deniedPayloadInteractionType
} from './dist/typings/Command';
import { ButtonDenied, ButtonDeniedCode, ButtonHandlerOptions, ButtonHandlerRun } from './dist/typings/ButtonHandler';
import { PrefixesManager } from './dist/structures/prefixManager';
import { amethystPaginatorOptions } from './dist/structures/Paginator';
import log4js from './dist/utils/log4js';
import { Paginator, paginatorOptions } from 'dsc-pagination';
import { modalHandlerOptions, modalHandlerRun, ModalDenied } from './dist/typings/ModalHandler';

export {
    PreconditionChatInputRun,
    PreconditionMessageRun,
    DebugImportance,
    startOptions,
    AmethystClientOptions,
    ClientOptions,
    commandDeniedCode,
    waitForType,
    errorCode,
    canReactType,
    autocompleteListenerNamesType,
    waitForMessageType,
    ButtonDenied,
    ButtonDeniedCode,
    ButtonHandlerOptions,
    ButtonHandlerRun,
    amethystPaginatorOptions,
    ModalDenied,
    log4js,
    UserContextRun,
    MessageContextRun,
    commandInteractionType,
    deniedPayloadInteractionType
};
export { commandOptions, commandDeniedPayload } from './dist/typings/Command';

/**
 * #### Amethyst Client
 * This is the base of the framework
 *
 * @extends Client from discord.js
 * @example https://github.com/Greensky-gs/lofi-girl
 * @example https://github.com/Greensky-gs/frenchart-bot
 * @example https://github.com/DraverBot/DraverBot
 * @example https://github.com/Greensky-gs/hitomori-summer
 */
export class AmethystClient extends Client {
    /**
     * Options parsed in constructor
     *
     * @readonly
     */
    public readonly configs: AmethystClientOptions;
    /**
     * Prefixes manager of the client
     *
     * @readonly
     */
    public readonly prefixesManager: PrefixesManager;

    /**
     * Construct the Amethyst Client with options of Discord.js and AmethystJS
     * Only the token is required by AmethystJS and folders are used if you need to deploy commands or events
     * Prefix is required if you have message commands
     *
     * ```js
     * const { Partials } = require('discord.js')
     * const { config } = require('dotenv')
     * const { AmethystClient } = require('amethystjs');
     * config();
     *
     * new AmethystClient({
     *     intents: ['Guilds', 'MessageContent', 'GuildMessages'],
     *     partials: [Partials.Channel, Partials.Message]
     * }, {
     *     token: process.env.token,
     *     debug: true,
     *     commandsFolder: './commands',
     *     buttonsFolder: './button',
     *     eventsFolder: './events',
     *     modalHandlersFolder: './modals',
     *     autocompleteListenersFolder: './autocompletes',
     *     preconditionsFolder: './preconditions',
     *     prefix: '!!',
     *     strictPrefix: false,
     *     botName: 'Amethyst',
     *     botNameWorksAsPrefix: true,
     *     mentionWorksAsPrefix: true,
     *     defaultCooldownTime: 10,
     *     waitForDefaultReplies: {
     *         user: "You cannot interact with this messageg",
     *         everyone: "You cannot interact with this message"
     *     }
     * })
     * ```
     *
     * @param options Options required by Discord.js
     * @param configs Options required by AmethystJS
     */
    public constructor(options: ClientOptions, configs: AmethystClientOptions);

    /**
     * Start AmethystClient
     * @param options Options of starting for the bot
     * @returns `voide`
     */
    public start(options: startOptions): void;
    /**
     * Display a message in the console screen
     * @param msg `string` message to display
     * @param imp `DebugImportance` Importance of the message
     * @returns `void`
     */
    public debug(msg: string, imp: DebugImportance): void;

    /**
     * List of all message commands
     * Every command contained in this array has a `messageRun` proprety
     */
    public get messageCommands(): AmethystCommand[];
    /**
     * List of all slash commands
     * Every command contained in this array has a `chatInputRun` proprety
     */
    public get chatInputCommands(): AmethystCommand[];
    /**
     * List of all preconditions of the client
     */
    public get preconditions(): Precondition[];
    /**
     * List of all autocomplete listeners of the client
     */
    public get autocompleteListeners(): AutocompleteListener[];
    /**
     * List of all button handlers of the client
     */
    public get buttonHandlers(): ButtonHandler[];
    /**
     * List of all modal handlers of the client
     */
    public get modalHandlers(): ModalHandler[];
    /**
     * List of all user context menu commands
     */
    public get userContextCommands(): AmethystCommand[];
    /**
     * List of all message context menu commands
     */
    public get messageContextCommands(): AmethystCommand[];
}

export class Precondition {
    public readonly name: string;

    public constructor(name: string);

    public setChatInputRun(run: PreconditionChatInputRun): this;
    public setMessageRun(run: PreconditionMessageRun): this;
    public setButtonRun(run: PreconditionButtonRun): this;
    public setModalRun(run: PreconditionModalRun): this;
    public setUserContextMenuRun(run: PreconditionUserContextMenuRun): this;
    public setMessageContextMenuRun(run: PreconditionMessageContextMenuRun): this;

    public buttonRun: PreconditionButtonRun;
    public chatInputRun: PreconditionChatInputRun;
    public messageRun: PreconditionMessageRun;
    public modalRun: PreconditionModalRun;
    public userContextMenuRun: PreconditionUserContextMenuRun;
    public messageContextMenuRun: PreconditionMessageContextMenuRun;
}

export class AmethystEvent<K extends keyof ClientEvents> {
    public readonly run: (...args: ClientEvents[K]) => void | unknown;
    public readonly key: K;

    public constructor(key: K, run: (...args: ClientEvents[K]) => void | unknown);
}

export class AutocompleteListener {
    public readonly listenerName: string;
    public readonly names: autocompleteListenerNamesType;
    public readonly run: AutocompleteListenerRun;

    constructor(options: AutocompleteListenerOptions);
}

/**
 * Class Amethyst command
 *
 * Use it in a new file as the default value of the file
 * Use the methods to build the command
 */
export class AmethystCommand {
    /**
     * Options provided when the command is created
     *
     * @readonly
     */
    public readonly options: commandOptions;

    /**
     * Construction of the command
     * Use the `commandOptions` type to parse the object to the constructor
     * @param options Options to provide to Amethyst JS for the command
     *
     * ```js
     * const { preconditions } = require('amethystjs');
     *
     * new AmethystCommand({
     *     name: 'commandName',
     *     description: "Description",
     *     messageInputDescription: "Description of message command", // Optional
     *     cooldown: 5, // Optional
     *     options: [ ], // Options for the slash command - optional
     *     messageInputChannelTypes: [], // Optional
     *     preconditions: [ preconditions.GuildOnly ], // Optional
     *     aliases: [ 'other command names' ], // Optional
     *     permissions: ['Administrator'], // Optional
     *     clientPermissions: ['ManageChannels'], // Optional
     * })
     *     .setChatInputRun(({ interaction, options, user, client }) => {
     *          interaction.reply(`Hello ${user}`);
     *     })
     *     .setMessageRun(({ message, user, options, client }) => {
     *         message.reply(`Hello ${user}`);
     *     })
     * ```
     */
    public constructor(options: commandOptions);

    /**
     * Sets the listener of slash commands for this command
     * @param run ChatInputRun from AmethystJS to be runned on a slash command
     * @returns this
     */
    public setChatInputRun(run: ChatInputRun): this;
    /**
     * Sets the listener of message commands for this command
     * @param run MessageRun from AmethystJS to be runned on a message command
     * @returns this
     */
    public setMessageRun(run: MessageRun): this;
    /**
     * Sets the listener of an user context command
     * @param run userContextRun from AmethystJS to be runned on a user context menu interactions
     * @returns this
     */
    public setUserContextRun(run: UserContextRun): this;
    /**
     * Sets the listener of a message context command
     * @param run messageContextRun from AmethystJS to be runned on a message context menu interactions
     * @returns this
     */
    public setMessageContextRun(run: MessageContextRun): this;
    /**
     * Returns the slash command listener configured for this command
     * @returns `ChatInputRun` from the command, or undefined if not configured
     */
    public get chatInputRun(): ChatInputRun | undefined;
    /**
     * Returns the message command listener configured for this command
     * @returns `MessageRun` from the command, or undefined if not configured
     */
    public get messageRun(): MessageRun | undefined;
    /**
     * Returns the message context command listener configured for this command
     * @reteurns `MessageContextRun` from the command, or undefined if not configured
     */
    public get messageContextMenuRun(): MessageContextRun | undefined;
    /**
     * Returns the user context command listener configured for this command
     * @reteurns `UserContextRun` from the command, or undefined if not configured
     */
    public get userContextMenuRun(): UserContextRun | undefined;
}

/**
 * Class Button Handler
 * 
 * Use it as default in a file located in your button handlers folder
 * Use the methods inside to build the handler
 */
export class ButtonHandler {
    /**
     * Options provided on the creation of the handler
     * 
     * @readonly
     */
    public readonly options: ButtonHandlerOptions;
    /**
     * Run proprety of the handler
     * This is the code executed when a matching button is pressed
     */
    public run: ButtonHandlerRun;
    /**
     * Construct the handler with the options
     * 
     * @param options ButtonHandlerOptions Options of the handler
     */
    public constructor(options: ButtonHandlerOptions);

    /**
     * Set the function called when a matching button is pressed
     * The `ButtonHandler.run` proprety will be modified
     * 
     * @param run ButtonHandlerRun
     * @returns this
     */
    setRun(run: ButtonHandlerRun): this;
}
export class ModalHandler {
    private _modalName: string;
    private _runMethod: modalHandlerRun;
    private _idsList: string[];
    public readonly options: modalHandlerOptions;

    public constructor(options: modalHandlerOptions);

    public run: modalHandlerRun;
    public setRun(run: modalHandlerRun): this;

    public get ids(): string[];
    public get name(): string;
}
export class AmethystError extends Error {
    constructor(message: string);
}
export class AmethystPaginator extends Paginator {}

type preconditionNames = 'GuildOnly' | 'NsfwOnly' | 'DMOnly';
export const preconditions: Record<preconditionNames, Precondition>;
export { waitForInteraction } from './dist/utils/waitForInteraction';
export { waitForMessage } from './dist/utils/waitForMessage';
export { wait } from './dist/utils/wait';
