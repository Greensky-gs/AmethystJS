// Imports
import { Precondition } from './structures/Precondition';
import DMOnly from './preconditions/DMOnly';
import GuildOnly from './preconditions/GuildOnly';
import NsfwOnly from './preconditions/NsfwOnly';
import * as log4JS from './utils/log4js';
import { AutocompleteListener } from './structures/AutocompleteListener';
import { ButtonHandler } from './structures/ButtonHandler';
import { AmethystCommand } from './structures/Command';
import { ModalHandler } from './structures/ModalHandler';
import { PrefixesManager } from './structures/prefixManager';
import { ButtonDenied } from './typings/ButtonHandler';
import { deniedReason, errorReason, AmethystClientOptions, startOptions, DebugImportance } from './typings/Client';
import { commandDeniedPayload } from './typings/Command';
import { ModalDenied } from './typings/ModalHandler';

// Structures
export { AmethystClient } from './structures/AmethystClient';
export { AmethystCommand } from './structures/Command';
export { Precondition } from './structures/Precondition';
export { AmethystEvent } from './structures/Event';
export { AutocompleteListener } from './structures/AutocompleteListener';
export { ButtonHandler } from './structures/ButtonHandler';
export { AmethystPaginator } from './structures/Paginator';
export { ModalHandler } from './structures/ModalHandler';
export { AmethystError } from './structures/AmethystError';

// Types
export {
    PreconditionChatInputRun,
    preconditionRunReturn,
    PreconditionMessageRun,
    preconditionType,
    PreconditionButtonRun,
    PreconditionModalRun,
    PreconditionMessageContextMenuRun,
    PreconditionUserContextMenuRun
} from './typings/Precondition';
export {
    startOptions,
    AmethystClientOptions,
    commandDeniedCode,
    CommandType,
    errorCode,
    errorReason,
    deniedReason,
    waitForType,
    canReactType,
    DebugImportance,
    waitForMessageType
} from './typings/Client';
export { ButtonDenied, ButtonDeniedCode, ButtonHandlerOptions, ButtonHandlerRun } from './typings/ButtonHandler';
export { ChatInputRun, commandDeniedPayload, commandOptions, MessageRun, UserContextRun, MessageContextRun } from './typings/Command';
export {
    AutocompleteListenerOptions,
    AutocompleteListenerRun,
    autocompleteListenerNamesType
} from './typings/autocompleteListener';
export { amethystPaginatorOptions } from './structures/Paginator';
export { modalHandlerOptions, modalHandlerRun, ModalDenied } from './typings/ModalHandler';

// Objects
export const preconditions: Record<string, Precondition> = {
    DMOnly,
    GuildOnly,
    NsfwOnly
};
export const log4js = log4JS;
export { waitForInteraction } from './utils/waitForInteraction';
export { waitForMessage } from './utils/waitForMessage';
export { wait } from './utils/wait';

declare module 'discord.js' {
    interface ClientEvents {
        amethystDebug: [message: string];
        commandDenied: [command: commandDeniedPayload, reason: deniedReason];
        commandError: [command: commandDeniedPayload, reason: errorReason];
        buttonInteraction: [interaction: ButtonInteraction, message: Message];
        modalSubmit: [interaction: ModalSubmitInteraction];
        buttonDenied: [button: ButtonDenied];
        stringSelectInteraction: [selector: StringSelectMenuInteraction];
        selectMenuInteraction: [selector: AnySelectMenuInteraction];
        roleSelectInteraction: [selector: RoleSelectMenuInteraction];
        userSelectInteraction: [selector: UserSelectMenuInteraction];
        channelSelectInteraction: [selector: ChannelSelectMenuInteraction];
        mentionableSelectInteraction: [selector: MentionableSelectMenuInteraction];
        modalRejected: [reason: ModalDenied];
    }
    interface Client {
        readonly configs: AmethystClientOptions;
        readonly prefixesManager: PrefixesManager;
        get messageCommands(): AmethystCommand[];
        get chatInputCommands(): AmethystCommand[];
        get preconditions(): Precondition[];
        get autocompleteListeners(): AutocompleteListener[];
        get buttonHandlers(): ButtonHandler[];
        get modalHandlers(): ModalHandler[];
        get userContextCommands(): AmethystCommand[];
        get messageContextCommands(): AmethystCommand[];
        start(options: startOptions): void;
        debug(msg: string, imp: DebugImportance): void;
    }
}
