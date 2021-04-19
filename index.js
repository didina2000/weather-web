import { OPEN_WEATHER_MAP_API_KEY } from './credentials.js';
import { DateTime } from 'luxon';
import { Table } from './Table.js';

const inputEl = document.getElementById('cityName');
inputEl.onchange = printCurrentWeather;

function printCurrentWeather(event) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/weather?q=${event.srcElement.value}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;
  fetch(OPEN_WEATHER_MAP_API)
    .then((response) => response.json())
    .then((data) => {
      printWeatherFor7Days(data.coord);
    });
}

function printWeatherFor7Days({ lat, lon }) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;
  fetch(OPEN_WEATHER_MAP_API)
    .then((response) => response.json())
    .then((data) => {
      generateForecastTable(data);
    });
}

function generateForecastTable(data) {
  const table = new Table([
    'Data',
    'Temp. Maximă',
    'Temp. Minimă',
    'Viteza vântului',
  ]);
  data.daily.forEach((day) => {
    const date = DateTime.fromSeconds(day.dt)
      .setLocale('ro')
      .toLocaleString(DateTime.DATE_MED);

    const tempMax = day.temp.max;
    const tempMin = day.temp.min;
    const windSpeed = day.wind_speed;

    const row = [date, tempMax, tempMin, windSpeed];

    table.push(row);
  });
  console.log(table);
  const tableContainer = document.getElementById('tableContainer');
  tableContainer.innerHTML = table.toHTML();
}
