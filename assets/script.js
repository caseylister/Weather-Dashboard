var citiesListArr = [];
var numOfCities = 9;
var myApi = "appid=4656869a8d8816608a5b74aab68efafa";
var unit = "units=imperial";
var dailyWeather = "https://api.openweathermap.org/data/2.5/weather?q=";
var dailyUV = "https://api.openweathermap.org/data/2.5/uvi?";
var forecastWeather = "https://api.openweathermap.org/data/2.5/onecall?";

var searchCityForm = $("#searchCityForm");
var searchedCities = $("#cities");

var getCityWeather = function (searchCityName) {
    var apiLink =
      dailyWeather + searchCityName + "&" + myApi + "&" + unit;
    
    fetch(apiLink).then(function (response) {
      if (response.ok) {
        return response.json().then(function (response) {
          $("#cityName").html(response.name);
          
          var unixTime = response.dt;
          var date = moment.unix(unixTime).format("MM/DD/YY");
          $("#todaysDate").html(date);
          
          var weatherIncoUrl =
            "http://openweathermap.org/img/wn/" +
            response.weather[0].icon +
            "@2x.png";
          $("#todaysIcon").attr("src", weatherIncoUrl);
          $("#todaysTemp").html(response.main.temp + " \u00B0F");
          $("#todaysHumidity").html(response.main.humidity + " %");
          $("#todaysWind").html(response.wind.speed + " MPH");
          
          var lat = response.coord.lat;
          var lon = response.coord.lon;
          getUVIndex(lat, lon);
          getForecast(lat, lon);
        });
      } else {
        alert("Please provide a valid city name.");
      }
    });
  };
  
  var getUVIndex = function (lat, lon) {
    
    var apiLink =
      dailyUV +
      myApi +
      "&lat=" +
      lat +
      "&lon=" +
      lon +
      "&" +
      unit;
    fetch(apiLink)
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
  
        $("#todaysUV").removeClass();
        $("#todaysUV").html(response.value);
        if (response.value < 3) {
          $("#todaysUV").addClass("p-1 rounded bg-success text-white");
        } else if (response.value < 8) {
          $("#todaysUV").addClass("p-1 rounded bg-warning text-white");
        } else {
          $("#todaysUV").addClass("p-1 rounded bg-danger text-white");
        }
      });
  };