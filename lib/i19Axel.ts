import deleteString from '../src/functions/deleteFromString';

type optionsInterface = {
  preload: string;
  lang: string;
}

class i19Axel {
  public options: optionsInterface;
  constructor(opt: { preload: string; lang: string }) {
    this.options = {
      preload: opt.preload,
      lang: opt.lang,
    };
  }

  translate(path: string, placesholders?: any): any {
    let splited = path.split(':');
    let splited1 = path.split('.');
    let text = require(`${this.options.preload}/${this.options.lang}/${splited[0]}.json`);

    if (splited1.length > 1) {
      for (let x = 0; x < splited1.length; x++) {
        let textDeleted = deleteString([':', splited[0]], splited1[x]);

        text = text[textDeleted];
      }
    } else {
      text = text[splited[1]];
    }

    let finalText = null;

    if (typeof placesholders === 'object') {
      for (let x in placesholders) {
        let regex = new RegExp('{{' + x + '}}', 'g');

        if (finalText === null) {
          finalText = text.replace(regex, placesholders[x]);
        } else {
          finalText = finalText.replace(regex, placesholders[x]);
        }
      }
    } else {
      return text;
    }

    return finalText;
  }
}

export default i19Axel;
