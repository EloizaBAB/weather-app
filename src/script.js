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
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity:${response.data.main.humidity}%`;
  document.querySelector("#description-line").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#wind").innerHTML = response.data.wind.speed;
}

// make an api call and once i get the responde show the temperature

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
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
searchCity("Lisbon");
let getCurrentLocationButton = document.querySelector("#current-location");
getCurrentLocationButton.addEventListener("click", getCurrentLocation);
