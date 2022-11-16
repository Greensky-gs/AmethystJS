import { Client, ClientEvents, ClientOptions } from "discord.js";
import { AmethystClientOptions, DebugImportance, deniedReason, errorReason, startOptions } from './dist/typings/Client';
import { PreconditionChatInputRun, PreconditionMessageRun } from "./dist/typings/Precondition";
import { AutocompleteListenerOptions, AutocompleteListenerRun } from './dist/typings/autocompleteListener'
import { ChatInputRun, commandDeniedPayload, commandOptions, MessageRun } from "./dist/typings/Command";

export { PreconditionChatInputRun, PreconditionMessageRun, DebugImportance, startOptions, AmethystClientOptions, ClientOptions };
export { commandOptions, commandDeniedPayload } from './dist/typings/Command';

export class AmethystClient extends Client {
    public readonly configs: AmethystClientOptions;

    public constructor(options: ClientOptions, configs: AmethystClientOptions);

    public start(options: startOptions): void;
    public debug(msg: string, imp: DebugImportance): void;

    public get messageCommands(): AmethystCommand[];
    public get chatInputCommands(): AmethystCommand[];
    public get preconditions(): Precondition[];
    public get autocompleteListeners(): AutocompleteListener[];
}

export class Precondition {
    public readonly name: string;

    public constructor(name: string);

    public setChatInputRun(run: PreconditionChatInputRun): this;
    public setMessageRun(run: PreconditionMessageRun): this;
    public get chatInputRun(): PreconditionChatInputRun;
    public get messageRun(): PreconditionMessageRun;
}

export class AmethystEvent<K extends keyof ClientEvents> {
    public readonly run: (...args: ClientEvents[K]) => void | unknown;
    public readonly key: K;

    public constructor(key: K, run: (...args: ClientEvents[K]) => void | unknown);
}

export class AutocompleteListener {
    public readonly name: string;
    public readonly run: AutocompleteListenerRun;

    public constructor(options: AutocompleteListenerOptions);
}

export class AmethystCommand {
    public readonly options: commandOptions;

    public constructor(options: commandOptions);

    public setChatInputRun(run: ChatInputRun): this;
    public setMessageRun(run: MessageRun): this;

    public get chatInputRun(): ChatInputRun | undefined;
    public get messageRun(): MessageRun | undefined;
}

type preconditionNames = 'GuildOnly' | 'NsfwOnly' | 'DMOnly';
export const preconditions: Record<preconditionNames, Precondition>;

declare module 'discord.js' {
    interface ClientEvents {
        amethystDebug: [message: string];
        commandDenied: [command: commandDeniedPayload, reason: deniedReason];
        commandError: [command: commandDeniedPayload, reason: errorReason];
        buttonInteraction: [interaction: ButtonInteraction, message: Message];
        selectMenuInteraction: [interaction: SelectMenuInteraction, message: Message];
        modalSubmit: [interaction: ModalSubmitInteraction];        
    }
}