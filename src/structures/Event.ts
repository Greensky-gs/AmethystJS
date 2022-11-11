import { ClientEvents } from 'discord.js';

export class AmethystEvent<K extends keyof ClientEvents> {
    constructor(public key: K, public run: (...args: ClientEvents[K]) => void | unknown) {}
}
