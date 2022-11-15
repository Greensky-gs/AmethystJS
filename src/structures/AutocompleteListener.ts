import { AutocompleteListenerOptions, AutocompleteListenerRun } from "../typings/autocompleteListener";

export class AutocompleteListener {
    public readonly name: string;
    public readonly run: AutocompleteListenerRun;

    constructor(options: AutocompleteListenerOptions) {
        this.name = options.commandName;
        this.run = options.run;
    }
}