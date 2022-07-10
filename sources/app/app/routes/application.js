import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
    @service router;
    @service walletConnect;
    
    hasWalletEventsSet = false;
    async beforeModel() {

      
        //instead, create and call web3service.configureweb3
        await this.walletConnect.getIsMintingActive();
        await this.walletConnect.registerHandlers();
      
      }

}
