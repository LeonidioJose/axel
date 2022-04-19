import core from '../../core/events';
import Client from '../../Axel';

class Debug extends core {
  public client: Client;

  constructor(client: Client) {
    super({
      name: 'debug',
    });

    this.client = client;
  }

  async run(ready: any) {
    try {
      return this.client.logger.info(ready);
    } catch (err) {
      return this.client.logger.error(err);
    }
  }
}

export default Debug;
