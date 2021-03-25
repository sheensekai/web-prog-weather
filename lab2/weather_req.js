function sendWeatherRequest(params, func, errFunc = null) {
    const url = "https://community-open-weather-map.p.rapidapi.com/weather" + params + "&units=metric";
    //  + "&lang=ru";
    const api_key = "76e83c9996msh3301669dd80d319p145896jsn558cf76c2a22";
    const host = "community-open-weather-map.p.rapidapi.com";
    const method = "GET";

    fetch(url, {
        "method": method,
        "headers" : {
            "x-rapidapi-key": api_key,
            "x-rapidapi-host": host
        }}).then((response) => func(response))
        .catch((error) => {
            if (errFunc !== null) {
                errFunc(error);
            }
        });
}

function getCityByNameRequest(cityName, func) {
    const params = "?q=" + cityName;
    sendWeatherRequest(params, func);
}

function getCityByCoordsRequest(lat, lon, func) {
    const params = "?lat=" + lat + "&lon=" + lon;
    sendWeatherRequest(params, func);
}

function getCityRequest(source, func) {
    if (source.byCity) {
        getCityByNameRequest(source.cityName, func);
    } else {
        getCityByCoordsRequest(source.latitude, source.longitude, func);
    }
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