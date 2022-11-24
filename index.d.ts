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
import { PreconditionButtonRun, PreconditionChatInputRun, PreconditionMessageRun } from './dist/typings/Precondition';
import {
    AutocompleteListenerOptions,
    AutocompleteListenerRun,
    autocompleteListenerNamesType
} from './dist/typings/autocompleteListener';
import { ChatInputRun, commandDeniedPayload, commandOptions, MessageRun } from './dist/typings/Command';
import { ButtonDenied, ButtonDeniedCode, ButtonHandlerOptions, ButtonHandlerRun } from './dist/typings/ButtonHandler';

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
    ButtonHandlerRun
};
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
    public setButtonRun(run: PreconditionButtonRun): this;

    public get buttonRun(): PreconditionButtonRun;
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
    public readonly names: autocompleteListenerNamesType;
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
export class ButtonHandler {
    public readonly options: ButtonHandlerOptions;
    public constructor(options: ButtonHandlerOptions);

    setRun(run: ButtonHandler): this;
    get run(): ButtonHandlerRun;
}

type preconditionNames = 'GuildOnly' | 'NsfwOnly' | 'DMOnly';
export const preconditions: Record<preconditionNames, Precondition>;
export { waitForInteraction } from './dist/utils/waitForInteraction';
export { waitForMessage } from './dist/utils/waitForMessage';

declare module 'discord.js' {
    interface ClientEvents {
        amethystDebug: [message: string];
        commandDenied: [command: commandDeniedPayload, reason: deniedReason];
        commandError: [command: commandDeniedPayload, reason: errorReason];
        buttonInteraction: [interaction: ButtonInteraction, message: Message];
        selectMenuInteraction: [interaction: SelectMenuInteraction, message: Message];
        modalSubmit: [interaction: ModalSubmitInteraction];
        buttonDenied: [button: ButtonDenied];
    }
    interface Client {
        readonly configs: AmethystClientOptions;

        get messageCommands(): AmethystCommand[];
        get chatInputCommands(): AmethystCommand[];
        get preconditions(): Precondition[];
        get autocompleteListeners(): AutocompleteListener[];
        get butttonHandlers(): ButtonHandler[];

        start(options: startOptions): void;
        debug(msg: string, imp: DebugImportance): void;
    }
}
