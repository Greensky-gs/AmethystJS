import { PreconditionRun } from "../typings/Precondition";

export class Precondition {
    public readonly name: string;
    public readonly run: PreconditionRun;

    constructor(name: string, run: PreconditionRun) {
        this.name = name;
        this.run = run;
    }
}