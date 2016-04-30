import "babel-polyfill";
import {loadApp} from './loadApp.js';


  const index = {
    init: function() {
      this.loaderCont = document.querySelector('.loader-container');
      this.loaderCont.innerHTML = "<h2 id='location-text'>Verifying location is available...</h2>";
      this.beginLocationCheck();
    },
    beginLocationCheck: function() {
      // check if the browser allows geolocation
      var geolocationIsAvailable = (navigator.geolocation) ? true : false;
      // attempt to get current position
      if (geolocationIsAvailable){
        var optionsObj = {enableHighAccuracy:true};
        // takes a success function, an error function, and an options obj
        navigator.geolocation.getCurrentPosition(this.loadApp.bind(this),this.getGeoError,optionsObj);
      } else {
        this.browserSupportError();
      }
    },
    getGeoError: function(){
      /* getCurrentPosition failed because

        1. user clicked block when prompted by browser
        2. gps is disabled on mobile device
        3. location services are blocked on this site
          * If this is the case user must unblock this site in their browser or clear previous settings
      */
      console.error('getCurrentLocation Failed ...');
    },
    browserSupportError: function(){
      /* navigator.geolocation did not create the location object meaning...
        1. Browser does not support geolocation...
      */
      console.error("This browser does not support geoLocation. Please update your browser.");
    },
    loadApp: function(position){
      this.insertLoadSpinner();
      loadApp(position);
    },
    insertLoadSpinner: function(){
      var progressBar = document.createElement('div');
      progressBar.className = 'mdl-progress mdl-js-progress';
      progressBar.setAttribute('id','loading-progressBar');
      componentHandler.upgradeElement(progressBar);
      this.loaderCont.replaceChild(progressBar, this.loaderCont.firstChild);
    }
  }
  index.init();
