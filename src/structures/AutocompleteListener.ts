import {
    autocompleteListenerNamesType,
    AutocompleteListenerOptions,
    AutocompleteListenerRun
} from '../typings/autocompleteListener';

export class AutocompleteListener {
    public readonly name: string = '';
    public readonly names: autocompleteListenerNamesType = [];
    public readonly run: AutocompleteListenerRun;

    constructor(options: AutocompleteListenerOptions) {
        typeof options.commandName === 'string'
            ? (this.name = options.commandName)
            : (this.names = options.commandName.map((x) => ({
                  commandName: x.commandName,
                  optionName: x.optionName ?? null
              })));
        this.run = options.run;
    }
}
