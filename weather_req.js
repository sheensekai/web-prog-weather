function currentPositionSuccess(position) {
    sendWeatherRequest(position.coords.latitude, position.coords.longitude);
}

function currentPositionError() {
    const def_latitude = 60;
    const def_longitude = 30;
    sendWeatherRequest(def_latitude, def_longitude);
}

function sendWeatherRequest(latitude, longitude) {
    const xhr = new XMLHttpRequest();
    const api_key = "34e35a1d80msh1acf606c8def3adp132cbbjsn7f1eb5c439c4";
    const host = "community-open-weather-map.p.rapidapi.com";
    const method = "GET";

    let url = "https://community-open-weather-map.p.rapidapi.com/weather";
    url += "?";
    url += "lat" + "=" + latitude + "&";
    url += "lon" + "=" + longitude;

    console.log("lat:" + latitude + " lon:" + longitude);
    xhr.onload = function () {
        console.log(xhr.responseText);
    }

    xhr.open(method, url);
    xhr.setRequestHeader("x-rapidapi-key", api_key);
    xhr.setRequestHeader("x-rapidapi-host", host);
    xhr.send();
}