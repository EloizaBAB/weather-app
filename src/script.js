function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let time = now.getHours();
  if (time < 10) {
    time = `0${time}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let currentDate = `${day} ${time}:${minutes}`;
  return currentDate;
}
let now = new Date();
let date = document.querySelector("#date");
date.innerHTML = formatDate();
function searchLocation(position) {
  let apikey = "596185bbd624cf50d3971a5660b140aa";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apikey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
function showTemperature(response) {
  let iconElement = document.querySelector("#icon");
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  celsiusTemperature = response.data.main.temp;
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity:${response.data.main.humidity}%`;
  document.querySelector(
    "#description-line"
  ).innerHTML = `Weather state: ${response.data.weather[0].main}`;
  document.querySelector(
    "#wind"
  ).innerHTML = `Wind speed: ${response.data.wind.speed}`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  let days = ["wed", "thurs", "fri", "sat"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
              <div class="col-2">
                <div class="weather-forecast-date">${day}</div>
                <img
                  src="https://ssl.gstatic.com/onebox/weather/64/partly_cloudy.png"
                  alt=""
                  width="20px"
                />
                <div class="weather-forecast-temperatures">
                  <span class="weater-forecast-maxtemp">18</span>
                  <span class="weather-forecast-mintemp">12</span>
                </div>
              </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function conversionToCelsius(event) {
  temperatureElement = document.querySelector("#temperature");
  event.preventDefault();
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
function conversionToFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function searchCity(city) {
  let apiKey = "596185bbd624cf50d3971a5660b140aa";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#input-city").value;
  searchCity(city);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
searchCity("Lisbon");

let getCurrentLocationButton = document.querySelector("#current-location");
getCurrentLocationButton.addEventListener("click", getCurrentLocation);

let fahreinheitLink = document.querySelector("#fahrenheit-link");
fahreinheitLink.addEventListener("click", conversionToFahrenheit);
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", conversionToCelsius);

searchCity("Lisbon");
displayForecast();
