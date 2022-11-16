import { ClientEvents, ClientOptions } from "discord.js";
import { AmethystClientOptions, DebugImportance, startOptions } from './dist/typings/Client';
import { PreconditionChatInputRun, PreconditionMessageRun } from "./dist/typings/Precondition";
import { AutocompleteListenerOptions, AutocompleteListenerRun } from './dist/typings/autocompleteListener'
import { ChatInputRun, commandOptions, MessageRun } from "./dist/typings/Command";

export { PreconditionChatInputRun, PreconditionMessageRun, DebugImportance, startOptions, AmethystClientOptions, ClientOptions };
import GuildOnly from './dist/preconditions/GuildOnly';

export class AmethystClient {
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