
import { Controller } from '@nestjs/common';
const Alpaca = require('@alpacahq/alpaca-trade-api')
import { UtilService } from '../util.service';

const alpaca = new Alpaca({
  //keyId: 'AK3M7O62D811HCFE70YW',
  //secretKey: 'UFJCgiiad2b3Q0sGgP3dEFH88ZpnfB5d8DAJXLFQ',
  keyId: 'PKPS1GB8TPJKWQ6BYVDD',
  secretKey: 'EjyqeUDSVCbdSro0xWXUqevisDP6F2L5vC6540HX',
  paper: true
});



@Controller('history')
export class HistoryController {
  constructor(private utils: UtilService) {

  }

  async onModuleInit() {
    console.log(`The module has been initialized.`);
    let orders;
    await alpaca.getOrders({
      status: 'open',
      direction: 'desc'
    }).then((resp) => {
      orders = resp;
    }).catch((err) => { console.log(err); });
    console.log(orders);
    /*alpaca.getAccount().then((account) => {
      console.log('Current Account:', account)
    })*/
  }
}
