import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';

const TIPS = [
  'Usa la bicicletta invece dell’auto per brevi tragitti!',
  'Riduci il consumo di carne per abbassare la tua impronta ecologica.',
  'Ricordati di spegnere le luci quando esci da una stanza.',
  'Preferisci prodotti locali e di stagione.',
  'Fai la raccolta differenziata!',
  'Controlla i tuoi consumi di acqua e gas.',
  'Inserisci oggi una nuova attività su EcoPasso!',
  'Spegni gli elettrodomestici in standby per risparmiare energia.',
  'Fai la doccia invece del bagno per consumare meno acqua.',
  'Utilizza lampadine a LED per ridurre i consumi elettrici.',
  'Porta la tua borsa riutilizzabile quando fai la spesa.',
  'Compra prodotti sfusi per ridurre gli imballaggi.',
  'Non lasciare il caricabatterie attaccato alla presa inutilmente.',
  'Pianta un albero o delle piante sul balcone per migliorare l’aria.',
  'Condividi l’auto con amici o colleghi per andare al lavoro.',
  'Lava i vestiti a basse temperature per risparmiare energia.',
  'Bevi acqua del rubinetto invece di acquistare bottiglie di plastica.',
  'Ripara invece di buttare: allunga la vita degli oggetti!',
  'Stacca la spina: una passeggiata nella natura fa bene a te e all’ambiente.',
  'Acquista solo ciò che ti serve davvero: meno sprechi, più risparmio.',
];

@Injectable()
export class EmailNotificatorService {
  private readonly logger = new Logger(EmailNotificatorService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly mailer: MailerService,
  ) {}


  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendDailyReminders() {
    const users = await this.usersService.findAll();
    for (const user of users) {
      const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
      await this.mailer.sendMail({
        to: user.email,
        subject: 'EcoPasso: il consiglio green del giorno!',
        text: `${tip}\n\nRicordati di entrare su EcoPasso e inserire le tue attività di oggi!`,
      });
      this.logger.log(`Email inviata a ${user.email}`);
    }
  }

}
