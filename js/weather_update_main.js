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

async function doUpdateMainCity(source) {
    const mainBlock = document.getElementsByClassName("wtr-main-block")[0];
    const loaderBlock = setLoaderForMain();
    const result = await getCityRequest(source);

    if (result.status === 200) {
        const newMainBlock = makeMainWeatherBlockFromState(result.weatherState);
        updateMainWeatherBlock(newMainBlock);
    } else {
        if (mainBlock !== null) {
            updateMainWeatherBlock(mainBlock);
        } else {
            removeMainWeatherBlock(loaderBlock);
        }
        alert(errorMessage[result.status]);
    }
}