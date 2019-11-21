$(document).ready(function() {
  // build page elements
  // header
  //var header = $("<div>").addClass("header");
  var title = $("<h1>")
    .addClass("pageTitle")
    .text("Weather Dashboard");
  // Main
  /* var container = $("<div>").addClass("container"); */
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
  $(".container").append(forecast);
  forecast.append(forecastTitle);

  // Add Content

  /************************ TEST */
  // Build API Call
  const apikey = "f2919aeb80a924ffadb75fdf60e7f195";
  var request =
    "http://api.openweathermap.org/data/2.5/forecast?q=portland&APPID=" +
    apikey;

  //var req = "http://api.openweathermap.org/data/2.5/forecast?q=";

  // City List Event Handler
  var listCityNav = $("<li>").addClass("listCityNav");
  listCity.append(listCityNav);
  listCityNav.text("Portland");

  $(".listCityNav").on("click", function() {
    getCity($(this).text());
  });
  //});

  $("#citySearch").on("click", function() {
    var newCity = searchInput.val();

    getCity(newCity);
  });

  function getCity(city) {
    var req =
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&APPID=" +
      apikey;
    console.log(req);

    var forecastCityName = $("<h2>");
    var listForecast = $("<ul>");
    var listTemp = $("<li>");
    var listHumidity = $("<li>");
    var listWindSpd = $("<li>");
    var listUV = $("<li>");
    $.ajax({
      url: req,
      method: "GET"
    }).then(function(res) {
      forecastCityName.text(res.city.name);
      listTemp.text("Temperature: " + res.list[0].main.temp);
      listHumidity.text("Humidity: " + res.list[0].main.temp);
      listWindSpd.text("Wind Speed: " + res.list[0].wind.speed);

      selectedCity.append(forecastCityName);
      selectedCity.append(listForecast);
      listForecast.append(listTemp);
      listForecast.append(listHumidity);
      listForecast.append(listWindSpd);

      console.log(res);
    });
  }
});
