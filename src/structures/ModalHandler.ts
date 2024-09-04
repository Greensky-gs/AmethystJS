import { modalHandlerOptions, modalHandlerRun } from '../typings/ModalHandler';
import { AmethystError } from './AmethystError';

export class ModalHandler {
    private _modalName: string;
    private _runMethod: modalHandlerRun;
    private _idsList: string[];
    public readonly options: modalHandlerOptions;

    constructor(options: modalHandlerOptions) {
        if (!options.name) {
            throw new AmethystError(`Name not provided in modal Handler`);
        }
        if (!options.modalId) {
            throw new AmethystError(`Modal ID not provided in modal handler`);
        }

        this._modalName = options.name;
        this._idsList =
            typeof options.modalId === 'string'
                ? [options.modalId]
                : options.modalId instanceof Array
                  ? [...new Set(options.modalId)]
                  : [];
        if (this._idsList.length === 0) {
            throw new AmethystError(`Modal ID not provided in modal handler`);
        }

        this.options = options;
    }

    public get ids(): string[] {
        return this._idsList;
    }
    public get name() {
        return this._modalName;
    }
    public get run() {
        return this._runMethod;
    }
    public setRun(run: modalHandlerRun): this {
        this._runMethod = run;
        return this;
    }
}
