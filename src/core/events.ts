interface helpI {
  name: string;
}

class events {
  help: helpI;
  constructor(options: any) {
    this.help = {
      name: options.name,
    };
  }
}

export default events;
