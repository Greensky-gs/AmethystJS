import { Precondition } from './structures/Precondition';

export { AmethystClient } from './structures/AmethystClient';
export { AmethystCommand } from './structures/Command';
export { Precondition } from './structures/Precondition';
export { AmethystEvent } from './structures/Event';

import DMOnly from './preconditions/DMOnly';
import GuildOnly from './preconditions/GuildOnly';

export const preconditions: Record<string, Precondition> = {
    DMOnly,
    GuildOnly
}