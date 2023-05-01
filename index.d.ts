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
    PreconditionModalRun
} from './dist/typings/Precondition';
import {
    AutocompleteListenerOptions,
    AutocompleteListenerRun,
    autocompleteListenerNamesType
} from './dist/typings/autocompleteListener';
import { ChatInputRun, commandOptions, MessageRun } from './dist/typings/Command';
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
    log4js
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

    public constructor(options: ClientOptions, configs: AmethystClientOptions);

    public start(options: startOptions): void;
    public debug(msg: string, imp: DebugImportance): void;

    public get messageCommands(): AmethystCommand[];
    public get chatInputCommands(): AmethystCommand[];
    public get preconditions(): Precondition[];
    public get autocompleteListeners(): AutocompleteListener[];
    public get buttonHandlers(): ButtonHandler[];
}

export class Precondition {
    public readonly name: string;

    public constructor(name: string);

    public setChatInputRun(run: PreconditionChatInputRun): this;
    public setMessageRun(run: PreconditionMessageRun): this;
    public setButtonRun(run: PreconditionButtonRun): this;
    public setModalRun(run: PreconditionModalRun): this;

    public buttonRun: PreconditionButtonRun;
    public chatInputRun: PreconditionChatInputRun;
    public messageRun: PreconditionMessageRun;
    public modalRun: PreconditionModalRun;
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
     * Returns the slash command listener configured for this command
     * @returns `ChatInputRun` from the command, or undefined if not configured
     */
    public get chatInputRun(): ChatInputRun | undefined;
    /**
     * Returns the message command listener configured for this command
     * @returns `MessageRun` from the command, or undefined if not configured
     */
    public get messageRun(): MessageRun | undefined;
}
export class ButtonHandler {
    public readonly options: ButtonHandlerOptions;
    public run: ButtonHandlerRun;
    public constructor(options: ButtonHandlerOptions);

    setRun(run: ButtonHandlerRun): this;
}
export class ModalHandler {
    private _run: modalHandlerRun;
    private _name: string;
    private _ids: string[];
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
