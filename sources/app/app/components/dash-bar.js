import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';


export default class Dashboard extends Component {



    @service web3service;
    @service walletConnect;
    @service router;
  
    @tracked isShowingAddNetworkModal = false;
    
 

    @action toggleIsShowingAddNetworkModal()
    {
      this.isShowingAddNetworkModal = !this.isShowingAddNetworkModal;
    }
    
    @action closeAddNetworkModal()
    {
      this.toggleIsShowingAddNetworkModal();
      location.reload();
    }
    

  @action async connect()
  {
    console.log(this.walletConnect.isConnected);
    try
    {
      try
      {
          await this.walletConnect.connect();
          await this.walletConnect.createSession();
      }
      catch(modalClosed)
      {
        console.log(modalClosed);
        this.toggleIsShowingAddNetworkModal();
      }
     
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
  

  toClipBoardNetworkName()
  {
    navigator.clipboard.writeText('CryptNG-TestNet');
  }
  
  toClipBoardRPCURL()
  {
    navigator.clipboard.writeText('https://testnet.cryptng.com:8545');
  }
  
  toClipBoardChainId()
  {
    navigator.clipboard.writeText('1337');
  }
  
  toClipBoardSymbol()
  {
    navigator.clipboard.writeText('CPAY');
  }
  
  toClipBoardBlockExplorer()
  {
    navigator.clipboard.writeText('https://yitc.ddns.net:4000/');
  }

}
