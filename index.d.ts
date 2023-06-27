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

/**
 * #### Precondition for Amethyst JS
 * Precondition to be checked before a command is runned
 */
export class Precondition {
    /**
     * Name of the precondition
     * 
     * @readonly
     */
    public readonly name: string;

    /**
     * Construct the Precondition
     * 
     * @param name string Name of the precondition
     */
    public constructor(name: string);

    /**
     * Set the method to check a chat input command
     * @param run PreconditionChatInputRun Method to be runned to check a chat input command
     * @returns this
     */
    public setChatInputRun(run: PreconditionChatInputRun): this;
    /**
     * Set the method to check a message command
     * @param run PreconditionMessageRun Method to be runned to check a message command
     * @returns this
     */
    public setMessageRun(run: PreconditionMessageRun): this;
    /**
     * Set the method to check a button command
     * @param run PreconditionButtonRun Method to be runned to check a button command
     * @returns this
     */
    public setButtonRun(run: PreconditionButtonRun): this;
    /**
     * Set the method to check a modal command
     * @param run PreconditionModalRun Method to be runned to check a modal command
     * @returns this
     */
    public setModalRun(run: PreconditionModalRun): this;
    /**
     * Set the method to check a user context command
     * @param run PreconditionUserContextMenuRun Method to be runned to check a user context menu command
     * @returns this
     */
    public setUserContextMenuRun(run: PreconditionUserContextMenuRun): this;
    /**
     * Set the method to check a message context command
     * @param run PreconditionMessageContextRun Method to be runned to check a message context command
     * @returns this
     */
    public setMessageContextMenuRun(run: PreconditionMessageContextMenuRun): this;

    /**
     * Method that checks a button command
     * @type PreconditionButtonRun
     */
    public buttonRun: PreconditionButtonRun;
    /**
     * Method that checks a chat input command
     * @type PreconditionChatInputRun
     */
    public chatInputRun: PreconditionChatInputRun;
    /**
     * Method that checks a message command
     * @type PreconditionMessageRun
     */
    public messageRun: PreconditionMessageRun;
    /**
     * Method that checks a modal command
     * @type PreconditionModalRun
     */
    public modalRun: PreconditionModalRun;
    /**
     * Method that checks a user context menu command
     * @type PreconditionUserContextMenuRun
     */
    public userContextMenuRun: PreconditionUserContextMenuRun;
    /**
     * Method that checks a message context menu command
     * @type PreconditionMessageContextMenuRun
     */
    public messageContextMenuRun: PreconditionMessageContextMenuRun;
}

/**
 * #### Event from Amethyst JS
 * Structure that register events
 */
export class AmethystEvent<K extends keyof ClientEvents> {
    /**
     * Method used when the event is triggered
     * 
     * @readonly
     */
    public readonly run: (...args: ClientEvents[K]) => void | unknown;
    /**
     * Key of the event you want to listen
     */
    public readonly key: K;

    /**
     * Construct the event
     * 
     * ```js
     * const { AmethystEvent } = require('amethystjs');
     * const { ActivityType } = require('discord.js');
     * 
     * module.exports = new AmethystEvent('ready', (client) => {
     *     client.user.setActivity({
     *         name: 'Helping you',
     *         type: ActivityType.Playing
     *     });
     * });
     * ```
     * @param key keyof typeof ClientEvents key of the event you want to listen
     * @param run ClientEvents[key] Method to be exezcuted on the selected event
     */
    public constructor(key: K, run: (...args: ClientEvents[K]) => void | unknown);
}

/**
 * #### AutocompleteListener
 * Structure that complete options that can be autocompleted
 */
export class AutocompleteListener {
    /**
     * Name you set to the listener
     * 
     * @readonly
     */
    public readonly listenerName: string;
    /**
     * Names for the commands you want to listen
     * 
     * @readonly
     */
    public readonly names: autocompleteListenerNamesType;
    /**
     * Method runned when an autocomplete interaction matching the names is created
     * 
     * @readonly
     */
    public readonly run: AutocompleteListenerRun;

    /**
     * Construct the structure of the listener
     * 
     * ```js
     * const { AutocompleteListener } = require('amethystjs');
     * const names = require('../data/names.json');
     * 
     * module.exports = new AutocompleteListener({
     *     listernerName: 'names',
     *     commandName: [{ commandName: 'stats' }, { commandName: 'rank', optionName: 'username' }], // This will handle every autocomplete option in `stats` command, and the option username in `rank` command
     *     run: ({ focusedValue, ...options }) => {
     *          return names.filter(x => x.toLowerCase().includes(focusedValue.toLowerCase()) || focusedValue.toLowerCase().includes(x.toLowerCase())).splice(0, 24).map((x) => ({ name: x[0].toUpperCase() + x.slice(1), value: x }));
     *     }
     * })
     * ```
     * 
     * @param options AutocompleteListenerOptions Options given on the creation
     */
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

/**
 * #### Modal Handler
 * Modal handler of Amethyst JS
 */
export class ModalHandler {
    private _modalName: string;
    private _runMethod: modalHandlerRun;
    private _idsList: string[];

    /**
     * Options of the modal handler specified at the creation
     * 
     * @type modalHandlerOptions
     * @readonly
     */
    public readonly options: modalHandlerOptions;

    /**
     * Construct the modal handler
     * 
     * ```js
     * const { ModalHandler, preconditions, log4js } = require('amethystjs');
     * 
     * module.exports = new ModalHandler({
     *     name: 'username',
     *     modalId: 'modal.getUsername',
     *     preconditions: [preconditions.GuildOnly]
     * }).setRun((options) => {
     *     const name = options.modal.fields.getTextInputValue('username');
     * 
     *     client.database.addUsername(name);
     * 
     *     options.modal.reply({
     *         ephemeral: true,
     *         content: "Username registered"
     *     }).catch(log4js.trace);
     * });
     * ```
     * 
     * @param options modalHandlerOptions
     */
    public constructor(options: modalHandlerOptions);

    /**
     * Method runned on a modal submission
     * 
     * @type modalHandlerRun
     */
    public run: modalHandlerRun;
    /**
     * Method to set the run method
     * 
     * @param run Method runned on a modal activation
     * @returns this
     */
    public setRun(run: modalHandlerRun): this;

    /**
     * Get identifiers set in the construction
     */
    public get ids(): string[];
    /**
     * Get the name set in the construction
     */
    public get name(): string;
}

/**
 * Error from Amethyst JS
 * 
 * ```js
 * const { AmethystError } = require('amethystjs');
 * 
 * throw new AmethystError("You cannot use messages without messageContent intent");
 * ```
 */
export class AmethystError extends Error {
    /**
     * Construct the error with a message
     * @param message string Error to display
     */
    constructor(message: string);
}

/**
 * Paginator from AmethystJS
 * The paginator is exactly same than https://npmjs.com/package/dsc-pagination
 */
export class AmethystPaginator extends Paginator {}

type preconditionNames = 'GuildOnly' | 'NsfwOnly' | 'DMOnly' | 'OwnerOnly';
export const preconditions: Record<preconditionNames, Precondition>;
export { waitForInteraction } from './dist/utils/waitForInteraction';
export { waitForMessage } from './dist/utils/waitForMessage';
export { wait } from './dist/utils/wait';
