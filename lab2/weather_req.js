function makeWeatherRequest(params) {
    const url = "https://community-open-weather-map.p.rapidapi.com/weather" + params + "&units=metric" + "&lang=ru";
    const xhr = new XMLHttpRequest();
    const api_key = "76e83c9996msh3301669dd80d319p145896jsn558cf76c2a22";
    const host = "community-open-weather-map.p.rapidapi.com";
    const method = "GET";

    xhr.responseType = "json";
    xhr.open(method, url);
    xhr.setRequestHeader("x-rapidapi-key", api_key);
    xhr.setRequestHeader("x-rapidapi-host", host);
    return xhr;
}

function makeCoordsWeatherRequest(latitude, longitude) {
    const params = "?" + "lat" + "=" + latitude + "&" + "lon" + "=" + longitude;
    return makeWeatherRequest(params);
}

function makeCityWeatherRequest(cityName) {
    const params = "?" + "q" + "=" + cityName;
    return makeWeatherRequest(params);
}

function sendWeatherRequest(xhr, func) {
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            func(xhr);
        }
    }
    xhr.send();
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