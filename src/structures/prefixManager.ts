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
    /**
     * Gets the custom prefix of a server
     * 
     * ```js
     * new AmethystCommand({
     *     name: "prefix",
     *     description: "Show the prefix of the server"
     * }).setChatInputRun(({ interaction, client }) => {
     *     const prefix = client.prefixesManager.getPrefix(interaction.guild.id);
     *     interaction.reply(`The prefix is \`${prefix}\``)
     * });
     * ```
     * @param guildId Identifier of the server you want to get the prefix
     * @returns The prefix of the server as a string. If not, returns the default prefix of the bot
     */
    public getPrefix(guildId: string) {
        return prefixes.get(guildId) ?? this.client.configs.prefix;
    }
    /**
     * Sets the prefix of a server
     * 
     * ```js
     * new AmethystCommand({
     *     name: "setprefix",
     *     description: "Set the prefix of the server",
     *     options: [{
     *         name: "prefix",
     *         description: "Prefix to set",
     *         required: true,
     *         type: ApplicationCommandOptionType.String
     *     }],
     *     preconditions: [preconditions.GuildOnly, staff]
     * }).setChatInputRun(({ interaction, client, options }) => {
     *     const prefix = options.getString('prefix');
     *     client.prefixesManager.setPrefix(interaction.guild.id, prefix);
     * 
     *     interaction.reply(`Prefix set to \`${prefix\``);
     * })
     * ```
     * @param param0 Informations of the server. guildId is the identifer of the server
     * @returns `void`
     */
    public setPrefix({ guildId, prefix }: { guildId: string; prefix: string }) {
        prefixes.set(guildId, prefix);
    }
    /**
     * Get the list of all prefixes as a map
     * 
     * ```js
     * new AmethystCommand({
     *     name: "prefix",
     *     description: "Show the prefix of the server"
     * }).setChatInputRun(({ interaction, client }) => {
     *     const prefix = client.prefixesManager.list.get(interaction.guild.id);
     *     interaction.reply(`The prefix is \`${prefix}\``)
     * });
     * ```
     * @returns `Map<string, string>` Map of all prefixes. The key is a server ID
     */
    public get list() {
        return prefixes;
    }
    /**
     * Get the list of all prefixes as a json array
     * 
     * ```js
     * new AmethystCommand({
     *     name: "delallprefixes",
     *     description: "Delete all servers with a duplicated prefix",
     *     preconditions: [devOnly]
     * }).setMessageRun(({ message, client }) => {
     *     const duplicates = [];
     *     const tested = [];
     *     client.prefixesManager.json.forEach((x) => {
     *         if (tested.includes(x.prefix)) {
     *             duplicates.push(x);
     *         } else {
     *             tested.push(x.prefix)
     *         }
     *     });
     * 
     *     duplicates.forEach((dup) => {
     *         client.prefixesManager.setPrefix(dup.guildId, client.configs.prefix);
     *     });
     * 
     *     message.reply(`Found ${duplicates.length} duplicates`);
     * });
     * ```
     * 
     * @returns `{prefix: string; guildId: string}[]` Array of all prefixes
     */
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
    /**
     * Gets all the servers with a given prefix
     *
     * ```js 
     * new AmethystCommand({
     *     name: "isoriginal",
     *     description: "Shows how many servers have your prefix"
     * }).setChatInputRun(({ interaction, client }) => {
     *     const same = client.prefixesManager.samePrefix(client.prefixesManager.getPrefix(interaction.guild.id))
     *     interaction.reply(`\`${same.length.toLocaleString(interaction.locale)}\` servers have the same prefix than you`);
     * })
     * ```
     * 
     * @param prefix Prefix to test
     * @returns `{ guildId: string; prefix: string }[]` Array of all the servers with this prefix
     */
    public samePrefix(prefix: string) {
        return this.json.filter((x) => x.prefix === prefix);
    }
}
