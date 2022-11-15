import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, CacheType, CommandInteractionOptionResolver } from "discord.js";

export type AutocompleteListenerRun = (options: { interaction: AutocompleteInteraction, options: Omit<
    CommandInteractionOptionResolver<CacheType>,
    'getMessage' | 'getUser' | 'getAttachment' | 'getChannel' | 'getMember' | 'getMentionable' | 'getRole'
  >; }) => ApplicationCommandOptionChoiceData<string | number>[] | Promise<ApplicationCommandOptionChoiceData<string | number>[]>;

export type AutocompleteListenerOptions = {
    commandName: string;
    run: AutocompleteListenerRun;
}