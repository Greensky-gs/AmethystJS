import {
    ButtonInteraction,
    CacheType,
    CommandInteraction,
    CommandInteractionOptionResolver,
    ContextMenuCommandInteraction,
    Message,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    User,
    UserContextMenuCommandInteraction
} from 'discord.js';
import { AmethystCommand } from '../structures/Command';
import { AmethystClient } from '../structures/AmethystClient';

/**
 * Type of a precondition
 */
export type preconditionType = 'message' | 'chatInput' | 'button' | 'modal' | 'userContextMenu' | 'messageContextMenu';

/**
 * Type of a return of a precondition
 */
export type preconditionRunReturn = {
    /**
     * Optionnal message of the return
     *
     * @type string
     */
    message?: string;
    /**
     * Additionnal datas
     */
    metadata?: {
        /**
         * If the precondition is silent
         *
         * @type boolean
         * @default false
         */
        silent?: boolean;
        /**
         * Optionnal code of a return
         *
         * @type string
         */
        code?: string;
    } & {
        [key: string | number]: any;
    };
    /**
     * If the precondition is success
     *
     * @type boolean
     */
    ok: boolean;
    /**
     * Type of the precondition
     *
     * @type preconditionType
     */
    type: preconditionType;
    /**
     * Interaction in case of chat input
     *
     * @type CommandInteraction<CacheType>
     */
    interaction?: CommandInteraction<CacheType>;
    /**
     * Button interaction in case of button precondition
     *
     * @type ButtonInteraction
     */
    button?: ButtonInteraction;
    /**
     * Message in case of message command
     *
     * @type Message
     */
    channelMessage?: Message;
    /**
     * Modal in case of modal precondition
     *
     * @type ModalSubmitInteraction
     */
    modal?: ModalSubmitInteraction;
    /**
     * Context menu in case of user or message context command
     *
     * @type ContextMenuCommandInteraction
     */
    contextMenu?: ContextMenuCommandInteraction;
};
type BaseRun = {
    /**
     * Command of that triggered the precondition
     *
     * @type AmethystCommand
     */
    command: AmethystCommand;
    /**
     * Client of the precondition
     *
     * @type AmethystClient
     */
    client: AmethystClient;
};

/**
 * Method of a chat input precondition
 */
export type PreconditionChatInputRun = (
    options: {
        /**
         * Interaction that triggered the precondition
         *
         * @type CommandInteraction<CacheType>
         */
        interaction: CommandInteraction<CacheType>;
        /**
         * Options of the command
         *
         * @type CommandInteractionOptionResolver
         */
        options: CommandInteractionOptionResolver;
    } & BaseRun
) => preconditionRunReturn;

/**
 * Method of a message precondition
 */
export type PreconditionMessageRun = (
    options: {
        /**
         * Message that triggered the precondition
         *
         * @type Message
         */
        message: Message;
    } & BaseRun
) => preconditionRunReturn;

/**
 * Method of a button precondition
 */
export type PreconditionButtonRun = (options: {
    /**
     * Button that triggered the precondition
     *
     * @type ButtonInteraction
     */
    button: ButtonInteraction;
    /**
     * User that pressed the button
     *
     * @type User
     */
    user: User;
    /**
     * Message of the button
     *
     * @type Message
     */
    message: Message;
    /**
     * Client of the precondition
     *
     * @type AmethystClient
     */
    client: AmethystClient;
}) => preconditionRunReturn;

/**
 * Method of a modal precondition
 */
export type PreconditionModalRun = (options: {
    /**
     * Modal interaction that triggered the precondition
     *
     * @type ModalSubmitInteraction
     */
    modal: ModalSubmitInteraction;
    /**
     * User that created the precondition
     *
     * @type User
     */
    user: User;
    /**
     * Client of the precondition
     *
     * @type AmethystClient
     */
    client: AmethystClient;
}) => preconditionRunReturn;

/**
 * Method of a user context menu precondition
 */
export type PreconditionUserContextMenuRun = (
    options: {
        /**
         * Interaction of a user context menu command
         *
         * @type UserContextMenuCommandInteraction
         */
        interaction: UserContextMenuCommandInteraction;
        /**
         * User that is targetted by the command
         *
         * @type User
         */
        user: User;
    } & BaseRun
) => preconditionRunReturn;

/**
 * Method of a message context menu precondition
 */
export type PreconditionMessageContextMenuRun = (
    options: {
        /**
         * Interaction of the message context menu
         *
         * @type MessageContextMenuCommandInteraction
         */
        interaction: MessageContextMenuCommandInteraction;
        /**
         * Message targetted by the command
         *
         * @type Message
         */
        message: Message;
    } & BaseRun
) => preconditionRunReturn;
