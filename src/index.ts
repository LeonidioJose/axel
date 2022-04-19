import axel from './Axel';
import fs from 'fs';
import path from 'path';
import './util/module-alias';
import webstart from './web/server'
import Manager from  './modules/Axel Music/structures/Managers/Music'
import api from './modules/Axel Music/structures/index'
import intents from '../lib/intents'

let arrayOf = fs.readdirSync(path.resolve(__dirname, '../global/'));

let tokens = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../config/config.json'), 'utf-8')
);

if (arrayOf.includes('onTest.txt')) {
  tokens['token'] =
    'NzQzNTYwNjU5MjY2MDQzOTQ0.XzWc0w.WqH_mkq1FXvDqd1f718e4WAgHQQ';
} else {
  tokens['token'] =
    'NzQzNTYwNDg4MTA0ODg2Mzkz.XzWcqw.kJv4iw29GTJZGdJQGHJf7RzRrdk';
}

fs.writeFileSync(
  path.resolve(__dirname, '../config/config.json'),
  JSON.stringify(tokens)
);

const Axel = new axel({
  fetchAllMembers: true,
  ws: {
    intents: 14223
  }
});

process.on('disconnect',() => console.log("a "))

Axel.API = api

Manager(Axel)

Axel.login(require('../config/config.json').token);

Axel.initCustomAPI();
Axel.initDatabase(String(Axel.user?.id));
Axel.initWinston();
Axel.initCommands();
Axel.initEvents();
webstart.init();
