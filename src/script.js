/**
 *
 * @param {number} a number 1-7 that corresponds to each day of the week
 * @returns the current date and time (local timezone)
 * Created an array with the name of the days of the week in one variable and used the method .getDay() that gives a number between 1 and 7 as index and  get the day of the week
 * To get the hours I created a variable and used the method .now.getHours() that returns the hour for the specified date,according to local time
 * Created a variable to store the hours and minutes and used the methods now.getHours() and .now.getMinutes(),To format the time as I want (00:00) I had to create a conditions (variable <10), and use template literals to display it correctly
 * To display the current date and time I created a variable (currentDate) and  used template literals(``) to embed an expression into a part of a string,copied and pasted the block of code and replaced some parts with the  placeholders of the form ${expression} to perform substitutions for embedded expressions
 */
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
  let currentDate = `${day},Your local time : ${time}:${minutes}`;
  return currentDate;
}

/**
 * API integration:
 * I used the https://openweathermap.org/ to get a free API with weather data.
 *Then, I created variable to store my apiKey that I got from the OpenWeather and another one for the apiUrl ,which I used the template literals with the expressions to get the coordenates. I looked through the api documentation to find out how to specify the coordenates,the apiKey and the units I wanted.
 *selected the element where I wanted the date to appear and used the method new Date() to get the date and format it.
 */
let now = new Date();
let date = document.querySelector("#date");
date.innerHTML = formatDate();

/**
 *
 * @param {number} position based on the latitude and longitude.
 * Used Axios, it has the ability to make HTTP requests from the browser and handle the transformation of request and response data.
 * I used the AJAX technique to this web application be able to make quick, incremental updates to the user interface without reloading the entire browser page. This makes the application faster and more responsive to user actions.
 *Used the method get().then() to be abble to display the temperature based on the coordinates.
 */
function searchLocation(position) {
  let apikey = "8161b4309ee03faae957729ba7104797";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apikey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

/**
 *
 * @param {click} event a click form the button "Your current location".
 * Used the method preventDefault (click) that cancels the event if it is cancelable,so the default action that belongs to the event will not occur.
 * To get the current location of a device I used the navigator.geolocation, a property that returns a Geolocation object that gives Web content access to the location of that device and then called the function searchLocation to get the coordinates.
 */
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

/**
 *@param {number} coordinates
 * Used Axios, it has the ability to make HTTP requests from the browser and handle the transformation of request and response data.
 *
 * Used an one call API to get the weather data for a specific location that is going to be displayed on the forecast.This API asks us to provide 4 parameters(long,lat,units,key).
 * Whenever the user searches for a city name we need to wait until we get the response from the initial api call and once we have it we can call this "one call api" knowing the coordinates and then get the forecast.
 */
function getForecast(coordinates) {
  let apiKey = "8161b4309ee03faae957729ba7104797";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(displayForecast);
}

/**
 *This function returns the weather data and display it on the app
 * @param {object} response represents the response to a request
 * To get the matching icon for each temperature, the city's name and the corresponding temperatureI went inside the object response.data.name/temp/humidity/windspeed/icon
 * Then I displayed the temperature,humidity,icon,wind speed and the city name inside the HTMl's corresponding element using template literals.
 * To get the icon for each temperature I used .setAttribute(name,value), it sets the value of an attribute on the specified element. I got the URL for the icon in the openWeather website and used template literals how it's specified in the website.
 * Called the function getForecast and asked for the coordinates that is being used by this function to get the weather data for those coordinates.
 */
function showTemperature(response) {
  let iconElement = document.querySelector("#icon");
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  celsiusTemperature = response.data.main.temp;
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity : ${response.data.main.humidity}%`;
  document.querySelector(
    "#description-line"
  ).innerHTML = `Weather state : ${response.data.weather[0].main}`;
  document.querySelector(
    "#wind"
  ).innerHTML = `Wind speed : ${response.data.wind.speed} m/h`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  getForecast(response.data.coord);
}

/**
 *
 * @param {object} response represents the response to a request of another API operation.
 * Created a variable to store the data for the forecast and went inside the object.
 * The grid for the forecast is built using JS:created a variable to select the grid's id and another one to store the "open the row".
 * Using a loop forEach display the temperature for the other days, it's going to loop through the array we got from the one call api and store the response inside forecast variable.
 * To loop through the forecast forecast.forEach(function(forecastDay,index)). Inside this forecastDay we don't have the info about the day, we have dt,and to get the day we need to replace it by ${forecastDay.dt} inside the block of code we inject from the HTML in here.
 * To get the max and min temperatures we get it from the array too and use interpolation ${forecastDay.temp.max/min}
 * Inside the loop, I created a new function and gave (forecastDay,index) as parameters, it is auto-executed function.
 * Inside the loop I created a condition, if the second parameter (index) is less than 5 (rows) then I want to display the rows in this format
 * Used template literals to
 */
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2">
                <div class="weather-forecast-date">${formatDay(
                  forecastDay.dt
                )}</div>
                <img
                  src="http://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png"
                  alt="" width="50px"
                />
                <div class="weather-forecast-temperatures">
                  <span class="weater-forecast-maxtemp">${Math.round(
                    forecastDay.temp.max
                  )}° </span>
                  <span class="weather-forecast-mintemp">${Math.round(
                    forecastDay.temp.min
                  )}°</span>
                </div>
              </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

/**
 *
 * @param {*} timestamp
 * @returns
 * To fix the dt(timestamp) i created this function that is being called inside displayForecast
 * Created a new date
 */
function formatDay(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let forecastDay = forecastDate.getDay();
  let forecastDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return forecastDays[forecastDay];
}

function searchCity(city) {
  let apiKey = "8161b4309ee03faae957729ba7104797";
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

let userInput = document.querySelector("#input-city");
let displayMessage = document.querySelector("#city");
userInput.addEventListener("blur", (e) => {
  if (!cityExists(e.target.value)) {
    displayMessage.style.display = "block";
    displayMessage.innerHTML = "City not found";
  }
});
function cityExists(str) {}

searchCity("Lisbon");
