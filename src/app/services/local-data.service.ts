import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage-angular';
import { File } from '@ionic-native/file/ngx';

import { Registro } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {

  history: Registro[] = [];
  fileName = 'history.csv';

  constructor(
    private emailComposer: EmailComposer,
    private navCtrl: NavController,
    private storage: Storage,
    private iab: InAppBrowser,
    private file: File,
  ) {
    this.getHistory();
  }

  async getHistory() {
    this.history = await this.storage.get('history') || [];
  }

  async guardarRegistro(format: string, text: string) {
    await this.getHistory();

    const history = new Registro(format, text);
    this.history.unshift(history);

    this.storage.set('history', this.history);
    this.openHistory(history);
  }

  openHistory(history: Registro) {
    this.navCtrl.navigateForward('/tabs/tab2');

    switch (history.type) {
      case 'HTTP':
        const browser = this.iab.create(history.text, '_system');
        break;

      case 'GEO':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${history.text}`);
        break;
      default:
        break;
    }
  }

  sendMail() {
    const temp = [];
    const titles = 'Tipo,Formato,Creado en,Texto\n';

    temp.push(titles);
    this.history.forEach(element => {
      const row = `${element.type},${element.format},${element.created},${element.text.replace(',' , ' ')}\n`;
      temp.push(row);
    });

    this.createCSVFile(temp.join(''));
  }

  createCSVFile(text: string) {
    this.file.checkFile(this.file.dataDirectory, this.fileName)
    .then(exist => {
      return this.writeCSVFile(text);
    }).catch(err => {
      return this.file.createFile(this.file.dataDirectory, this.fileName, false)
        .then(success => {
          this.createCSVFile(text);
        })
        .catch(err => {
          console.log('No se pudo crear el archivo');
        });
    });
  }

  async writeCSVFile(text: string) {
    await this.file.writeExistingFile(this.file.dataDirectory, this.fileName, text);

    const file = this.file.dataDirectory + this.fileName;

    const email = {
      to: 'matiasbaez2512@gmail.com',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        // 'file://img/logo.png',
        // 'res://icon.png',
        // 'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
        // 'file://README.pdf'
        file
      ],
      subject: 'Historial de Scaneos',
      body: 'Adjungo el historial de los escaneos realizados con la app QRScan app.',
      isHtml: true
    }

    // Send a text message using default options
    this.emailComposer.open(email);
  }

}
