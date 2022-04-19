import Canvas from 'canvas';
import Format from 'number-formatter-z';

import Client from '../Axel';

export default class {
  async covid19(
    cases: number,
    deaths: number,
    recovered: number,
    local: any,
    client: Client,
    guild: any,
    casesText: string,
    deathsText: string,
    recoveredText: string,
    phrase: string
  ) {
    let formatOptions = new Format();

    let lang = await client.getGuildLang(String(guild.id));

    const IMAGE_ASSETS = Promise.all([
      Canvas.loadImage('https://i.imgur.com/ZVOEmih.png'),
      Canvas.loadImage(
        'https://www.flaticon.com/svg/static/icons/svg/616/616450.svg'
      ),
    ]);

    const [covid, earth] = await IMAGE_ASSETS;

    const canvas = Canvas.createCanvas(700, 350);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(covid, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = '18px Roboto';
    ctx.fillText(phrase, 150, 75);

    ctx.fillStyle = '#fff';
    ctx.font = '16px Roboto';
    ctx.fillText(deathsText, 115, 150);

    ctx.fillStyle = '#000';
    ctx.font = '14px Roboto';
    ctx.fillText(await formatOptions.formatWithCommas(deaths), 115, 171);

    ctx.fillStyle = '#fff';
    ctx.font = '16px Roboto';
    ctx.fillText(casesText, 335, 150);

    ctx.fillStyle = '#000';
    ctx.font = '14px Roboto';
    ctx.fillText(await formatOptions.formatWithCommas(cases), 335, 171);

    ctx.fillStyle = '#fff';
    ctx.font = '16px Roboto';
    ctx.fillText(recoveredText, 225, 235);

    ctx.fillStyle = '#000';
    ctx.font = '14px Roboto';
    ctx.fillText(await formatOptions.formatWithCommas(recovered), 225, 256);

    if (!local) {
      earth.onload = () => {
        earth.height = 100;
        earth.width = 100;
      };

      ctx.drawImage(earth, 613 - 40, 150, 100, 100);

      if (lang === 'pt') {
        ctx.fillStyle = '#fff';
        ctx.font = '18px Roboto';
        ctx.fillText('Mundo', 595, 275);
      } else {
        ctx.fillStyle = '#fff';
        ctx.font = '18px Roboto';
        ctx.fillText('World', 595, 275);
      }
    } else {
      const ARG_LOCAL = Promise.all([Canvas.loadImage(local.flag)]);

      const [flag] = await ARG_LOCAL;

      flag.onload = () => {
        flag.height = 84;
        flag.width = 56;
      };

      ctx.drawImage(flag, 580, 175, 84, 56);

      ctx.fillStyle = '#fff';
      ctx.font = '18px Roboto';
      ctx.fillText(local.name, 605, 260);
    }

    return canvas.toBuffer();
  }

  async gift(giftCode: any, giftTitle: string) {
    const GIFT_ASSETS = Promise.all([
      Canvas.loadImage('https://i.imgur.com/MWpPJaZ.png'),
    ]);

    const [giftBackground] = await GIFT_ASSETS;

    const canvas = Canvas.createCanvas(700, 350);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(giftBackground, 0, 0, canvas.width, canvas.height);

    ctx.font = '20px Roboto';
    ctx.fillStyle = '#000';
    ctx.fillText(giftCode, 280, 241);

    ctx.font = '25px Roboto';
    ctx.fillStyle = '#fff';
    ctx.fillText(giftTitle, 240, 100);

    return canvas.toBuffer();
  }

  async weather(
    windspeed: any,
    humidity: any,
    temperature: any,
    alert: any,
    locationName: any,
    windSpeedText: string,
    humidityText: string,
    temperatureText: string,
    alertText: string
  ) {
    const WEATHER_ASSETS = Promise.all([
      Canvas.loadImage('https://i.imgur.com/GLJhIaP.png'),
    ]);

    const [weatherBackground] = await WEATHER_ASSETS;

    const canvas = Canvas.createCanvas(1136, 562);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(weatherBackground, 0, 0, canvas.width, canvas.height);

    // ! WINDSPEED

    ctx.font = '15px Roboto';
    ctx.fillStyle = '#fff';
    ctx.fillText(windSpeedText, 140, 60);

    ctx.font = '18px Roboto';
    ctx.fillStyle = '#000';
    ctx.fillText(windspeed, 175, 100);

    // ! HUMIDITY

    ctx.font = '15px Roboto';
    ctx.fillStyle = '#fff';
    ctx.fillText(humidityText, 140, 195);

    ctx.font = '18px Roboto';
    ctx.fillStyle = '#000';
    ctx.fillText(humidity, 175, 235);

    // ! TEMPERATURE

    ctx.font = '15px Roboto';
    ctx.fillStyle = '#fff';
    ctx.fillText(temperatureText, 140, 330);

    ctx.font = '18px Roboto';
    ctx.fillStyle = '#000';
    ctx.fillText(temperature, 175, 370);

    // ! ALERT

    ctx.font = '15px Roboto';
    ctx.fillStyle = '#fff';
    ctx.fillText(alertText, 140, 465);

    ctx.font = '16px Roboto';
    ctx.fillStyle = '#000';
    ctx.fillText(alert, 175, 505);

    // ! LOCATION NAME

    ctx.font = '25px Roboto';
    ctx.fillStyle = '#fff';
    ctx.fillText(locationName, 700, 195);

    return canvas.toBuffer();
  }
}
