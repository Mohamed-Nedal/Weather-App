const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showCity, () => {
    console.log("Can't Get Position!!!");
    getWeatherData("Cairo");
  });
} else {
  console.log("Geolocation is not supported by this browser.");
  getWeatherData("Cairo");
}

async function showCity(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Make a request to a Geocoding API (e.g. Google Maps Geocoding API)
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBrLZNwsWk7euHNa5fxtpMjmi1Rm1Ergrk`;

  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Parse the city name from the API response
      const arr = data.plus_code.compound_code.split(" ");
      getWeatherData(arr[arr.length - 1]);
    })
    .catch((error) => console.log(error));
}

const getWeatherData = async (location) => {
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=93ca21f937aa49b9bcb194101241106&q=${location}&days=3`
  );
  if (!response.ok && response.status != 200) {
    console.log("Error");
    return false;
  }
  const data = await response.json();

  displayCurrentDay({
    ...data.current,
    date: data.forecast.forecastday[0].date,
    location: data.location.name,
  });

  displayOtherDays(data.forecast.forecastday[1], data.forecast.forecastday[2]);
};

const displayCurrentDay = (day) => {
  const ele = document.getElementById("mainBox");
  const date = new Date(`${day.date}`);

  ele.innerHTML = `
  <div class="box-head">
                <span>${days[date.getDay()]}</span>
                <span>${date.getDate()} ${months[date.getMonth()]}</span>
              </div>

              <div class="box-content">
                <h3 class="city-name">${day.location}</h3>
                <h5 class="main-temp-c">${day.temp_c}<sup>o</sup>C</h5>
                <img
                  class="desc-img"
                  src="${day.condition.icon}"
                  alt="img"
                />
                <span class="day-desc">${day.condition.text}</span>

                <div class="other-info">
                  <span>
                    <img src="images/icon-umberella.png" alt="icon" />
                    ${day.precip_mm} %
                  </span>
                  <span>
                    <img src="images/icon-wind.png" alt="icon" /> 
                    ${day.wind_kph} km/h
                  </span>
                  <span>
                    <img src="images/icon-compass.png" alt="icon" />
                    ${getDirection(day.wind_dir)}
                  </span>
                </div>
              </div>
  `;
};

const displayOtherDays = (first, second) => {
  const nextDayEle = document.getElementById("nextDay");
  const afterNextDayEle = document.getElementById("afterNextDay");
  const nextDay = days[new Date(`${first.date}`).getDay()];
  const afterNextDay = days[new Date(`${second.date}`).getDay()];

  nextDayEle.innerHTML = otherDaysPattern(
    nextDay,
    first.day.condition.icon,
    first.day.maxtemp_c,
    first.day.mintemp_c,
    first.day.condition.text
  );

  afterNextDayEle.innerHTML = otherDaysPattern(
    afterNextDay,
    second.day.condition.icon,
    second.day.maxtemp_c,
    second.day.mintemp_c,
    second.day.condition.text
  );
};

const otherDaysPattern = (day, icon, max, min, desc) => {
  return `
    <div class="box-head">
                <span>${day}</span>
              </div>

              <div class="box-content">
                <img
                  class="desc-img"
                  src="${icon}"
                  alt="img"
                />

                <div class="next-days-temps">
                  <span class="max-temp">${max}<sup>o</sup>C</span>
                  <span class="min-temp">${min}<sup>o</sup></span>
                </div>

                <span class="day-desc">${desc}</span>
              </div>
    `;
};

const getDirection = (dir) => {
  switch (dir) {
    case "N":
      return "North";
    case "S":
      return "South";
    case "E":
      return "East";
    case "W":
      return "West";
    case "NE":
      return "North East";
    case "NW":
      return "North West";
    case "SE":
      return "South East";
    default:
      return "South West";
  }
};

document
  .getElementById("locationSearchInput")
  .addEventListener("input", (e) => {
    if (e.target.value) {
      getWeatherData(e.target.value);
    }
  });
