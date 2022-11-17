import { PreconditionChatInputRun, PreconditionMessageRun } from '../typings/Precondition';

export class Precondition {
    public readonly name: string;
    public chatInputRun: PreconditionChatInputRun;
    public messageRun: PreconditionMessageRun;

    constructor(name: string) {
        this.name = name;
    }
    public setChatInputRun(run: PreconditionChatInputRun) {
        this.chatInputRun = run;
        return this;
    }
    public setMessageRun(run: PreconditionMessageRun) {
        this.messageRun = run;
        return this;
    }
}
