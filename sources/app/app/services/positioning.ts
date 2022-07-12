import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class Positioning extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  
  isRequestPending=false;
  @tracked centeredLatitude=-1;
  @tracked centeredLongitude=-1;
  positions=[];
  @tracked isPerforming=false;
  histTracked=0;
  onChangedMessageCallBack=(msg)=>{console.log(msg)}
  updatePosition ={
    on : (callback)=>{
      this.onChangedMessageCallBack = callback;
    }
  }

  constructor(){
    super(...arguments);
  }

  performInfinite() {
    this.isPerforming=true;
    setTimeout(
      function (that) {
        if(!this.isRequestPending) that.retrieveLocation();
        that.performInfinite();
      },
      4000,
      this
    );
  }

  get isTracking(){
    return this.isPerforming;
  }

  retrieveLocation = () => {
    
    console.log('retrievelocation, requestpending: ' + this.isRequestPending);
    this.isRequestPending = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.consumePosition,
        this.showError,
        { maximumAge: 2000, timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      this.updatetStatusMessage('geolocation is not supported by this browser.');
    }
  };

  consumePosition = (position) => {
    if(this.histTracked<3){
      this.histTracked++;
      return;
    }
    this.isRequestPending = false;
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(`found location lat ${lat} lon ${lon}`);
    this.positions =this.positions.length>8? this.positions.slice(this.positions.length-8):this.positions;
    this.positions.push({x:lat,y:lon});
    this.centerPosition(this.positions);
    
  };

  centerPosition = (positions) => {
    const cPos = get_polygon_centroid(positions);
    if(cPos.x.toFixed(5) == this.centeredLatitude.toFixed(5) && cPos.y.toFixed(5) == this.centeredLongitude.toFixed(5)) return;
    this.centeredLatitude = cPos.x;
    this.centeredLongitude = cPos.y;
    const locationDisplay = 'LAT: ' + this.centeredLatitude.toFixed(5) + ' LON: ' + this.centeredLongitude.toFixed(5);
    this.updatetStatusMessage(locationDisplay);
  }

  arithmeticLocation(){
    let arithLat = Math.trunc(this.centeredLatitude * 1000000);
    let arithLon = Math.trunc(this.centeredLongitude * 1000000);
   return {lat:arithLat*1,lon:arithLon*1};
  }

  updatetStatusMessage(msg) {
    this.onChangedMessageCallBack(msg);
  }

  showError = (error) => {

    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.updatetStatusMessage('user denied the request for geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        this.updatetStatusMessage('location information is unavailable.');
        break;
      case error.TIMEOUT:
        this.updatetStatusMessage('the request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        this.updatetStatusMessage('an unknown error occurred.');
        break;
    }

    this.isRequestPending = false;
  }

  
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'positioning': Positioning;
  }
}

function get_polygon_centroid(pts) {
  const cnt = pts.length;
  const weightedPos = pts.reduce((a,p)=>{
    a.x += p.x/cnt;
    a.y += p.y/cnt;
    return a;
  },{x:0,y:0});
  return weightedPos;
}
