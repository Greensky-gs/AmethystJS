import { Precondition } from "../structures/Precondition";
import { AnySelectMenuInteraction, ButtonInteraction, ChatInputCommandInteraction, ModalSubmitInteraction, User } from "discord.js";

export type modalHandlerRun = (options: { modal: ModalSubmitInteraction; user: User; }) => unknown | void;
export type modalHandlerOptions = {
    preconditions?: Precondition[];
    name: string;
    modalId: string | string[];
}