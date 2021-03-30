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

function updateMainCityFailure(loaderBlock, mainBlock) {
    if (mainBlock !== null) {
        updateMainWeatherBlock(mainBlock);
        alert("К сожалению, обновить данные о городе не получилось.")
    } else {
        removeMainWeatherBlock(loaderBlock);
        alert("К сожалению, загрузить данные о городе по вашему месторасположению не получилось.");
    }
}

function updateMainCityTooManyRequests(loaderBlock, mainBlock) {
    if (mainBlock !== null) {
        updateMainWeatherBlock(mainBlock);
        alert("К сожалению, обновить данные о городе не получилось, так как был превышен лимит на количество запросов.")
    } else {
        removeMainWeatherBlock(loaderBlock);
        alert("К сожалению, загрузить данные о городе по вашему месторасположению не получилось, так как был превышен лимит на количество запросов.");
    }
}

async function doUpdateMainCity(source) {
    const mainBlock = document.getElementsByClassName("wtr-main-block")[0];
    const loaderBlock = setLoaderForMain();
    const result = await getCityRequest(source);

    if (result.status === 200) {
        updateMainCitySuccess(result.weatherState, loaderBlock, mainBlock);
    } else if (result.status === 404) {
        updateMainCityFailure(loaderBlock, mainBlock);
    } else if (result.status === 429) {
        updateMainCityTooManyRequests(loaderBlock, mainBlock);
    }
}