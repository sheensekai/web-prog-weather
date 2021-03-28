async function sendWeatherRequest(params) {
    const url = "https://community-open-weather-map.p.rapidapi.com/weather" + params + "&units=metric";
    //  + "&lang=ru";
    const api_key = "76e83c9996msh3301669dd80d319p145896jsn558cf76c2a22";
    const host = "community-open-weather-map.p.rapidapi.com";
    const method = "GET";

    return await fetch(url, {
        "method": method,
        "headers" : {
            "x-rapidapi-key": api_key,
            "x-rapidapi-host": host
        }});
}

async function getCityByNameRequest(cityName) {
    const params = "?q=" + cityName;
    return await sendWeatherRequest(params);
}

async function getCityByCoordsRequest(lat, lon) {
    const params = "?lat=" + lat + "&lon=" + lon;
    return await sendWeatherRequest(params);
}

async function getCityRequest(source) {
    if (source.byCity) {
        return await getCityByNameRequest(source.cityName);
    } else {
        return await getCityByCoordsRequest(source.latitude, source.longitude);
    }
}

async function getCityWeatherState(source) {
    const result = {status: null, weatherState: null};
    const response = await getCityRequest(source);
    result.status = response.status;
    if (result.status === 200) {
        const jsonResponse = await response.json();
        result.weatherState = getWeatherStateFromResponse(jsonResponse);
    }
    return result;
}

function getWeatherStateFromResponse(response) {
    if (response === null) {
        return null;
    }
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