import {
    autocompleteListenerNamesType,
    AutocompleteListenerOptions,
    AutocompleteListenerRun
} from '../typings/autocompleteListener';

export class AutocompleteListener {
    public readonly listenerName: string;
    public readonly names: autocompleteListenerNamesType = [];
    public readonly run: AutocompleteListenerRun;

    constructor(options: AutocompleteListenerOptions) {
        this.names = options.commandName.map((x) => ({
            commandName: x.commandName,
            optionName: x.optionName ?? null
        }));
        this.listenerName = options.listenerName;
        this.run = options.run;
    }
}
