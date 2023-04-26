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
 * We need to give permission to our computer or phone to use our location in order for this code to work. Once we have allowed that, the code uses the information about our location to find out the temperature and display it on the screen.
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
 * This function finds out where the person using the computer is located. It does this by asking the computer's web browser for its location and then running a function called searchLocation with that information.
 * @param {click} event a click form the button "Your current location".
 * Used the method preventDefault (click) that cancels the event if it is cancelable,so the default action that belongs to the event will not occur.
 * To get the current location of a device I used the navigator.geolocation, a property that returns a Geolocation object that gives Web content access to the location of that device and then called the function searchLocation to get the coordinates.
 *  It then asks the browser for the user's location and puts the result into searchLocation.
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
 *This function takes a single parameter response which is the response data returned by an API call to a weather service. The function updates the HTML content of certain elements on the page to display the weather information in a user-friendly format.
 * @param {object} response represents the response to a request
 * To get the matching icon for each temperature, the city's name and the corresponding temperatureI went inside the object response.data.name/temp/humidity/windspeed/icon.
 * The temperature is rounded to the nearest integer using the Math.round() function and assigned to the celsiusTemperature variable.
 * Then I displayed the temperature,humidity,icon,wind speed and the city name inside the HTMl's corresponding element using template literals.
 * To get the icon for each temperature I used .setAttribute(name,value), it sets the value of an attribute on the specified element. I got the URL for the icon in the openWeather website and used template literals how it's specified in the website.
 * Finally, it calls another function "getForecast" and passes the latitude and longitude coordinates of the location obtained from the response object as an argument.
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
 * It shows what the weather will be like for the next five days. It takes information about the weather and puts it into a special format so that we can see it on a website or app. It makes little boxes for each day with a picture of what the weather will look like, the high temperature for the day, and the low temperature for the day.
 * @param {object} response represents the response to a request of another API operation.
 * Created a variable to store the data for the forecast and went inside the object.
 * The grid for the forecast is built using JS:created a variable to select the grid's id and another one to store the "open the row".
 * the forecast.forEach(function(forecastDay,index)) is going to receive one number between 1 and 7 that corresponds to each day of the week
 * Using a loop forEach display the temperature for the other days, it's going to loop through the array we got from the one call api and store the response inside forecast variable.
 * To loop through the forecast forecast.forEach(function(forecastDay,index)). Inside this forecastDay we don't have the info about the day, we have dt,and to get the day we need to replace it by ${forecastDay.dt} inside the block of code we inject from the HTML in here.
 * To get the max and min temperatures we get it from the array too and use interpolation ${forecastDay.temp.max/min}
 * Inside the loop, I created a new function and gave (forecastDay,index) as parameters, it is auto-executed function.
 * Inside the loop I created a condition, if the second parameter (index) is less than 5 (rows) then I want to display the rows in this format
 */
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
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
                  )}°| </span>
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
 *formatDay() takes a timestamp as an input.
 * @param {*} timestamp
 * @returns  returns the name of the day of the week that corresponds to the input timestamp.
 *The function creates a new date object (forecastDate) using the timestamp and then uses the getDay() method to get the day of the week for that date.
 * To fix the dt(timestamp) I created this function that is being called inside displayForecast.
 * Created a variable to store the days of the week(numbers between 1 and 7) that is going to be used as an index for the array.
 * created an array with the names of the days of the week in the short term,and in return we get a day of the week indexing.
 * By indexing we can get use it in above function to display the days of the week and its corresponding temperature and the temperature's icon.
 */
function formatDay(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let forecastDay = forecastDate.getDay();
  let forecastDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return forecastDays[forecastDay];
}

/**
 * This function finds out the temperature in any city we want.
 * @param {string} city
 *  It uses a website called "OpenWeatherMap" to get the temperature data.
 */
function searchCity(city) {
  let apiKey = "8161b4309ee03faae957729ba7104797";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

/**
 * This function is called when a form is submitted.
 * @param {event} it takes an event object as a parameter and prevents the default form submission behavior.
 * Then, it gets the value of the input element using the document.querySelector() method, and assigns it to the city variable.

After that, the function calls another function searchCity() and passes the city variable as an argument.
 */
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#input-city").value;
  searchCity(city);
}

let celsiusTemperature = null;

/**
 *I selected an HTML form element with an id of search-form and assigned it to the variable form. It then adds an event listener to the form that listens for a submit event and calls the handleSubmit() function when the form is submitted.
 *The code then calls the searchCity() function and passes the argument "Lisbon" to it. This is going to initialize the page with the weather information for Lisbon.
 */
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
searchCity("Lisbon");

/**
 * I selected an HTML button element and assigned it to the variable getCurrentLocationButton. It then adds an event listener to the button that listens for a click event and calls the getCurrentLocation() function when the button is clicked.
 */
let getCurrentLocationButton = document.querySelector("#current-location");
getCurrentLocationButton.addEventListener("click", getCurrentLocation);
/**
 * I selected an HTML element with an id of input-city and assigned it to a variable.And did the same for the with the element with the "city" and assigned it to a variable called "displayMessage".
 * I added an event listener to "userInput" that listens for a blur event. When the input is not found/provided, the event listener checks if the entered city exists using a cityExists() function (which is currently empty). If the city does not exist, the displayMessage element("City not found") is shown.
 */
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
