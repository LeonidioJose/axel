const { APIMessage, Message } = require('discord.js');

export default () => {
  Message.prototype.quote = async function (content: any, options: any) {
    const reference = {
      message_id:
        (!!content && !options
          ? typeof content === 'object' && content.messageID
          : options && options.messageID) || this.id,
      message_channel: this.channel.id,
    };

    const { data: parsed, files } = await APIMessage.create(
      this,
      content,
      options
    )
      .resolveData()
      .resolveFiles();

    let ps = await this.client.api.channels[this.channel.id].messages.post({
      data: { ...parsed, message_reference: reference },
      files,
    })


    let channel = await this.channel.messages.fetch();

    
    //@ts-ignore
    ps.edit = (content: any) => {
      //@ts-ignore
      this.channel.messages.fetch().then((messages: any[]) =>
        messages
          .filter((a: any) => a.id === ps.id)
          //@ts-ignore
          .first()
          ?.edit(content)
      );
    };

    ps.createReactionCollector = (fs: any, opt: any) => {
      return channel
        .filter((a: any) => a.id == ps.id)
        .first()
        ?.createReactionCollector(fs, opt);
    };

    ps.createdTimestamp = channel
      .filter((a: any) => a.id == ps.id)
      .first()?.createdTimestamp;
    ps.guild = this.guild;
    ps.channel = this.channel;

    ps.react = (emj: any) => {
      return channel
        .filter((a: any) => a.id == ps.id)
        .first()
        ?.react(emj);
    };
    return ps;
  };
};
