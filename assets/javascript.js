$(document).ready(function() {
  //////////////////
  // Variables    //
  //////////////////
  // Requests
  const apikey = "f2919aeb80a924ffadb75fdf60e7f195";
  const weatherURL = "https://api.openweathermap.org/data/2.5/";
  const iconURL = "https://openweathermap.org/img/wn/";
  const args = "&units=imperial";
  const apiArg = "&APPID=";
  const forecastArg = "forecast?q=";
  const weatherArg = "weather?q=";
  const uvArg1 = "uvi?lat=";
  const uvArg2 = "&lon=";

  // Globals
  var today = moment().format("MM/DD/YYYY");
  var uvIndex;

  ////////////////////
  // HTML elements  //
  ////////////////////
  // Header
  var title = $("<h1>")
    .addClass("pageTitle")
    .text("Weather Dashboard");

  // Nav
  var nav = $("<div>").addClass("nav");
  var searchBar = $("<div>").addClass("searchBar");
  var searchTitle = $("<h3>").text("Search for a City:");
  var searchInput = $("<input>").addClass("searchInput");
  var searchSpan = $("<span>").addClass("searchSpan");
  var searchIcon = $("<i>")
    .addClass("fas fa-search fa-sm")
    .attr("id", "citySearch");
  var listCity = $("<ul>").addClass("listCity");

  // Selected City
  var selectedCity = $("<div>").addClass("selectedCity");
  var forecastCityName = $("<h2>").addClass("cityName");
  var weatherIcon = $("<img>");
  var listForecast = $("<ul>");
  var listTemp = $("<li>");
  var listHumidity = $("<li>");
  var listWindSpd = $("<li>");
  var listUV = $("<li>");
  var spanUV = $("<span>").addClass("goodUV");

  // Forecast
  var forecastTitle = $("<h3>")
    .addClass("forecastTitle")
    .text("5-Day Forecast:");

  // Append static elements
  $(".header").append(title);
  $(".container").append(nav);
  nav.append(searchBar);
  searchBar.append(searchTitle);
  searchBar.append(searchInput);
  searchInput.after(searchSpan);
  searchSpan.append(searchIcon);
  searchBar.append(listCity);
  $(".container").append(selectedCity);
  $(".container").append(forecastTitle);
  for (var i = 0; i < 5; i++) {
    var forecastDiv = $("<div>").addClass("forecastDay");
    forecastDiv.attr("id", "day" + i);
    $(".container").append(forecastDiv);
  }

  ////////////////
  // Functions  //
  ////////////////

  // Get previous cities list from localStorage
  function getPrevCities() {
    if (localStorage.getItem("cities") == null) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem("cities"));
    }
  }

  // Run on page load to load history from localStorage
  function getSearchHistory() {
    // clear listCity
    listCity.empty();
    var prevCities = getPrevCities();
    // loop through prevCities and populate the list
    for (var i = 0; i < prevCities.length; i++) {
      var listCityNav = $("<li>").addClass("listCityNav");
      listCity.append(listCityNav);
      listCityNav.text(prevCities[i]);
    }
  }

  // Runs when prompted by clicking the Search button
  function updateSearchHistory(city) {
    // Verify city is not in the list already. If not, add it.
    var prevCities = getPrevCities();
    if (prevCities.indexOf(city) > -1) {
      // prettier-ignore
      prevCities.splice(prevCities.indexOf(city), 1);
      prevCities.unshift(city);
    } else {
      // Cap list at 9 cities and sort
      if (prevCities.length === 9) {
        prevCities.splice(8, 8);
        prevCities.unshift(city);
      } else {
        prevCities.unshift(city);
      }
    }
    // Save to localStorage and rebuild the list
    localStorage.setItem("cities", JSON.stringify(prevCities));
    getSearchHistory();
  }

  ////////////
  // AJAX   //
  ////////////

  // Gets current weather conditions for the selected city and sends coordinates to UV request
  function getCurrentConditions(currentReq) {
    // define variable to store coordinates for uv request
    var coord;
    $.when(
      $.get(currentReq, function(res) {
        coord = res.coord;
        // page content
        forecastCityName.text(res.name + " (" + today + ")");
        weatherIcon
          .attr("src", iconURL + res.weather[0].icon + ".png")
          .attr("alt", res.weather[0].description);
        listTemp.html("Temperature: " + res.main.temp + "&#8457");
        listHumidity.text("Humidity: " + res.main.humidity + "%");
        listWindSpd.text("Wind Speed: " + res.wind.speed);
        listUV.text("UV Index: ");
      })
    ).then(function() {
      // use coord to generate UV index request
      var uvReq =
        weatherURL + uvArg1 + coord.lat + uvArg2 + coord.lon + apiArg + apikey;
      getUVIndex(uvReq);

      // Add elements to page
      selectedCity.append(forecastCityName);
      selectedCity.append(weatherIcon);
      selectedCity.append(listForecast);
      listForecast.append(listTemp);
      listForecast.append(listHumidity);
      listForecast.append(listWindSpd);
      listForecast.append(listUV);
      listUV.append(spanUV);
    });
  }

  // Gets UV Index and sets text value for UV index element
  function getUVIndex(uvReq) {
    $.get(uvReq, function(res) {
      uvIndex = res.value;
      spanUV.text(uvIndex);
      if (uvIndex >= 5) {
        spanUV.addClass("badUV");
      } else {
        spanUV.removeClass("badUV");
      }
    });
  }

  // Fills five day forecast for the selected city
  function getForecast(forecastReq) {
    $.get(forecastReq).then(function(res) {
      var start = 8;
      // loop through five days
      for (var d = 0; d < 5; d++) {
        var temp = 0;
        var hum = 0;
        // loop through eight 3 hour increments and average temp / hum
        for (var t = start - 8; t < start; t++) {
          temp += res.list[t].main.temp;
          hum += res.list[t].main.humidity;
          // get icon from noon each day
          if (t === 1 || t === 9 || t === 17 || t === 25 || t === 33) {
            var iconCode = res.list[t].weather[0].icon;
            var description = res.list[t].weather[0].description;
          }
        }
        // Create elements for forecast divs
        var nextDate = $("<h4>").text(
          moment()
            .add(d + 1, "days")
            .format("l")
        );
        var nextForecast = $("<ul>");
        var nextIcon = $("<img>")
          .attr("src", iconURL + iconCode + ".png")
          .attr("alt", description);
        var nextTemp = $("<li>").html(
          "Temp: " + (temp / 8).toFixed(2) + "&#8457"
        );
        var nextHumidity = $("<li>").html(
          "Humidity: " + Math.floor(hum / 8) + "%"
        );
        $("#day" + d).empty();
        $("#day" + d).append(nextDate);
        $("#day" + d).append(nextForecast);
        nextForecast.append(nextIcon);
        nextForecast.append(nextTemp);
        nextForecast.append(nextHumidity);
        start += 8;
      }
    });
  }

  // Runs ajax functions to get forecast / current conditions for the selected city
  function getCity(city) {
    var forecastReq = weatherURL + forecastArg + city + args + apiArg + apikey;
    var currentReq = weatherURL + weatherArg + city + args + apiArg + apikey;
    updateSearchHistory(city);
    getCurrentConditions(currentReq);
    getForecast(forecastReq);
  }

  ////////////////////
  // Event Handlers //
  ////////////////////
  $(".listCity").on("click", "li", function() {
    getCity($(this).text());
  });

  $("#citySearch").on("click", function() {
    getCity(
      $(this)
        .prev()
        .val()
    );
    searchInput.val("");
  });

  $(".searchInput").on("keypress", function(e) {
    if (e.which == 13) {
      var newCity = searchInput.val();
      getCity(newCity);
      searchInput.val("");
    }
  });

  // Get content from localStorage on page load
  getSearchHistory();
});
