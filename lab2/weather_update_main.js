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

function updateMainCitySuccess(response, loaderBlock, mainBlock) {
    response.json()
        .then(function(resp) {
            if (resp !== null) {
                const state = getWeatherStateFromResponse(resp);
                const weatherProperties = getRuPropertyListFromState(state);
                const imgSrc = getIconUrlFromResponseState(state);
                const newMainBlock = makeMainWeatherBlock(state.cityName, state.temp, imgSrc, weatherProperties);
                updateMainWeatherBlock(newMainBlock);
            } else {
                updateMainCityFailure(response, loaderBlock, mainBlock);
            }
        }).catch(() => updateMainCityFailure(response, loaderBlock, mainBlock));
}

function updateMainCityFailure(response, loaderBlock, mainBlock) {
    if (mainBlock !== null) {
        updateMainWeatherBlock(mainBlock);
        alert("К сожалению, обновить данные о городе не получилось.")
    } else {
        removeMainWeatherBlock(loaderBlock);
        alert("К сожалению, загрузить данные о городе по вашему месторасположению не получилось.");
    }
}

function updateMainCityTooManyRequests(response, loaderBlock, mainBlock) {
    if (mainBlock !== null) {
        updateMainWeatherBlock(mainBlock);
        alert("К сожалению, обновить данные о городе не получилось, так как был превышен лимит на количество запросов.")
    } else {
        removeMainWeatherBlock(loaderBlock);
        alert("К сожалению, загрузить данные о городе по вашему месторасположению не получилось, так как был превышен лимит на количество запросов.");
    }
}

function updateMainCityReceiveResponse(response, loaderBlock, mainBlock) {
    if (response.status === 200) {
        updateMainCitySuccess(response, loaderBlock, mainBlock);
    } else if (response.status === 404) {
        updateMainCityFailure(response, loaderBlock, mainBlock);
    } else if (response.status === 429) {
        updateMainCityTooManyRequests(response, loaderBlock, mainBlock);
    }
}

function updateMainCityWithRequest(source) {
    const mainBlock = document.getElementsByClassName("wtr-main-block")[0];
    const loaderBlock = setLoaderForMain();
    getCityRequest(source, (response) => updateMainCityReceiveResponse(response, loaderBlock, mainBlock))
}