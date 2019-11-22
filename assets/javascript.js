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
  $(".container").append(forecast);
  forecast.append(forecastTitle);

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
    var forecastCityName = $("<h2>");
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
      console.log(forecast);

      console.log(res);
      // Clear selectedCity pane
      selectedCity.empty();
      // Fill it with content

      /* forecastCityName.text(
        res.name + " (" + today + ")"); */
      forecastCityName.html(
        /* res.name + " (" + today + ")" + res.weather[0].icon */
        res.name +
          " (" +
          today +
          ") <img url='http://openweathermap.org/img/wn/" +
          res.weather[0].icon +
          "@2x.png'>"
      );
      // get weather icon
      /*  $(
        '<img url="http://openweathermap.org/img/wn/' +
          res.weather[0].icon +
          '@2x.png">'
      ).insertAfter(forecastCityName); */

      listTemp.html("Temperature: " + res.main.temp + "&#8457");
      listHumidity.text("Humidity: " + res.main.humidity + "%");
      listWindSpd.text("Wind Speed: " + res.wind.speed);

      /* forecastCityName.text(res.city.name);
      listTemp.html("Temperature: " + res.list[0].main.temp + "&#8457");
      listHumidity.text("Humidity: " + res.list[0].main.humidity + "%");
      listWindSpd.text("Wind Speed: " + res.list[0].wind.speed); */
      listUV.text("UV Index: ");
      // Append elements to make them show
      selectedCity.append(forecastCityName);
      selectedCity.append(listForecast);
      listForecast.append(listTemp);
      listForecast.append(listHumidity);
      listForecast.append(listWindSpd);
      listForecast.append(listUV);
    });
  }
});
