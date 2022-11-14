import { Client } from 'discord.js';
import { AmethystClientOptions, DebugImportance } from '../typings/Client';

const addBotName = (str: string, confs: AmethystClientOptions) => {
    if (!(confs.botName && confs.botNameWorksAsPrefix)) return str;
    if (str.length === 0) return `(${confs.botName.toLowerCase()})`;

    return str + `|(${confs.botName.toLowerCase()})`;
};
const addBotPing = (str: string, works: boolean, botId: string) => {
    if (!works) return str;
    if (str.length === 0) return `(<(@|@!)${botId}>)`;

    return str + `|(<(@|@!)${botId}>)`;
};
const addBotPrefix = (str: string, confs: AmethystClientOptions) => {
    if (!confs.prefix) return str;

    return str + `(${confs.prefix})`;
};
export const generateMessageRegex = (configs: AmethystClientOptions, client: Client): RegExp | 'invalid' => {
    let str = '';
    str = addBotName(str, configs);
    str = addBotPing(str, configs?.mentionWorksAsPrefix, client.user.id);
    str = addBotPrefix(str, configs);

    if (!str) {
        client.debug(`Invalid message regex: bot name, bot ping and bot prefix are disabled`, DebugImportance.Error);
        return 'invalid';
    }

    const regex = new RegExp(`(${str})([\\s\\S]*)`, configs.strictPrefix === true ? '' : 'i');
};
