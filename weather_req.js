function makeWeatherRequest(params, async = true,) {
    const url = "https://community-open-weather-map.p.rapidapi.com/weather" + params + "&units=metric";
    const xhr = new XMLHttpRequest();
    const api_key = "34e35a1d80msh1acf606c8def3adp132cbbjsn7f1eb5c439c4";
    const host = "community-open-weather-map.p.rapidapi.com";
    const method = "GET";

    xhr.responseType = "json";
    xhr.open(method, url, async);
    xhr.setRequestHeader("x-rapidapi-key", api_key);
    xhr.setRequestHeader("x-rapidapi-host", host);
    return xhr;
}

function makeCoordsWeatherRequest(latitude, longitude) {
    const params = "?" + "lat" + "=" + latitude + "&" + "lon" + "=" + longitude;
    return makeWeatherRequest(params);
}

function makeCityWeatherRequest(cityName, func) {
    const params = "?" + "q" + "=" + cityName;
    return makeWeatherRequest(params);
}

function makeSourceWeatherRequest(source) {
    if (source.byCity) {
        return makeCityWeatherRequest(source.cityName);
    } else {
        return makeCoordsWeatherRequest(source.latitude, source.longitude);
    }
}

function sendWeatherRequest(xhr, func) {
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            func();
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
        "humidity": response.main.humidity
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