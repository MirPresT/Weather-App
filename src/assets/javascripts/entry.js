import "babel-polyfill";
import {loadApp} from './loadApp.js';


  const index = {
    init: function() {
      this.preText = document.getElementById('.loader-container');
      this.preText.innerHTML = "<h2>Verifying location is available...</h2>";
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
      var parent = this.preText.parentElement.removeChild(this.preText);
      this.insertLoadSpinner();
      loadApp(position);
    },
    insertLoadSpinner: function(){
      var progressBar = document.createElement('div');
      progressBar.className = 'mdl-progress mdl-js-progress';
      progressBar.setAttribute('id','loading-progressBar');
      componentHandler.upgradeElement(progressBar);
      var test = document.querySelector('.loader-container').appendChild(progressBar);
    }
  }
  index.init();
