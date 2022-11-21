import { AutocompleteListenerOptions, AutocompleteListenerRun } from '../typings/autocompleteListener';

export class AutocompleteListener {
    public readonly name: string = '';
    public readonly names: string[] = [];
    public readonly run: AutocompleteListenerRun;

    constructor(options: AutocompleteListenerOptions) {
        typeof options.commandName === 'string'
            ? (this.name = options.commandName)
            : (this.names = options.commandName);
        this.run = options.run;
    }
}
