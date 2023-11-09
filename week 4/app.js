var apiKey = 'c304f37c863fc16d0681fe7d2f785a50';
var weatherContainer = document.getElementById("weather-info");
var btn1 = document.getElementById("btn1");

btn2.addEventListener("click", function() {
  var city = document.getElementById('cityInput').value;
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + apiKey);

  ourRequest.onload = function() {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      var ourData = JSON.parse(ourRequest.responseText);
      if (ourData.cod === 200) {
        renderWeather(ourData);
      } else {
        alert("City not found. Please try again.");
      }
    } else {
      alert("We connected to the server, but it returned an error.");
    }
  };

  ourRequest.onerror = function() {
    console.log("Connection error");
  };

  ourRequest.send();
});

function renderWeather(data) {
  var htmlString = "<p>The weather in " + data.name + " is " + data.weather[0].description + 
                   ".</br> The temperature is " + data.main.temp + "°C with a wind speed of " +
                   data.wind.speed + "m/s. <hr></p>";
  weatherContainer.insertAdjacentHTML('beforeend', htmlString);
}
