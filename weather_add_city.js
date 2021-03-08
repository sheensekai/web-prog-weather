function replaceLoaderBlockWithNewCityBlock(state, loaderBlock) {
    const weatherProperties = getRuPropertyListFromState(state);
    const imgSrc = getIconUrlFromResponseState(state);
    const weatherBlock = makeWeatherBlock(state.cityName, state.temp, imgSrc, weatherProperties);
    if (!checkIfWeatherBlockIsAlreadyInList(weatherBlock)) {
        replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    } else {
        removeWeatherBlockFromList(loaderBlock);
        alert("Этот город уже был добавлен в список.")
    }
}

function addCitySuccess(xhr, loaderBlock) {
    const state = xhr.response;
    if (state !== null) {
        replaceLoaderBlockWithNewCityBlock(state, loaderBlock);
    }
}

function addCityFailure(xhr, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожаление, данные о погоде в указанном городе найти не получилось. Убедитесь, что ввели правильное название.");
}

function addCityTooManyRequests(xhr, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожаление, данные о погоде в указанном городе найти не получилось. Был превышен лимит запросов для приложения. Подождите минуту и добавьте город еще раз.");
}

function addCityReceiveResponse(xhr, loaderBlock) {
    if (xhr.status === 200) {
        addCitySuccess(xhr, loaderBlock);
    } else if (xhr.status === 404) {
        addCityFailure(xhr, loaderBlock);
    } else if (xhr.status === 429) {
        addCityTooManyRequests(xhr, loaderBlock);
    }
}

function updateCitySuccess(xhr, cityName, loaderBlock, weatherBlock) {
    const states = xhr.response;
    let found = false;
    for (let state of states) {
        if (states.cityName === cityName) {
            replaceLoaderBlockWithNewCityBlock(state, loaderBlock);
            found = true;
            break;
        }
    }
    if (!found) {
        updateCityFailure(xhr, cityName, loaderBlock, weatherBlock);
    }
}

function updateCityFailure(xhr, cityName, loaderBlock, weatherBlock) {
    replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    alert("К сожалению, обновить данные о данном городе не получилось.");
}

function updateCityTooManyRequests(xhr, cityName, loaderBlock, weatherBlock) {
    replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    alert("К сожалению, обновить данные о данном городе не получилось, поскольку был превышен лимит посылаемых запросов. Попробуйте еще раз через минуту.");
}

function updateCityReceiveResponse(xhr, cityName, loaderBlock, weatherBlock) {
    if (xhr.status === 200) {
        updateCitySuccess(xhr, cityName, loaderBlock, weatherBlock);
    } else if (xhr.status === 404) {
        updateCityFailure(xhr, cityName, loaderBlock, weatherBlock);
    } else if (xhr.status === 429) {
        updateCityTooManyRequests(xhr, cityName, loaderBlock, weatherBlock);
    }
}

function addCityWithRequest(source) {
    const loaderBlock = makeLoaderCityBlock();
    addWeatherBlockInList(loaderBlock);
    addFavouriteRequest(source.cityName, (xhr) => addCityReceiveResponse(xhr, loaderBlock));
}

function updateCityWithRequest(source, weatherBlock) {
    const loaderBlock = makeLoaderCityBlock();
    replaceWeatherBlockFromList(weatherBlock, loaderBlock);
    getFavouritesRequest((xhr) => updateCityReceiveResponse(xhr, source.cityName, loaderBlock, weatherBlock));
}

function addCityButtonClick() {
    const cityNameInput = document.getElementById("city-name-input");
    const cityName = cityNameInput.value;
    cityNameInput.value = "";
    const source = {byCity: true, cityName: cityName};
    addCityWithRequest(source);
}

function updateCityButtonClick(weatherBlock) {
    const cityName = weatherBlock.getElementsByClassName("wtr-city-name")[0].innerText;
    const source = {byCity: true, cityName: cityName};
    updateCityWithRequest(source, weatherBlock);
}