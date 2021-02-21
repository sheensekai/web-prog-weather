function makeWeatherRequest(params, func, async = true,) {
    const xhr = new XMLHttpRequest();
    const api_key = "34e35a1d80msh1acf606c8def3adp132cbbjsn7f1eb5c439c4";
    const host = "community-open-weather-map.p.rapidapi.com";
    const method = "GET";
    const url = "https://community-open-weather-map.p.rapidapi.com/weather" + params;

    xhr.onload = func;
    xhr.responseType = "json";
    xhr.open(method, url, async);
    xhr.setRequestHeader("x-rapidapi-key", api_key);
    xhr.setRequestHeader("x-rapidapi-host", host);
    return xhr;
}

function makeCoordsWeatherRequest(latitude, longitude, func) {
    const params = "?" + "lat" + "=" + latitude + "&" + "lon" + "=" + longitude;
    return makeWeatherRequest(params, func);
}

function makeCityWeatherRequest(cityName, func) {
    const params = "?" + "q" + "=" + cityName;
    return makeWeatherRequest(params, func);
}

function makeSourceWeatherRequest(source, func) {
    if (source.byCity) {
        return makeCityWeatherRequest(source.cityName, func);
    } else {
        return makeCoordsWeatherRequest(source.latitude, source.longitude, func);
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