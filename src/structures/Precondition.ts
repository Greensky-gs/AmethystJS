import { PreconditionChatInputRun, PreconditionMessageRun } from '../typings/Precondition';

export class Precondition {
    public readonly name: string;
    private chatInputRun: PreconditionChatInputRun;
    private messageInputRun: PreconditionMessageRun;

    constructor(name: string) {
        this.name = name;
    }
    public setChatInputRun(run: PreconditionChatInputRun) {
        this.chatInputRun = run;
    }
    public setMessageRun(run: PreconditionMessageRun) {
        this.messageInputRun = run;
    }
    public get chatInputFunction(): PreconditionChatInputRun {
        return this.chatInputRun;
    }
    public get messageFunction(): PreconditionMessageRun {
        return this.messageInputRun;
    }
}
