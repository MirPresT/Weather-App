import module_loadApp from './loadApp.js';

  const index = {
    init: function() {
      this.beginLocationCheck();
    },
    beginLocationCheck: function() {
      // check if the browser allows geolocation
      var geolocationIsAvailable = (navigator.geolocation) ? true : false;

      // attempt to get current position
      if (geolocationIsAvailable){
        var optionsObj = {enableHighAccuracy:true};
        // takes a success function, an error function, and an options obj
        navigator.geolocation.getCurrentPosition(this.loadApp,this.getGeoError,optionsObj);
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
      module_loadApp(position);
    }
  }
  index.init();


  // loaaadapp: function(position) {

//         // used in conversions
//         var dIF,
//           dIc,
//           dIIF,
//           dIIc,
//           dIIIF,
//           dIIIc;
//
//         function infoPageLoad(json) {
//           // create weather object
//
//           var current = json.currently;
//           var currentDay = json.daily.data[0];
//           var weatherObj = {
//             'day': new Date(currentDay.time*1000),
//             // 'city': json.name,
//             'fahrenheit': Math.round(current.temperature),
//             'celcius': Math.round((current.temperature - 32) * 5 / 9),
//             'wind': Math.round(current.windSpeed),
//             'dcr': current.summary,
//             'cloudiness': current.cloudCover, // 0 clear .4 scattered .75 broken // 1 completely overcast syls
//             'icon': current.icon,
//             // 'dayNight': json.weather[0].icon.slice(-1),
//             'sunrise': new Date(currentDay.sunriseTime * 1000),
//             'sunset': new Date(currentDay.sunsetTime * 1000),
//             'humidity': Math.round(current.humidity)
//           };
//
//
//           // set default temp to display and insert into html depending on check
//           // have to use a different temp if bottom button is checked
//           if ($('#switch').hasClass('is-checked')) {
//             var tempC = weatherObj.celcius;
//           }
//           $('#temp-cell-number h2').html(tempC || weatherObj.fahrenheit);
//           // insert weather icon where I want;
//           $('#image-cell').html(setIcon("weatherImage", 'NULL', weatherObj.icon));
//           // insert city under temp
//           $('#temp-cell-city p').html(weatherObj.city)
//
//           // insert content into info panel
//           $('#box-wind-spd h3').html(weatherObj.wind + ' mph');
//           $('#box-humidity-percent h3').html(weatherObj.humidity + '%');
//
//           // turn time object into a string and get only the time for both sunrise and sunset
//           var sunrise = weatherObj.sunrise.toString().split(' ')[4].slice(0, -3);
//           var sunset = weatherObj.sunset.toString().split(' ')[4].slice(0, -3);
//           // if first number is 0 ignore
//           sunrise = parseInt(sunrise.charAt(0)) === 0 ? sunrise.slice(1) : sunrise.slice(0, sunrise.length);
//           sunset = parseInt(sunrise.charAt(0)) === 0 ? sunset.slice(1) : sunset.slice(0, sunset.length);
//           // convert from 24 hour time to normal
//           var hr = parseInt(sunset.slice(0, 2)) // get just first two digits
//             // if the hour is larger than 12 subtract 12 and add it back to rest of string
//           sunset = hr > 12 ? hr - 12 + sunset.slice(2) : sunset;
//           // if search is done the request still comes back based on user timezone not search timezone ... Include the timeZone in description for clarity
//           $('#box-sunrise-time h3').html(sunrise + ' am');
//           $('#box-sunset-time h3').html(sunset + ' pm');
//
//           // fade in info panel with add class jquery
//           $('.info-card').addClass('animate-fadein');
//
//           // set speed of wind tourbine
//           function setWind(spd) {
//             [
//               [20, 3],
//               [40, 1.5],
//               [60, 1],
//               [80, .8],
//               [100, .5]
//             ].reduce(function(a, b) {
//               if (spd > a[0] && spd <= b[0]) {
//                 var duration = b[1] + "s";
//                 $('#tSpinner').css("animation-duration", duration);
//               }
//               return b;
//             }, [0]);
//           }
//
//           setWind(weatherObj.wind);
//
//         }
//         infoPageLoad(data); // initial load of top data
//
//         function setIcon(htmlId, htmlClass, iconId) {
//           // match designed icon to provided icon
//           var weatherIcons = [{
//             '01': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-sun.svg'>",
//             'description': 'clear sky'
//           }, {
//             '02': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-sun-clouds.svg'>",
//             'description': 'few clouds'
//           }, {
//             '03': "<img id='" + htmlId + "'  class='" + htmlClass + "' src='src/assets/images/svg-clouds.svg'>",
//             'description': 'scattered clouds'
//           }, {
//             '04': "<img id='" + htmlId + "'  class='" + htmlClass + "' src='src/assets/images/svg-clouds.svg'>",
//             'description': 'broken clouds'
//           }, {
//             '09': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-rain.svg'>",
//             'description': 'shower rain'
//           }, {
//             '10': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-rain.svg'>",
//             'description': 'rain'
//           }, {
//             '11': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-lightning.svg'>",
//             'description': 'thunderstorm'
//           }, {
//             '13': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-snow.svg'>",
//             'description': 'snow'
//           }, {
//             '50': "<img id='" + htmlId + "' class='" + htmlClass + "' src='src/assets/images/svg-mist.svg'>",
//             'description': 'mist'
//           }];
//           var imageToReturn;
//           //  iterate over array of image tag objects into single url
//           var imageToDisplayObj = weatherIcons.map(function(obj) {
//             var prop = Object.keys(obj)[0];
//             if (iconId === prop) {
//               // set image to display because we found a match
//               imageToReturn = obj[prop];
//             }
//           });
//           return imageToReturn
//         }
//         // initial forecast api request using lat and lon used on page load
//         var forecast_coord_url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + userLat + "&lon=" + userLon + "&units=imperial" + "&APPID=7527372a21655cf99344e83d9c657864";
//
//         function loadForecast(requestUrl) {
//           $.ajax({
//
//             type: 'GET',
//             url: requestUrl,
//             success: function(data) {
//
//               var forcastArr = [];
//
//               var arr = Array(data);
//               arr.map(function(a) {
//                 a["list"].map(function(b) {
//                   var date = new Date(b.dt * 1000);
//                   var dayOfMonth = date.getDate();
//                   var time = date.getHours();
//                   var dayOfWeekNumber = date.getDay();
//                   var dayOfWeekWord;
//                   var days = [
//                     [0, 'Sunday'],
//                     [1, 'Monday'],
//                     [2, 'Tuesday'],
//                     [3, 'Wednesday'],
//                     [4, 'Thursday'],
//                     [5, 'Friday'],
//                     [6, 'Saturday']
//                   ];
//                   // convert day of week number to word
//                   days.map(function(a) {
//                     if (a[0] === dayOfWeekNumber) {
//                       dayOfWeekWord = a[1];
//                     }
//                   })
//                   // we only want to act on parts of information given to us in the list
//                   if (dayOfMonth !== currentDate && time === 13) {
//                     var temp = Math.round(b.main.temp);
//                     var fullIcon = b.weather[0].icon; // full icon include (d)ay /(n)ight
//                     icon = fullIcon.slice(0, -1);
//                     forcastArr.push(Array(temp, dayOfWeekWord + ' ' + dayOfMonth,
//                       setIcon(null, 'box-icon-svg', icon)));
//                   }
//                 });
//               });
//
//               // if Celcius button is checked  convert values
//               if ($('#switch').hasClass('is-checked')) {
//                 var tempI = convert(forcastArr[0][0]);
//                 var tempII = convert(forcastArr[1][0]);
//                 var tempIII = convert(forcastArr[2][0]);
//               }
//
//
//               $('#day-1 .box-temp h3').html(tempI || forcastArr[0][0]);
//               $('#day-1 .box-date p').html(forcastArr[0][1]);
//               $('#day-1 .box-icon').html(forcastArr[0][2]);
//               // day 2
//               $('#day-2 .box-temp h3').html(tempII || forcastArr[1][0]);
//               $('#day-2 .box-date p').html(forcastArr[1][1]);
//               $('#day-2 .box-icon').html(forcastArr[1][2]);
//               // day 3
//               $('#day-3 .box-temp h3').html(tempIII || forcastArr[2][0]);
//               $('#day-3 .box-date p').html(forcastArr[2][1]);
//               $('#day-3 .box-icon').html(forcastArr[2][2]);
//
//
//               // avoid making second request for info
//               dIF = forcastArr[0][0];
//               dIc = convert(dIF);
//
//               dIIF = forcastArr[1][0];
//               dIIc = convert(dIIF);
//
//               dIIIF = forcastArr[2][0];
//               dIIIc = convert(dIIIF);
//
//             }
//           });
//         }
//         loadForecast(forecast_coord_url); // initial load of forecast
//
//         // search function to grab new weather data all the information
//         $('input').on('keydown', function(e) {
//           // remove animated fade in so I can add it again on content load
//           $('.info-card').removeClass('animate-fadein');
//           if (event.which == 13 || event.keyCode == 13) {
//             var userInput = document.getElementById('sample1').value;
//             var userArray = userInput.split(",");
//             var cityName = userArray[0];
//             var countryCode = userArray[1];
//             e.preventDefault();
//             var searchUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "," + countryCode + "&units=imperial&APPID=7527372a21655cf99344e83d9c657864";
//             var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "," + countryCode + "&units=imperial&APPID=7527372a21655cf99344e83d9c657864";
//
//             $.ajax({
//               type: 'GET',
//               url: searchUrl, //url generated from search
//               success: function(data) {
//                 infoPageLoad(data); // load info with new data being passed in
//                 loadForecast(forecastUrl); // load forecast based on city from search
//               }
//             });
//           }
//         });
//
//         function convert(n) {
//           return Math.round((n - 32) * .555555);
//         }
//         // grab initial value from dom and convert for celcius version
//         var mTempF = $('#temperature-cell h2').html();
//         var Mc = convert(mTempF);
//
//         // change temperature on switch
//         $('#switch-1').click(function() {
//           if ($('#switch').hasClass('is-checked')) { // convert to F
//
//             $('#temperature-cell h2').html(mTempF);
//             $('#day-1 .box-temp h3').html(dIF);
//             $('#day-2 .box-temp h3').html(dIIF);
//             $('#day-3 .box-temp h3').html(dIIIF);
//             $("#switcher h4").html("F");
//
//           } else {
//             $('#temperature-cell h2').html(Mc);
//             // convert forecast temps
//             $('#day-1 .box-temp h3').html(dIc);
//             $('#day-2 .box-temp h3').html(dIIc);
//             $('#day-3 .box-temp h3').html(dIIIc);
//             // change display text-text
//             $("#switcher h4").html("C");
//
//           }
//         });
//
//       }
