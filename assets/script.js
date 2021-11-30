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

  var getForecast = function (lat, lon) {

    var apiLink =
      forecastWeather +
      "lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=current,minutely,hourly" +
      "&" +
      myApi +
      "&" +
      unit;
    fetch(apiLink)
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        for (var i = 1; i < 6; i++) {
  
          var unixTime = response.daily[i].dt;
          var date = moment.unix(unixTime).format("MM/DD/YY");
          $("#day" + i).html(date);
      
          var weatherIncoUrl =
            "http://openweathermap.org/img/wn/" +
            response.daily[i].weather[0].icon +
            "@2x.png";
          $("#icon" + i).attr("src", weatherIncoUrl);
  
          var temp = response.daily[i].temp.day + " \u00B0F";
          $("#temp" + i).html(temp);
         
          var humidity = response.daily[i].humidity;
          $("#hum" + i).html(humidity + " %");
        }
      });
  };
  
  
  var creatBtn = function (btnText) {
    var btn = $("<button>")
      .text(btnText)
      .addClass("list-group-item list-group-item-action")
      .attr("type", "submit");
    return btn;
  };

  
  var loadSavedCity = function () {
    citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
    if (citiesListArr == null) {
      citiesListArr = [];
    }
    for (var i = 0; i < citiesListArr.length; i++) {
      var cityNameBtn = creatBtn(citiesListArr[i]);
      searchedCities.append(cityNameBtn);
    }
  };

  
  var saveCityName = function (searchCityName) {
    var newcity = 0;
    citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
    if (citiesListArr == null) {
      citiesListArr = [];
      citiesListArr.unshift(searchCityName);
    } else {
      for (var i = 0; i < citiesListArr.length; i++) {
        if (searchCityName.toLowerCase() == citiesListArr[i].toLowerCase()) {
          return newcity;
        }
      }
      if (citiesListArr.length < numOfCities) {
        
        citiesListArr.unshift(searchCityName);
      } else {
        
        citiesListArr.pop();
        citiesListArr.unshift(searchCityName);
      }
    }
    localStorage.setItem("weatherInfo", JSON.stringify(citiesListArr));
    newcity = 1;
    return newcity;
  };


  var createCityNameBtn = function (searchCityName) {
    var saveCities = JSON.parse(localStorage.getItem("weatherInfo"));
  
    if (saveCities.length == 1) {
      var cityNameBtn = creatBtn(searchCityName);
      searchedCities.prepend(cityNameBtn);
    } else {
      for (var i = 1; i < saveCities.length; i++) {
        if (searchCityName.toLowerCase() == saveCities[i].toLowerCase()) {
          return;
        }
      }
      if (searchedCities[0].childElementCount < numOfCities) {
        var cityNameBtn = creatBtn(searchCityName);
      } else {
        searchedCities[0].removeChild(searchedCities[0].lastChild);
        var cityNameBtn = creatBtn(searchCityName);
      }
      searchedCities.prepend(cityNameBtn);
      $(":button.list-group-item-action").on("click", function () {
        BtnClickHandler(event);
      });
    }
  };
  
  
  loadSavedCity();

  var formSubmitHandler = function (event) {
    event.preventDefault();
    
    var searchCityName = $("#city").val().trim();
    var newcity = saveCityName(searchCityName);
    getCityWeather(searchCityName);
    if (newcity == 1) {
      createCityNameBtn(searchCityName);
    }
  };

  var BtnClickHandler = function (event) {
    event.preventDefault();
    
    var searchCityName = event.target.textContent.trim();
    getCityWeather(searchCityName);
  };
  
  $("#searchCityForm").on("submit", function () {
    formSubmitHandler(event);
  });
  $(":button.list-group-item-action").on("click", function () {
    BtnClickHandler(event);
  });