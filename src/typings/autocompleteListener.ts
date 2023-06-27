import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    CacheType,
    CommandInteractionOptionResolver,
    AutocompleteFocusedOption
} from 'discord.js';
import { AmethystClient } from '../structures/AmethystClient';

/**
 * Options of an autocomplete listener
 *
 * @returns ApplicationCommandOptionChoiceData<string, number>[] | Promise<ApplicationCommandOptionChoiceData<string, number>[]>;
 */
export type AutocompleteListenerRun = (options: {
    /**
     * Autocomplete interaction that triggered the listener
     *
     * @type AucompleteInteraction
     */
    interaction: AutocompleteInteraction;
    /**
     * Options you can access within the autocomplete run
     *
     * @type Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getUser' | 'getAttachment' | 'getChannel' | 'getMember' | 'getMentionable' | 'getRole'>
     */
    options: Omit<
        CommandInteractionOptionResolver<CacheType>,
        'getMessage' | 'getUser' | 'getAttachment' | 'getChannel' | 'getMember' | 'getMentionable' | 'getRole'
    >;
    /**
     * Focused interaction of the event
     *
     * @type AutocompleteFocusedOption
     */
    focused: AutocompleteFocusedOption;
    /**
     * Focused value of the event
     *
     * @type string
     */
    focusedValue: string;
    /**
     * Client of the vent
     *
     * @type AmethystClient
     */
    client: AmethystClient;
}) =>
    | ApplicationCommandOptionChoiceData<string | number>[]
    | Promise<ApplicationCommandOptionChoiceData<string | number>[]>;

/**
 * Name of the options handled by the autocomplete
 */
export type autocompleteListenerNamesType = {
    /**
     * Command where the autocomplete is active
     *
     * @type string
     */
    commandName: string;
    /**
     * Optionnal name of the option where the listener is active
     * If not specified, the autocomplete will act on every autocomplete option of the command
     */
    optionName?: string;
}[];
export type AutocompleteListenerOptions = {
    /**
     * Name you want to give to the listener
     */
    listenerName: string;
    /**
     * Names of the options handled by the autocomplete
     */
    commandName: autocompleteListenerNamesType;
    /**
     * Method executed when the autocomplete is triggered
     */
    run: AutocompleteListenerRun;
};
