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

// navigator.geolocation.getCurrentPosition(currentPositionSuccess, currentPositionError, {
//     enableHighAccuracy: true
// })
