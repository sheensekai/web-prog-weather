function sendWeatherApiRequest(endpoint, params, method, func) {
    const base = "http://localhost:3000/weather/";
    let url = base + endpoint;
    if (params !== null) {
        url += params;
    }
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open(method, url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            func(xhr);
        }
    };
    xhr.send();
}

function getFavouriteByNameRequest(func, cityName) {
    getFavouritesRequest(func, [cityName]);
}

function getFavouritesRequest(func, cityName = null) {
    const endpoint = "favourites";
    const method = "GET";
    let params = null;
    if (cityName != null) {
        params = "?cityName=" + cityName;
    }
    sendWeatherApiRequest(endpoint, params, method, func);
}

function addFavouriteRequest(cityName, func) {
    const endpoint = "favourites";
    const method = "POST";
    const params = "?cityName=" + cityName;
    sendWeatherApiRequest(endpoint, params, method, func);
}

function deleteFavouriteRequest(cityName, func) {
    const endpoint = "favourites";
    const method = "DELETE";
    const params = "?cityName=" + cityName;
    sendWeatherApiRequest(endpoint, params, method, func);
}

function getCityByNameRequest(cityName, func) {
    const endpoint = "city";
    const method = "GET";
    const params = "?cityName=" + cityName;
    sendWeatherApiRequest(endpoint, params, method, func);
}

function getCityByCoordsRequest(lat, lon, func) {
    const endpoint = "coordinates";
    const method = "GET";
    const params = "?latitude=" + lat + "&longitude=" + lon;
    sendWeatherApiRequest(endpoint, params, method, func);
}

function getCityRequest(source, func) {
    if (source.byCity) {
        getCityByNameRequest(source.cityName, func);
    } else {
        getCityByCoordsRequest(source.latitude, source.longitude, func);
    }
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