import { Message } from 'discord.js';

export const testMessage = ({ content, client, guild }: Message): { valid: boolean; length: number } => {
    const { prefix, mentionWorksAsPrefix, strictPrefix, botName, botNameWorksAsPrefix, customPrefixAndDefaultAvailable } = client.configs;

    if (mentionWorksAsPrefix && content.startsWith(`<@${client.user.id}>`))
        return { valid: true, length: `<@${client.user.id}>`.length };
    if (mentionWorksAsPrefix && content.startsWith(`<@!${client.user.id}>`))
        return { valid: true, length: `<@!${client.user.id}`.length };
    if (botNameWorksAsPrefix && botName && content.toLocaleLowerCase().startsWith(botName.toLowerCase()))
        return { valid: true, length: botName.length };

    if (guild) {
        const guildPrefix = client.prefixesManager.getPrefix(guild.id);
        if (strictPrefix && content.startsWith(guildPrefix)) return { valid: true, length: guildPrefix.length };
        if (!strictPrefix && content.toLowerCase().startsWith(guildPrefix.toLowerCase()))
            return { valid: true, length: guildPrefix.length };
        if (!customPrefixAndDefaultAvailable) return { valid: false, length: -1 }
    }
    if (strictPrefix && content.startsWith(prefix)) return { valid: true, length: prefix.length };
    if (!strictPrefix && content.toLowerCase().startsWith(prefix.toLowerCase()))
        return { valid: true, length: prefix.length };
    
    return { valid: false, length: -1 };
};
