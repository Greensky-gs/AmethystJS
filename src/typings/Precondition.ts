import { CommandInteraction, CommandInteractionOptionResolver, Message } from 'discord.js';
import { AmethystCommand } from '../structures/Command';

export type preconditionRunReturn = {
    message?: string;
    metadata?: {
        silent?: boolean;
        code?: string;
    };
    ok: boolean;
};
export type PreconditionRun = (options: {
    isMessage: boolean;
    interaction?: CommandInteraction;
    options?: CommandInteractionOptionResolver;
    message?: Message;
    command: AmethystCommand;
}) => preconditionRunReturn;
