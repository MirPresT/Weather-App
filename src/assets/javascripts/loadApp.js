import moment from 'moment';

// load app
function loadApp(position){

  var app = {
    start: function(){
      this.progressBar = document.querySelector('#loading-progressBar');
      this.updateProgressBar = this.updateProgress();
      this.cacheDom();
      var { coords:{ latitude:lat, longitude:lon } } = position;
      // Get location name then Get current weather and forecast
      var gettingLocationName = new Promise( this.getLocationName.bind(this,lat,lon) );
      var gettingWeather = new Promise( this.getWeatherAndForecast.bind(this,lat,lon) );

      var tasks = Promise.all([gettingLocationName,gettingWeather]).then(this.handleJSON.bind(this))
    },
    cacheDom: function(){
      this.header = document.querySelector('#header');
      this.headerTempCell = document.querySelector('#temp-cell-number h2');
      this.infoPanel = document.querySelector('#info-panel');
      this.forecastPanel = document.querySelector('#forecast-panel');
      this.loadedApp = document.querySelector('#loaded-app');
    },
    handleJSON: function(response){
      // big destructuring of data .. just have to take a second to follow it
      // this function also passes the required information to smaller functions to update ui
      const [
        locationName,
        {
          currently:{
            windSpeed,temperature,humidity,cloudCover,icon,summery
          },
          daily:{
            data:[
              {
                sunsetTime,
                sunriseTime
              }
            ]
          }
        }
      ] = response;

      // sending in payloads with only relevant info
      this.setHeaderInfo({locationName,temperature,icon});
      this.updateProgressBar.next();
      this.setInfoTab({windSpeed,humidity,sunriseTime,sunsetTime});
      this.updateProgressBar.next();
      this.setForecast({"days":response[1].daily.data});
      this.updateProgressBar.next(); // lass call
      var genObject = this.updateProgressBar.next();

      (genObject.done)? this.revealApp(): console.ERROR('generator function for progress bar isnt done yet');

    },
    revealApp: function(){
      window.setTimeout(function(){
        this.progressBar.remove();
        this.loadedApp.className = "active";
      }.bind(this),500)
    },
    updateProgress: function*(){
      let progress = 0;
      let counter = 0;
      while(progress < 100){
        progress +=20; // the progress will be updated 5 times
        counter++;
        console.log(counter);
        yield this.progressBar.MaterialProgress.setProgress(progress);
      }
    },
    getLocationName: function(lat,lon,res,rej){
      // get the current location ie neighborhood or city based on lat & long using google maps api
      var urlBase = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
      var googleKey = '&key=AIzaSyArtLLZvhmNHbUOL7DJKyO7TBwArl1jPE0';
      var urlRestrictions = (window.screen.width < 415)
        ? '' // nothing if we are on mobile
        : '&location_type=APPROXIMATE';
      var fullApiUrl = urlBase + lat + ','+ lon + googleKey + urlRestrictions;

      $.getJSON(fullApiUrl, function(data){
        if (data.error_message){
          console.log(data.status + '|' + data.error_message)
          rej()
        } else if (data.status === "OK") {
          console.log('successful location found using google\n');
          this.updateProgressBar.next();
          res(data.results[0].formatted_address)
        } else {
          console.log('other error..',data.status);
          rej(data);
        }
      }.bind(this))
    },
    getWeatherAndForecast: function(lat,lon,res,rej){
      var baseUrl = 'https://api.forecast.io/forecast';
      var forecastKey = 'e10af8d470cd4b3567a15eb36ed235bb';
      var clBk = '?callback=?';
      var url_api = baseUrl + '/' + forecastKey + '/' + lat + ',' + lon + clBk;

      $.getJSON(url_api, function(data){
        this.updateProgressBar.next();
        res(data);
      }.bind(this));

    },
    setHeaderInfo: function(data){
      const {temperature:temp,locationName:name,icon} = data;
      this.headerTempCell.innerHTML = Math.round(temp);
       $('#image-cell').html(this.setIcon('weatherImage',null,icon));
    },
    setInfoTab: function(data){
      let {windSpeed,humidity,sunriseTime,sunsetTime} = data;
      var info = this.infoPanel.children;
      var infoToPlace = [
      `${Math.round(windSpeed)}<span id="mph">mph</span>`,
        `${Math.round(humidity * 100)}<span id="percent">%</span>`,
        `${moment.unix(sunriseTime).format('h:mm')}<span id="period">am</span>`,
        `${moment.unix(sunsetTime).format('h:mm')}<span id="period">pm</span>`
      ];
      var counter = 0;
      for(var i = 0; i < info.length; i++){
          var boxes = info[i].children;
          for (var x = 0; x < boxes.length; x++) {
              if(boxes[x].classList.contains('box-left')){
                boxes[x].firstElementChild.innerHTML = infoToPlace[counter];
                counter++;
              }
          }
      }

      function setWind(spd) {
        [
          [20, 3],
          [40, 1.5],
          [60, 1],
          [80, .8],
          [100, .5]
        ].reduce(function(a, b) {
          if (spd > a[0] && spd <= b[0]) {
            var duration = b[1] + "s";
            $('#tSpinner').css("animation-duration", duration);
          }
          return b;
        }, [0]);
      }

      setWind(windSpeed);
    },
    setForecast: function(data){
      const days = data.days;
      const threeDayForecast = days.filter( (day,index) => {
        return index > 0 && index < 4
      })
      const dayElems = this.forecastPanel.children;
      for(var i = 0; i < dayElems.length; i++){
        let boxes = dayElems[i].children;
        for(var x = 0; x < boxes.length; x++){
          const box = boxes[x];
          if( box.classList.contains('box-date')){
            var unixTime = threeDayForecast[i].time;
            box.children[0].innerHTML = moment.unix(unixTime).format('dddd Do');
          }
          if ( box.classList.contains('box-temp') ) {
            if (box.children[0].tagName === "H3"){
              box.children[0].innerHTML = Math.round(threeDayForecast[i].temperatureMax)
            }
          }
          if( box.classList.contains('box-icon')){
            var icon = this.setIcon( null,'box-icon-svg',threeDayForecast[i].icon );
            box.innerHTML = icon;
          }

        }
      }
    },
    setIcon: function(htmlId, htmlClass, str) {
      // match designed icon to provided icon
      var weatherIcons = [{
        'ids': ['clear-night','clear-day'],
        'tag': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-sun.svg'>",
        'description': 'clear sky'
      }, {
        'ids': ['partly-cloudy-day'],
        'tag': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-sun-clouds.svg'>",
        'description': 'few clouds'
      }, {
        'ids': ['partly-cloudy-night','cloudy'],
        'tag': "<img id='" + htmlId + "'  class='" + htmlClass + "' src='src/assets/images/svg-clouds.svg'>",
        'description': 'cloudy'
      }, {
        'ids': ['rain','hail'],
        'tag': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-rain.svg'>",
        'description': 'shower rain'
      },{
        'ids': ['thunderstorm'],
        'tag': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-lightning.svg'>",
        'description': 'thunderstorm'
      }, {
        'ids': ['hail'],
        'tag': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-snow.svg'>",
        'description': 'snow'
      }, {
        'ids': ['fog','wind'],
        'tag': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-mist.svg'>",
        'description': 'mist'
      }];
      //  iterate over array of image tag objects into single url

      for (var i = 0; i < weatherIcons.length; i++) {
        var obj = weatherIcons[i];
        var idMatches = obj.ids.filter(function(IDstr){
          return str === IDstr;
        });
        if (idMatches.length >= 1){
          return obj.tag;
        }
      };

    }
  }

  app.start();
}

export {loadApp};
