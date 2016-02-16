// load app
module.exports = function(position){

  var app = {
    start: function(){
      var { coords:{ latitude:lat, longitude:lon } } = position;
      // Get location name then Get current weather and forecast
      var gettingLocationName = new Promise( this.getLocationName.bind(this,lat,lon) )
      var gettingWeather = new Promise( this.getWeatherAndForecast.bind(this,lat,lon) )

      var tasks = Promise.all([gettingLocationName,gettingWeather]).then(this.handleJSON.bind(this))
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
      this.setForecast();
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
      console.log('Header: ',temp,name,icon);
    },
    setInfoTab: function(data){
      let {windSpeed,humidity,sunriseTime,sunsetTime} = data;

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
      console.log(
        'Info-Tab: ',windSpeed,humidity * 100, formatTime(sunriseTime),formatTime(sunsetTime)
      );

    },
    setForecast: function(data){
      // need
      // {temp , day of week and number, icon} X 3
    }
  }

  app.start();
}
