import {
    ButtonInteraction,
    CacheType, CommandInteraction,
    CommandInteractionOptionResolver,
    Message,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    User,
    UserContextMenuCommandInteraction
} from 'discord.js';
import { AmethystCommand } from '../structures/Command';

export type preconditionType = 'message' | 'chatInput' | 'button' | 'modal' | 'userContextMenu' | 'messageContextMenu';
export type preconditionRunReturn = {
    message?: string;
    metadata?: {
        silent?: boolean;
        code?: string;
    } & {
        [key: string | number]: any;
    };
    ok: boolean;
    interaction?: CommandInteraction<CacheType>;
    type: preconditionType;
    button?: ButtonInteraction;
    channelMessage?: Message;
};
type BaseRun = {
    command: AmethystCommand;
};
export type PreconditionChatInputRun = (
    options: {
        interaction: CommandInteraction<CacheType>;
        options: CommandInteractionOptionResolver;
    } & BaseRun
) => preconditionRunReturn;

export type PreconditionMessageRun = (
    options: {
        message: Message;
    } & BaseRun
) => preconditionRunReturn;
export type PreconditionButtonRun = (options: {
    button: ButtonInteraction;
    user: User;
    message: Message;
}) => preconditionRunReturn;
export type PreconditionModalRun = (options: { modal: ModalSubmitInteraction; user: User }) => preconditionRunReturn;
export type PreconditionUserContextMenuRun = (options: { interaction: UserContextMenuCommandInteraction; target: User; command: AmethystCommand; }) => preconditionRunReturn;
export type PreconditionMessageContextMenuRun = (options: { interaction: MessageContextMenuCommandInteraction; target: Message; command: AmethystCommand }) => preconditionRunReturn
