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
  var cityList = $("<ul>").addClass("cityList");
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
  searchBar.append(cityList);

  $(".container").append(selectedCity);

  $(".container").append(forecast);
  forecast.append(forecastTitle);
});
