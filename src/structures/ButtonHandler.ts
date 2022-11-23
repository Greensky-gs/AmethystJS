import { ButtonHandlerOptions, ButtonHandlerRun } from '../typings/ButtonHandler';

export class ButtonHandler {
    public readonly options: ButtonHandlerOptions;
    private _run: ButtonHandlerRun;

    constructor(options: ButtonHandlerOptions) {
        this.options = {
            customId: options.customId,
            permissions: options.permissions ?? [],
            clientPermissions: options.clientPermissions ?? []
        };
    }
    public setRun(run: ButtonHandlerRun): this {
        this._run = run;
        return this;
    }
    public get run(): ButtonHandlerRun {
        return this._run;
    }
}
