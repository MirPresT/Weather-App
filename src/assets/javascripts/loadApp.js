// load app
module.exports = function(position){

  var app = {
    start: function(){
      this.cacheDom();
      var { coords:{ latitude:lat, longitude:lon } } = position;
      // Get location name then Get current weather and forecast
      var gettingLocationName = new Promise( this.getLocationName.bind(this,lat,lon) )
      var gettingWeather = new Promise( this.getWeatherAndForecast.bind(this,lat,lon) )

      var tasks = Promise.all([gettingLocationName,gettingWeather]).then(this.handleJSON.bind(this))
    },
    cacheDom: function(){
      this.header = document.querySelector('#header');
      this.headerTempCell = document.querySelector('#temp-cell-number h2');
      this.infoPanel = document.querySelector('#info-panel');
      this.forecastPanel = document.querySelector("#forecast-panel");

    },
    handleJSON: function(response){
      // big destructuing of data .. just have to take a second to follow it
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
      this.setInfoTab({windSpeed,humidity,sunriseTime,sunsetTime});
      this.setForecast({"days":response[1].daily.data});
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
          res(data.results[0].formatted_address)
        } else {
          console.log('other error..',data.status);
          rej(data);
        }
      })
    },
    getWeatherAndForecast: function(lat,lon,res,rej){
      var baseUrl = 'https://api.forecast.io/forecast';
      var forecastKey = 'e10af8d470cd4b3567a15eb36ed235bb';
      var clBk = '?callback=?';
      var url_api = baseUrl + '/' + forecastKey + '/' + lat + ',' + lon + clBk;

      $.getJSON(url_api, function(data){
        res(data);
      });

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
        `${formatTime(sunriseTime).time}<span id="period">${formatTime(sunriseTime).when}</span>`,
        `${formatTime(sunsetTime).time}<span id="period">${formatTime(sunsetTime).when}</span>`
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

      function formatTime(unixTime){
        var time = new Date( unixTime * 1000).toString().split(' ')[4].slice(0, -3);
        // if there is a zero remove it
        const hr = parseInt(time.slice(0, 2));
        if(parseInt(time.charAt(0)) === 0) {
          time = time.slice(1);
          // time is in the am
          return {when:'am',time:time};
        } else if ( hr > 12) {
          time = hr - 12 + time.slice(2);
          // time is in the pm
          return {when:'pm',time:time};
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
          if (box.children[0] !== undefined ) {
            if (box.children[0].tagName === "H3"){
              box.children[0].innerHTML = Math.round(threeDayForecast[i].temperatureMax)
            }
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
