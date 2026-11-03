// The icon_url returned by the SheCodes API points to an S3 bucket that no
// longer exists, so map the API's icon name to an equivalent hosted icon.
function getIconUrl(condition) {
  let codes = {
    "clear-sky": "01",
    "few-clouds": "02",
    "scattered-clouds": "03",
    "broken-clouds": "04",
    "shower-rain": "09",
    rain: "10",
    thunderstorm: "11",
    snow: "13",
    mist: "50",
  };
  let icon = condition.icon || "";
  let isNight = icon.endsWith("-night");
  let name = icon.replace(/-(day|night)$/, "");
  let code = codes[name];

  if (!code) {
    return condition.icon_url;
  }
  return `https://openweathermap.org/img/wn/${code}${isNight ? "n" : "d"}@2x.png`;
}

function updateWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElememt = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let IconElement = document.querySelector("#icon-img");

  cityElement.innerHTML = response.data.city;

  timeElememt.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed} km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  IconElement.innerHTML = `<img src="${getIconUrl(response.data.condition)}" alt="${response.data.condition.description}" class="weather-app-icon" />`;

  getForecast(response.data.city);
}
function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Teusday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saterday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hours}:${minutes}`;
}
function searchCity(city) {
  let apiKey = "e1e10606109dc39aa96a4o5b4facfd3t";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");

  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}
function getForecast(city) {
  let apiKey = "e1e10606109dc39aa96a4o5b4facfd3t";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}
function displayForecast(response) {
  console.log(response.data);
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
<div class="weather-forecaste-day">
   <div class="weather-forecast-date">${formatDay(day.time)}</div>
   <img src="${getIconUrl(day.condition)}" alt="${day.condition.description}" class="weather-forecast-icon" />
   <div class="weather-forecast-temp">
     <div class="weather-forecast-temperature">
       <strong>${Math.round(day.temperature.maximum)}°</strong>
     </div>
     <div class="weather-forecast-temperature">${Math.round(
       day.temperature.minimum
     )}°</div>
   </div>
 </div>
`;
    }
  });

  forecastElement.innerHTML = forecastHtml;
}
let forecastElement = document.querySelector("#forecast");
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Paris");
