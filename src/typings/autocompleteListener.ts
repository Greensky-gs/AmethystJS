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

export type AutocompleteListenerOptions = {
    commandName: string | string[];
    run: AutocompleteListenerRun;
};
