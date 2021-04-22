import { OPEN_WEATHER_MAP_API_KEY } from "./credentials.js";
import { DateTime } from "luxon";
import { Table } from "./Table.js";

async function getData(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    const errorMessages = {
      401: "API key este incorect. Vă rugăm verificați fișierul credential.js. ",
      404:
        "Denumirea orașului nu este validă.  " +
        "Vă rugăm verificați dacă ați introdus numele orașului corect! ",
      429: "Ați depășit limita de cereri către OpenWeatherMAp API. ",
      500: "Ne pare rău, a apărut o eroare internă a serverului. ",
      EAI_AGAIN:
        "Nu există o conexiune cu Internetul." +
        "Verificați dacă sunteți conectați la o sursă de internet. ",
      get ENOTFOUND() {
        return this.EAI_AGAIN;
      },
    };
    const errorCode = error.code || Number(error.response.data.cod);
    console.log(chalk.red.bgYellow.bold(errorMessages[errorCode]));
    process.exit();
  }
}

const inputEl = document.getElementById("cityName");
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
    "Data",
    "Temp. Maximă",
    "Temp. Minimă",
    "Viteza vântului",
  ]);
  data.daily.forEach((day) => {
    const date = DateTime.fromSeconds(day.dt)
      .setLocale("ro")
      .toLocaleString(DateTime.DATE_MED);

    const tempMax = day.temp.max;
    const tempMin = day.temp.min;
    const windSpeed = day.wind_speed;

    const row = [
      date,
      `${Math.round(day.temp.max)}°C`,
      `${Math.round(day.temp.min)}°C`,
      `${Math.round(day.wind_speed)}m/s`,
    ];

    table.push(row);
  });
  console.log(table);
  const tableContainer = document.getElementById("tableContainer");
  tableContainer.innerHTML = table.toHTML();
}
