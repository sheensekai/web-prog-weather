const def_cityName = "Moscow";

function currentPositionSuccess(position) {
    const source = {
        byCity: false,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    doUpdateMainCity(source);
}

function currentPositionError() {
    const source = {
        byCity: true,
        cityName: def_cityName
    }
    doUpdateMainCity(source);
}

function updateMainCitySuccess(weatherState) {
    const newMainBlock = makeMainWeatherBlockFromState(weatherState);
    updateMainWeatherBlock(newMainBlock);
}

async function doUpdateMainCity(source) {
    const mainBlock = document.getElementsByClassName("wtr-main-block")[0];
    const loaderBlock = setLoaderForMain();
    const result = await getCityRequest(source);

    if (result.status === 200) {
        updateMainCitySuccess(result.weatherState, loaderBlock, mainBlock);
    } else {
        if (mainBlock !== null) {
            updateMainWeatherBlock(mainBlock);
        } else {
            removeMainWeatherBlock(loaderBlock);
        }
        alert(errorMessage[result.status]);
    }
}