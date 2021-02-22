function getWeatherStateFromResponse(response) {
    return {
        "temp": response.main.temp,
        "wind": response.wind.speed,
        "clouds": response.clouds.all,
        "pressure": response.main.pressure,
        "humidity": response.main.humidity
    };
}

function currentPositionSuccess(position) {
    const source = {
        byCity: false,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }

    const xhr = makeSourceWeatherRequest(source);
    sendWeatherRequest(xhr, function() {
        const state = getWeatherStateFromResponse(xhr.response);
        console.log(state);
    });
}

function currentPositionError() {
    const def_latitude = 60;
    const def_longitude = 30;
    const source = {
        byCity: false,
        latitude: def_latitude,
        longitude: def_longitude
    }

    const xhr = makeSourceWeatherRequest(source);
    sendWeatherRequest(xhr, function() {
        const state = getWeatherStateFromResponse(xhr.response);
        console.log(state);
    });
}

function addSampleWeatherBlock() {
    const property = {name: "Ветер", value: "Moderate breeze, 6.0 m/s, North-northwest"};
    let propertyList = []
    for (let i = 0; i < 5; ++i) {
        propertyList.push(JSON.parse(JSON.stringify(property)));
    }
    const weatherBlock = makeWeatherBlock("Moscow", 5,
        "img/icon-set/PNG/50x50/cloudy.png", propertyList);
    addWeatherBlockInList(weatherBlock);
}

document.addEventListener("DOMContentLoaded", function() {
    const buttonId = "add-city-btn";
    const button = document.getElementById(buttonId);
    button.onclick = addSampleWeatherBlock;
});

// navigator.geolocation.getCurrentPosition(currentPositionSuccess, currentPositionError, {
//     enableHighAccuracy: true
// })
