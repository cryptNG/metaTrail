import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';


export default class Dashboard extends Component {



    @service web3service;
    @service walletConnect;
    @service router;

    
 

    

  @action async connect()
  {
    try
    {

      await this.walletConnect.connect();
      
    

    }
    catch(err)
    {
      window.alert(err.message);
    }
  }
  

  @action async disconnect()
  {
    try
    {

      await this.walletConnect.disconnect();
      
    

    }
    catch(err)
    {
      window.alert(err.message);
    }
  }
  


}
