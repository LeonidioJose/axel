import { MessageEmbed } from 'discord.js';

export default class AxelEmbed extends MessageEmbed {
  constructor(user: any, data = {}) {
    super(data);
    this.setColor(require('../util/colours.json').main);
  }

  setDescriptionFromBlockArray(blocks: any) {
    this.description = blocks
      .map((lines: any[]): any => lines.filter((l: any): any => !!l).join('\n'))
      .filter((b: string | any[]): any => !!b.length)
      .join('\n\n');
    return this;
  }
}
