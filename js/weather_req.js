async function sendWeatherRequest(endpoint, params, method) {
    const url = new URL("https://my-nodejs-weather-server.herokuapp.com/weather/" + endpoint);
    if (params !== null) {
        for (let key in params) {
            url.searchParams.append(key, params[key]);
        }
    }
    const response = await fetch(url, {
        method: method
    });

    const result =  {status: response.status, weatherState: null};
    const responseText = await response.text();
    if (result.status === 200 && responseText !== "OK") {
        try {
            result.weatherState = JSON.parse(responseText);
        } catch (err) {
            throw new Error("Wrong response value, got:" + responseText);
        }
    }
    return result;
}

async function getFavouritesRequest(cityName = null) {
    const endpoint = "favourites";
    const method = "GET";
    let params = null;
    if (cityName !== null) {
        params = {cityName : cityName};
    }
    return await sendWeatherRequest(endpoint, params, method);
}

async function addFavouriteRequest(cityName) {
    const endpoint = "favourites";
    const method = "POST";
    const params = {cityName : cityName};
    return await sendWeatherRequest(endpoint, params, method);
}

async function deleteFavouriteRequest(cityName) {
    const endpoint = "favourites";
    const method = "DELETE";
    const params = {cityName : cityName};
    return await sendWeatherRequest(endpoint, params, method);
}

async function getCityByNameRequest(cityName) {
    const endpoint = "city";
    const method = "GET";
    const params = {cityName : cityName};
    return await sendWeatherRequest(endpoint, params, method);
}

async function getCityByCoordsRequest(lat, lon) {
    const endpoint = "coordinates";
    const method = "GET";
    const params = {latitude: lat, longitude: lon};
    return await sendWeatherRequest(endpoint, params, method);
}

async function getCityRequest(source) {
    if (source.byCity) {
        return await getCityByNameRequest(source.cityName);
    } else {
        return await getCityByCoordsRequest(source.latitude, source.longitude);
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