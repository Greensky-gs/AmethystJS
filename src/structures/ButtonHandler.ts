import { ButtonHandlerOptions, ButtonHandlerRun } from '../typings/ButtonHandler';

export class ButtonHandler {
    public readonly options: ButtonHandlerOptions;
    public run: ButtonHandlerRun;

    constructor(options: ButtonHandlerOptions) {
        this.options = {
            customId: options.customId,
            permissions: options.permissions ?? [],
            clientPermissions: options.clientPermissions ?? [],
            preconditions: options?.preconditions ?? [],
            identifiers: options.identifiers ?? []
        };
    }
    public setRun(run: ButtonHandlerRun): this {
        this.run = run;
        return this;
    }
}
