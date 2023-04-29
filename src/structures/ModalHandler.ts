import { modalHandlerOptions, modalHandlerRun } from "../typings/ModalHandler";
import { AmethystError } from "./AmethystError";

export class ModalHandler {
    private _name: string;
    private _run: modalHandlerRun;
    private _ids: string[];
    public readonly options: modalHandlerOptions;

    constructor(options: modalHandlerOptions) {
        if (!options.name) {
            throw new AmethystError(`Name not provided in modal Handler`);
        }
        if (!options.modalId) {
            throw new AmethystError(`Modal ID not provided in modal handler`);
        }

        this._name = options.name;
        this._ids = typeof options.modalId === 'string' ? [options.modalId] : options.modalId instanceof Array ? [...new Set(options.modalId)] : [];
        if (this._ids.length === 0) {
            throw new AmethystError(`Modal ID not provided in modal handler`);
        }

        this.options = options;
    }

    public get ids(): string[] {
        return this._ids;
    }
    public get name() {
        return this._name;
    }
    public get run() {
        return this._run;
    }
    public setRun(run: modalHandlerRun): this {
        this._run = run;
        return this;
    }
}