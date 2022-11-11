import cooldowns from "../maps/cooldowns";
import { AmethystEvent } from "../structures/Event";
import { DebugImportance } from "../typings/Client";

export default new AmethystEvent('interactionCreate', (interaction) => {
    if (interaction.isCommand()) {
        const cmd = interaction.client.chatInputCommands.find(x => x.options.name === interaction.commandName);
        if (!cmd) {
            interaction.reply({
                ephemeral: true,
                content: `:warning: | This is a dev error. Amethyst client didn't find the command. Enable the debug mode for more informations`
            }).catch(() => {});
            interaction.client.debug(`Chat input command ${interaction.commandName} is not loaded on the client, but published to Discord`, DebugImportance.NotUnderstand);
            return;
        }
        const cdCode = `${interaction.user.id}.${interaction.commandName}`;
    }
})