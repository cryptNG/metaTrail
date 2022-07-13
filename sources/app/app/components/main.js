import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {timeout} from 'ember-concurrency';
import { A } from '@ember/array';

class CacheElement{

constructor(hash = {})
{
  this.title = hash.title===undefined ? '': hash.title;
  this.author = hash.author===undefined ? '': hash.author;
  this.unlocked = hash.unlocked===undefined ? false: hash.unlocked;
  this.quantity = hash.quantity===undefined ? 0: hash.quantity;
  this.tokenId = hash.tokenId===undefined ? '' : hash.tokenId;
  this.isOwn = hash.isOwn===undefined ? false: hash.isOwn;
}

@tracked title;
@tracked author;
@tracked unlocked;
@tracked quantity;
@tracked tokenId;
@tracked isOwn;
}

export default class MainComponent extends Component {
  @tracked locationDisplay = null;
  @tracked displayGeoLocationRequestButton = false; //some browsers support requesting location permissions explicitly.
  @tracked lat = -1;
  @tracked lon = -1;
  @tracked loadedCaches = A();
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
  serverRetries=0;
  timeTillReloadCaches=100;

  constructor(){
    super(...arguments);
    this.setUserLocation();
  }

  performInfiniteRetrieveCaches() {
    this.isPerforming=true;
    
    setTimeout(
      function (that) {
        if(that.serverRetries >= 6)
        {
          that.bigStatus = 'blockchain connection cannot be established, please come back later';
          
          that.setStatusMessage('maybe try refreshing this window?');
          return;
        }
        if(!that.isRequestPending && that.isValidPosition) that.retrieveCaches();
        that.performInfiniteRetrieveCaches();
      },
      this.timeTillReloadCaches,
      this
    );
  }

  get locationCaches(){
    return this.loadedCaches;
  }
  get isAppReady() {
   return this.positioning.isTracking && this.isValidPosition;
  }

  get isValidPosition(){
    const pos =this.positioning.arithmeticLocation();
    return pos.lat != -1000000 && pos.lon != -1000000
  }

  get hasOwnCache(){
    return this.loadedCaches.any(x => x.author.toLowerCase() == this.walletConnect.connectedAccount.toLowerCase());
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
    return this.loadedCaches.length>0;
  }

  @action clearMessages(){
    this.loadedCaches.clear();
  }

  @action clearMessage(){
    this.enteredMessage = '';
  }

@tracked isShowingUnlockCacheForFameModal = false;
@tracked cacheToUnlock = null;
  @action toggleUnlockCacheModal()
  {
    this.isShowingUnlockCacheForFameModal = !this.isShowingUnlockCacheForFameModal;
  }

@action async userTriggerUnlockCache()
{
  await this.walletConnect.unlockCache(this.cacheToUnlock);
  
  this.cacheToUnlock = null;
  this.toggleUnlockCacheModal();

  await this.retrieveCaches();
}

  @action async unlockCache(cacheTokenId)
  {
    this.cacheToUnlock = cacheTokenId;
    this.toggleUnlockCacheModal();
  }

  statusMessageLoading = ''

  @action async retrieveCaches() {
    this.isRequestPending = true;
    this.timeTillReloadCaches = this.timeTillReloadCaches+100;
    if(!this.positioning.isTracking) return;
    try {

      if(this.statusMessageLoading.length < 4) this.statusMessageLoading += '.';
      else this.statusMessageLoading = '';

      this.setStatusMessage('asking blockchain for caches' + this.statusMessageLoading);
      const pos = this.positioning.arithmeticLocation();
      const _tmessages = await this.walletConnect.getCachesForSpot(pos.lon,pos.lat);
      const caches = _tmessages.map((tm)=>{
          return new CacheElement( {
            title: tm.title, 
            author: tm.author, 
            unlocked: tm.unlocked,
            quantity: tm.quantity,
            tokenId: tm.tokenId ,
            isOwn: tm.author == this.walletConnect.connectedAccount
          })
        }
      );

      
      
      caches.forEach(c => {
        const lc = this.loadedCaches.find((lc)=>lc.tokenId+''===c.tokenId+'')||null;
        if(lc==null)
        {
          this.loadedCaches.pushObject(c);
        }else{
          lc.quantity=c.quantity;
        }
      });

      this.loadedCaches.sort((a,b)=>a.tokenId>b.tokenId?-1:0 );
    

    } catch (reason) {
      console.log("ERROR");
      console.log(reason);
      this.setStatusMessage('server was not available or could not be reached: ' + reason);
      this.bigStatus = 'server connection failed, retrying (' + this.serverRetries + '/4)';
      this.serverRetries++;
      
      
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
      this.setStatusMessage('sending data to blockchain');
      const pos =this.positioning.arithmeticLocation();
      const lon =pos.lon;
      const lat =pos.lat;
      await this.walletConnect.mintMessage(this.enteredMessage,lon, lat, true);
      this.loadedCaches=[];
      await this.retrieveCaches();

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
      this.performInfiniteRetrieveCaches();
    }
  }

  setStatusMessage(msg) {
    this.statusMessage = msg;
  }

  updatePositionEvent=(msg)=> {
    this.posMessage=msg;
    this.loadedCaches =[];
    this.timeTillReloadCaches=100;
    this.serverRetries = 0;
    this.setStatusMessage(msg);
  
  
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
  '[RQ009]': 'You do not have messagecoins for this spot! You can convert fame into messageCoins and create messages, either do this manually or enable autoConvert!',
  '[RQ010]': 'a cache name cannot exceed 15 characters!',
  '[RQ011]': 'this cache is full, you cannot write more messages!'
}


}
