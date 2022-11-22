import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    CacheType,
    CommandInteractionOptionResolver,
    AutocompleteFocusedOption
} from 'discord.js';

export type AutocompleteListenerRun = (options: {
    interaction: AutocompleteInteraction;
    options: Omit<
        CommandInteractionOptionResolver<CacheType>,
        'getMessage' | 'getUser' | 'getAttachment' | 'getChannel' | 'getMember' | 'getMentionable' | 'getRole'
    >;
    focused: AutocompleteFocusedOption;
    focusedValue: string;
}) =>
    | ApplicationCommandOptionChoiceData<string | number>[]
    | Promise<ApplicationCommandOptionChoiceData<string | number>[]>;

export type autocompleteListenerNamesType = { commandName: string; optionName?: string }[]
export type AutocompleteListenerOptions = {
    commandName: string | autocompleteListenerNamesType
    run: AutocompleteListenerRun;
};
