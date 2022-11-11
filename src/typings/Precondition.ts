import { CommandInteraction, CommandInteractionOptionResolver, Message } from 'discord.js';

export type preconditionRunReturn = {
    code: string;
    message: string;
    metadata?: {
        silent?: boolean;
    }
}
export type PreconditionRun = (options: { isMessage: boolean; interaction?: CommandInteraction; options?: CommandInteractionOptionResolver; message?: Message }) => preconditionRunReturn;