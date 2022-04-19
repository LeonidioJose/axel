let intentsObject = {
  GUILDS: Number(1 << 0),
  GUILD_MEMBERS: Number(1 << 1),
  GUILD_BANS: Number(1 << 2),
  GUILD_EMOJIS: Number(1 << 3),
  GUILD_INTEGRATIONS: Number(1 << 4),
  GUILD_WEBHOOKS: Number(1 << 5),
  GUILD_INVITES: Number(1 << 6),
  GUILD_VOICE_STATES: Number(1 << 7),
  GUILD_PRESENCES: Number(1 << 8),
  GUILD_MESSAGES: Number(1 << 9),
  GUILD_MESSAGE_REACTIONS: Number(1 << 10),
  GUILD_MESSAGE_TYPING: Number(1 << 11),
  DIRECT_MESSAGES: Number(1 << 12),
  DIRECT_MESSAGE_REACTIONS: Number(1 << 13),
  DIRECT_MESSAGE_TYPING: Number(1 << 14),
};

export default class Intents {
  public intents: any;
  constructor(intents: Array<string>) {
    this.intents = intents;
  }

  getBitCode(): number {
    let int = 0;

    for (let x of this.intents) {
      if (!Object.keys(intentsObject).includes(x))
        throw new Error(`Intent "${x}" it's not valid`);
      else {
        int += Object.assign(intentsObject)[x];
      }
    }
    return int;
  }
}
