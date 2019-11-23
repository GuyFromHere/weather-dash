$(document).ready(function() {
  // API key
  const apikey = "f2919aeb80a924ffadb75fdf60e7f195";
  const iconURL = "http://openweathermap.org/img/wn/";
  var today = new Date();
  today =
    today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();

  // build page elements
  // Header
  var title = $("<h1>")
    .addClass("pageTitle")
    .text("Weather Dashboard");
  // Nav
  var nav = $("<div>").addClass("nav");
  var searchBar = $("<div>").addClass("searchBar");
  var searchTitle = $("<h3>").text("Search for a City:");
  var searchInput = $("<input>").addClass("searchInput");
  var searchIcon = $("<i>")
    .addClass("fas fa-search")
    .attr("id", "citySearch");
  var listCity = $("<ul>").addClass("listCity");
  // Selected City
  var selectedCity = $("<div>").addClass("selectedCity");
  // Forecast
  var forecast = $("<div>").addClass("forecast");
  var forecastTitle = $("<h3>")
    .addClass("forecastTitle")
    .text("5-Day Forecast:");

  // Append elements
  $(".header").append(title);
  $(".container").append(nav);
  nav.append(searchBar);
  searchBar.append(searchTitle);
  searchBar.append(searchInput);
  searchInput.after(searchIcon);
  searchBar.append(listCity);
  $(".container").append(selectedCity);
  //$(".container").append(forecast);

  for (var i = 0; i < 5; i++) {
    var nextForecastDay = $("<div>").addClass("forecastDay");
    nextForecastDay.attr("id", "day" + i);
    nextForecastDay.text("day" + i);
    $(".container").append(nextForecastDay);
  }

  // Add Content
  getSearchHistory();

  // Event Handlers
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

  function getPrevCities() {
    // Get previous cities list from localStorage
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
    var prevCities = getPrevCities();

    // Verify city is not in the list already
    if (prevCities.indexOf(city) > -1) {
      // prettier-ignore
      prevCities.splice(prevCities.indexOf(city), 1);
      prevCities.unshift(city);
    } else {
      // If not, add it
      if (prevCities.length === 6) {
        prevCities.splice(5, 5);
        prevCities.unshift(city);
      } else {
        prevCities.unshift(city);
      }
    }

    // Save the list back to localStorage
    localStorage.setItem("cities", JSON.stringify(prevCities));
    // Rebuild listNav with altered list
    getSearchHistory();
  }

  function getCity(city) {
    var req =
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=imperial" +
      "&APPID=" +
      apikey;

    var currReq =
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial" +
      "&APPID=" +
      apikey;
    var forecastCityName = $("<h2>").addClass("cityName");
    var weatherIcon = $("<img>");
    var listForecast = $("<ul>");
    var listTemp = $("<li>");
    var listHumidity = $("<li>");
    var listWindSpd = $("<li>");
    var listUV = $("<li>");

    updateSearchHistory(city);

    $.ajax({
      url: currReq,
      method: "GET"
    }).then(function(res) {
      console.log(res);
      // Clear selectedCity pane
      selectedCity.empty();
      // Fill it with content
      forecastCityName.text(res.name + " (" + today + ")");
      weatherIcon
        .attr(
          "src",
          "http://openweathermap.org/img/wn/" + res.weather[0].icon + ".png"
        )
        .attr("alt", res.weather[0].description);
      listTemp.html("Temperature: " + res.main.temp + "&#8457");
      listHumidity.text("Humidity: " + res.main.humidity + "%");
      listWindSpd.text("Wind Speed: " + res.wind.speed);
      listUV.text("UV Index: ");
      // Append elements to make them show
      selectedCity.append(forecastCityName);
      selectedCity.append(weatherIcon);
      selectedCity.append(listForecast);
      listForecast.append(listTemp);
      listForecast.append(listHumidity);
      listForecast.append(listWindSpd);
      listForecast.append(listUV);
    });

    $.ajax({
      url: req,
      method: "GET"
    }).then(function(res) {
      console.log(res);
      var tom = 0;
      for (var t = 0; t < 8; t++) {
        tom += res.list[t].main.temp;
      }
      console.log("Avg temp tomorrow: " + tom / 8);
      $("#day0").html("Tomorrow: " + Math.floor(tom / 8) + "&#8457");
    });
  }
});
