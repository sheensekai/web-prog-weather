const def_cityName = "Moscow";

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

function updateMainCitySuccess(xhr, loaderBlock, mainBlock) {
    const state = xhr.response;
    if (state !== null) {
        const weatherProperties = getRuPropertyListFromState(state);
        const imgSrc = getIconUrlFromResponseState(state);
        const newMainBlock = makeMainWeatherBlock(state.cityName, state.temp, imgSrc, weatherProperties);
        updateMainWeatherBlock(newMainBlock);
    } else {
        updateMainCityFailure(xhr, loaderBlock, mainBlock);
    }
}

function updateMainCityFailure(xhr, loaderBlock, mainBlock) {
    if (mainBlock !== null) {
        updateMainWeatherBlock(mainBlock);
        alert("К сожалению, обновить данные о городе не получилось.")
    } else {
        removeMainWeatherBlock(loaderBlock);
        alert("К сожалению, загрузить данные о городе по вашему месторасположению не получилось.");
    }
}

function updateMainCityTooManyRequests(xhr, loaderBlock, mainBlock) {
    if (mainBlock !== null) {
        updateMainWeatherBlock(mainBlock);
        alert("К сожалению, обновить данные о городе не получилось, так как был превышен лимит на количество запросов.")
    } else {
        removeMainWeatherBlock(loaderBlock);
        alert("К сожалению, загрузить данные о городе по вашему месторасположению не получилось, так как был превышен лимит на количество запросов.");
    }
}

function updateMainCityReceiveResponse(xhr, loaderBlock, mainBlock) {
    if (xhr.status === 200) {
        updateMainCitySuccess(xhr, loaderBlock, mainBlock);
    } else if (xhr.status === 404) {
        updateMainCityFailure(xhr, loaderBlock, mainBlock);
    } else if (xhr.status === 429) {
        updateMainCityTooManyRequests(xhr, loaderBlock, mainBlock);
    }
}

function updateMainCityWithRequest(source) {
    const mainBlock = document.getElementsByClassName("wtr-main-block")[0];
    const loaderBlock = setLoaderForMain();
    getCityRequest(source, (xhr) => updateMainCityReceiveResponse(xhr, loaderBlock, mainBlock))
}