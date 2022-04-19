import core from '../../core/commands';
import Client from '../../Axel';
import runner from '../../modules/Runners/Javascript'
import Message from '../../api/@types/Message'

export default class test extends core {
  constructor(client: Client) {
    super({
      name: 'runcode',
      usage: 'u',
      description: '',
      syntax: 'a',
    },client);
  }
  async run(msg: Message, args: Array<string>, t: any) {
    if(args[0]?.toLowerCase()?.includes("js") || args[0]?.toLowerCase()?.includes("javascript")) {
        let arg = args.slice(1).join(" ").replace(/^`{3}(js)?|`{3}(javascript)?|`{3}$/g,'')
        let result = runner(arg)

        msg.quote(`
            \`\`\`js\n${result}\`\`\`
        `)
    } else if(args[0]?.toLowerCase().includes("lua")) {

    }
  }
}