import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MainComponent extends Component {
  @tracked locationDisplay = null;
  @tracked displayGeoLocationRequestButton = false; //some browsers support requesting location permissions explicitly.
  @tracked lat = -1;
  @tracked lon = -1;
  @tracked lastMessages = [];
  @tracked enteredMessage =''
  @tracked invalidMessage =""
  @tracked isMinting=false;
  @tracked isShowingEnableGeoLocationModal = false;
  @tracked isShowingErrorModal = false;
  @service web3service;
  @service walletConnect;
  @service positioning;
  
  @tracked statusMessage = '';
  @tracked posMessage = '';
  @tracked bigStatus = 'please wait a few seconds while i fetch your location!';
  isRequestPending = false;
  appErrorMessage = '';
  blockchainRetries = 1;
  arithmeticLocation = {lat: 0, lon: 0}
  serverRetries=0;

  get isAppReady() {
   return this.positioning.isTracking && this.walletConnect.isConnected && this.isValidPosition;
  }

  get isValidPosition(){
    return this.positioning.arithmeticLocation.lat != -1000000 && this.positioning.arithmeticLocation.lon != -1000000
  }



  @action updateEnteredMessage(e)
  {
    this.enteredMessage = e.target.value;
  }

  get hasValueInserted(){
    return this.enteredMessage.length>0;
  }

  get hasValidMessage(){
    return this.invalidMessage.length===0 && this.enteredMessage.length>0;
  }

  get hasMessages(){
    return this.lastMessages.length>0;
  }

  @action clearMessages(){
    this.lastMessages.clear();
  }

  @action clearMessage(){
    this.enteredMessage = '';
  }


  @action async retrieveMessages() {
    this.isRequestPending = true;
    if(!this.positioning.isTracking) return;
    try {
      
      this.setStatusMessage('asking blockchain for messages');
      const _tmessages = await this.walletConnect.getTeasedMessagForSpot(this.positioning.arithmeticLocation.lon,this.positioning.arithmeticLocation.lat);
      this.lastMessages = _tmessages.map((tm)=>tm.message);


    } catch (reason) {
      this.setStatusMessage('server was not available or could not be reached: ' + reason);
      this.bigStatus = 'server connection failed, retrying (' + this.serverRetries + '/4)';
      this.serverRetries++;
      if(this.serverRetries >= 6)
      {
        this.bigStatus = 'blockchain connection cannot be established, please come back later';
        
        this.setStatusMessage('maybe try refreshing this window?');
        return;
      }
      this.retrieveMessages();
    }
    this.isRequestPending = false;
  }

  @action toggleEnableGeoLocationModal() {
    this.isShowingEnableGeoLocationModal = !this.isShowingEnableGeoLocationModal;
  }

  @action toggleIsShowingErrorModal()
  {
    this.isShowingErrorModal = !this.isShowingErrorModal;
  }

  @action reloadWindow() {
    this.toggleEnableGeoLocationModal();
    window.location.reload();
  }

  @action async mintMessage() {
    try {
      this.isMinting = true;
      this.setStatusMessage('sending messsage');
      await this.walletConnect.mintMessage(this.enteredMessage,this.arithmeticLocation.lon, this.arithmeticLocation.lat, true);
     

    } catch (reason) {
      this.setAppErrorMessage(this.getSolutionForErrorCode(reason.message.match("\\[.*?]")[0]));
      this.toggleIsShowingErrorModal();
    } 
    this.isMinting = false;
    this.enteredMessage = '';
  }

  @action async setUserLocation() {
    this.positioning.updatePosition.on(this.updatePositionEvent)
    let ready = await this.handlePermission();
    console.debug('appstate: ' + ready);
    if (ready == true && !this.positioning.isTracking) {
      //handle requesting permissions
      this.positioning.performInfinite();
    }
  }



  setStatusMessage(msg) {
    this.statusMessage = msg;
  }

  updatePositionEvent=(msg)=> {
    this.posMessage=msg;
    if(!this.isRequestPending)
    {
      this.serverRetries = 0;
      this.setStatusMessage(msg);
      this.retrieveMessages();
    }
  }

  setAppErrorMessage(msg) {
    this.appErrorMessage = msg;
  }


  async handlePermission() {
    //return true if permissions are in order
    console.log('handlepermission');
    await navigator.permissions
      .query({ name: 'geolocation' })
      .then((result) => {
        if (result.state == 'granted') {
          this.setStatusMessage('geolocation-permission: ' + result.state);
          this.displayGeoLocationRequestButton = false;
        } else if (result.state == 'prompt') {
          this.setStatusMessage('geolocation-permission: ' + result.state);
          this.displayGeoLocationRequestButton = false;
        } else if (result.state == 'denied') {
          this.setStatusMessage('geolocation-permission: ' + result.state);
          this.displayGeoLocationRequestButton = true;
        }
        result.addEventListener('change', function () {
          this.setStatusMessage('geolocation-permission: ' + result.state);
        });
      });
    return !this.displayGeoLocationRequestButton;
  }


  @action showHowToRequestGeoLocationPermission() {
    this.toggleEnableGeoLocationModal();
  }



  //expects the code without brackets
  getSolutionForErrorCode(code)
  {
    console.log(code);
    return this._requireSolutions[code];
  }






_requireSolutions =
{
  '[RQ001]': 'Please come back later, if possible, keep up with our social media to stay informed about any issues',
  '[RQ002]': 'Type something into the message field!',
  '[RQ003]': 'You do not have enough fame! Claiming a new location will give you fame, alternatively, wait until some of your messages gather upvotes and earn you fame!',
  '[RQ004]': 'There might have been an error with your location service, refresh the page, if that does not work, restart your device.',
  '[RQ005]': 'You did not unlock this message, this has to be an error in the application, refresh and try again, if that does not work, wait a few minutes and try again.',
  '[RQ006]': 'You do not have enough fame to vote! Claiming a new location will give you fame, alternatively, wait until some of your messages gather upvotes and earn you fame!',        
  '[RQ007]': 'There has been an internal error in the application! Please refresh the page, if the error persists, restart your device!',
  '[RQ008]': 'You do not have enough fame for this action!  Claiming a new location will give you fame, alternatively, wait until some of your messages gather upvotes and earn you fame!',
  '[RQ009]': 'You do not have messagecoins for this spot! You can convert fame into messageCoins and create messages, either do this manually or enable autoConvert!'
}


}
