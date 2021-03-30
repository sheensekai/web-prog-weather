async function sendWeatherRequest(params) {
    const url = "https://community-open-weather-map.p.rapidapi.com/weather" + params + "&units=metric";
    const api_key = "e314680109mshc428f1d29503e67p19b88cjsn94900fc1e7b7";
    const host = "community-open-weather-map.p.rapidapi.com";
    const method = "GET";

    return await fetch(url, {
        "method": method,
        "headers": {
            "x-rapidapi-key": api_key,
            "x-rapidapi-host": host
        }
    });
}

async function getWeatherState(params) {
    const response = await sendWeatherRequest(params);
    let weatherState = null;
    if (response.status === 200) {
        const jsonResponse = await response.json();
        weatherState = getWeatherStateFromResponse(jsonResponse);
    }
    return {status: response.status, weatherState: weatherState};
}

async function getCityByNameRequest(cityName) {
    const params = "?q=" + cityName;
    return await getWeatherState(params);
}

async function getCityByCoordsRequest(lat, lon) {
    const params = "?lat=" + lat + "&lon=" + lon;
    return await getWeatherState(params);
}

async function getCityRequest(source) {
    if (source.byCity) {
        return await getCityByNameRequest(source.cityName);
    } else {
        return await getCityByCoordsRequest(source.latitude, source.longitude);
    }
}

function getWeatherStateFromResponse(response) {
    return {
        "cityName": response.name,
        "temp": Math.round(response.main.temp * 10) / 10,
        "feels_like": response.main.feels_like,
        "wind": response.wind.speed,
        "clouds": response.clouds.all,
        "pressure": response.main.pressure,
        "humidity": response.main.humidity,
        "iconId": response.weather[0].icon
    };
}

function getRuPropertyListFromState(state) {
    const weatherProperties = [];
    weatherProperties.push({name: "Ощущается как", value: state.feels_like + " °C"});
    weatherProperties.push({name: "Ветер", value: state.wind + " м/c"});
    weatherProperties.push({name: "Облачность", value: state.clouds + "%"});
    weatherProperties.push({name: "Давление", value: state.pressure + " гПа"});
    weatherProperties.push({name: "Влаженость", value: state.humidity + "%"});
    return weatherProperties;
}

function getIconUrlFromResponseState(state, pix = "@2x", format = ".png") {
    const base = "http://openweathermap.org/img/wn/";
    return base + state.iconId + pix + format;
}