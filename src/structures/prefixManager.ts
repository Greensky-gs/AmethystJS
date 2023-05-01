import prefixes from '../maps/prefixes';
import { AmethystClient } from './AmethystClient';

/**
 * Prefixes manager for `AmethystClient`
 */
export class PrefixesManager {
    /**
     * Client of the prefixes manager
     * 
     * @readonly
     */
    public readonly client: AmethystClient;

    /**
     * 
     * @param client AmethystClient
     */
    constructor(client: AmethystClient) {
        this.client = client;
    }
    public getPrefix(guildId: string) {
        return prefixes.get(guildId) ?? this.client.configs.prefix;
    }
    public setPrefix({ guildId, prefix }: { guildId: string; prefix: string }) {
        prefixes.set(guildId, prefix);
    }
    public get list() {
        return prefixes;
    }
    public get json() {
        const array: { guildId: string; prefix: string }[] = [];
        this.list.forEach((v, k) => {
            array.push({
                prefix: v,
                guildId: k
            });
        });

        return array;
    }
    public samePrefix(prefix: string) {
        return this.json.filter((x) => x.prefix === prefix);
    }
}
