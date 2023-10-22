import { Message } from "discord.js";
import { fractionnedReplyCallback, fractionnedReplyOptions, fractionnedReplyReference, fractionnedReplyType } from "../typings/fractionnedReply";
import { log4js } from "..";

export class AmethystFractionnedReply<Type extends fractionnedReplyType> {
    private options: fractionnedReplyOptions<Type>;
    private index: number = 0;
    private callback: fractionnedReplyCallback;
    private ref: fractionnedReplyReference<Type>;

    constructor(options: fractionnedReplyOptions<Type>) {
        this.options = options;

        this.start()
    }

    public setOnEnd(calblack: fractionnedReplyCallback) {
        this.callback = calblack
        return this
    }
    private get joiner() {
        return this.options.joiner ?? '\n'
    }
    private get content() {
        return this.options.contents.slice(0, this.index).join(this.joiner)
    }
    private edit() {
        if (this.options.type === 'message') {
            return (this.ref as fractionnedReplyReference<'message'>).edit(this.content)
        } else {
            const ctx = this.ref as fractionnedReplyReference<'interaction'>
            const method = ctx.replied || ctx.deferred ? 'editReply' : 'reply'
            return (ctx[method] as (arg: unknown) => Promise<unknown>)(this.content);
        }
    }
    private end() {
        if (this.callback) this.callback()
    }
    private async start() {
        let edit = true;
        if (this.options.type === 'interaction') {
            (this.ref as fractionnedReplyReference<'interaction'>) = (this.options as fractionnedReplyOptions<'interaction'>).interaction
        } else {
            const resolvable = (this.options as fractionnedReplyOptions<'message'>).resolvable
            if (resolvable instanceof Message) {
                (this.ref as fractionnedReplyReference<'message'>) = resolvable
            } else {
                edit = false;
                this.index++
                const rep = await resolvable.send(this.content).catch(log4js.trace);
                if (!rep) return;
                (this.ref as fractionnedReplyReference<'message'>) = rep;
            }
        }
        if (edit) this.edit();

        for (let i = 0; i < this.options.contents.length; i++) {
            setTimeout(async() => {
                this.index++;
                await this.edit().catch(log4js.trace)

                if (i + 1 === this.options.contents.length) this.end()
            }, (i + 1) * this.options.delay)
        }
    }
}