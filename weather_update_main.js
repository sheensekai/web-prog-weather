function currentPositionSuccess(position) {
    const source = {
        byCity: false,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    updateMainCityWithRequest(source);
}

function currentPositionError() {
    const source = {
        byCity: true,
        cityName: def_cityName
    }
    updateMainCityWithRequest(source);
}

function updateMainCityWithRequest(source) {
    setLoaderForMain();

    const xhr = makeSourceWeatherRequest(source);
    sendWeatherRequest(xhr, function() {
        const state = getWeatherStateFromResponse(xhr.response);
        if (state !== null) {
            const weatherProperties = getRuPropertyListFromState(state);
            const mainWeatherBlock = makeMainWeatherBlock(state.cityName, state.temp, def_imgSrc, weatherProperties);
            updateMainWeatherBlock(mainWeatherBlock);
        }
    });
}