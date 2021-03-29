function replaceLoaderBlockWithNewCityBlock(state, loaderBlock) {
    const weatherBlock = makeWeatherBlockFromState(state);
    if (!checkIfWeatherBlockIsAlreadyInList(weatherBlock)) {
        replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    } else {
        removeWeatherBlockFromList(loaderBlock);
        alert("Этот город уже был добавлен в список.")
    }
}

function addCityFailure(response, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожаление, данные о погоде в указанном городе найти не получилось. Убедитесь, что ввели правильное название.");
}

function addCityTooManyRequests(response, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожаление, данные о погоде в указанном городе найти не получилось. Был превышен лимит запросов для приложения. Подождите минуту и добавьте город еще раз.");
}

async function doAddCity(cityName) {
    const loaderBlock = makeLoaderCityBlock();
    addWeatherBlockInList(loaderBlock);
    const result = await addFavouriteRequest(cityName);

    if (result.status === 200) {
        replaceLoaderBlockWithNewCityBlock(result.weatherState, loaderBlock);
    } else if (result.status === 404) {
        addCityFailure(result, loaderBlock);
    } else if (result.status === 429) {
        addCityTooManyRequests(result, loaderBlock);
    }
}

function addCityButtonClick() {
    const cityNameInput = document.getElementById("city-name-input");
    const cityName = cityNameInput.value;
    if (cityName !== null && cityName !== "") {
        cityNameInput.value = "";
        doAddCity(cityName);
    }
}

function updateCityFailure(loaderBlock, weatherBlock) {
    replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    alert("К сожалению, обновить данные о данном городе не получилось.");
}

function updateCityTooManyRequests(loaderBlock, weatherBlock) {
    replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    alert("К сожалению, обновить данные о данном городе не получилось, поскольку был превышен лимит посылаемых запросов. Попробуйте еще раз через минуту.");
}

async function doUpdateCity(cityName, weatherBlock) {
    const loaderBlock = makeLoaderCityBlock();
    replaceWeatherBlockFromList(weatherBlock, loaderBlock);
    const result = await getFavouriteByNameRequest(cityName)

    if (result.status === 200) {
        replaceLoaderBlockWithNewCityBlock(result.weatherState[0], loaderBlock);
    } else if (result.status === 404) {
        updateCityFailure(loaderBlock, weatherBlock);
    } else if (result.status === 429) {
        updateCityTooManyRequests(loaderBlock, weatherBlock);
    }
}

function updateCityButtonClick(weatherBlock) {
    const cityName = weatherBlock.getElementsByClassName("wtr-city-name")[0].innerText;
    doUpdateCity(cityName, weatherBlock);
}

function deleteCityFailure() {
    alert("К сожалению, удалить город из списка не вышло. Попробуйте обновить станицу и повторить попытку.");
}

function deleteCityTooManyRequests() {
    alert("К сожалению, удалить город из списка не вышло, т. к. был превышен лимит на количество запросов. Попрбуйте еще раз через минуту.");
}
async function doDeleteCity(cityName, weatherBlock) {
    const result = await deleteFavouriteRequest(cityName);

    if (result.status === 200) {
        removeWeatherBlockFromList(weatherBlock);
    } else if (result.status === 404) {
        deleteCityFailure();
    } else if (result.status === 429) {
        deleteCityTooManyRequests();
    }
}

function deleteCityButtonClick(weatherBlock) {
    const cityName = weatherBlock.getElementsByClassName("wtr-city-name")[0].innerText;
    doDeleteCity(cityName, weatherBlock);
}


function loadFavouriteCitiesSuccess(weatherState, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    const statesArr = (Array.isArray(weatherState) ? weatherState : [weatherState]);
    const blocksArr = [];
    for (let state of statesArr) {
        blocksArr.push(makeWeatherBlockFromState(state));
    }
    addSeveralWeatherBlocksInList(blocksArr);
}

function loadFavouriteCitiesFailure(loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожалению, загрузить избранные города не получилось.")
}

function loadFavouriteCitiesTooManyRequests(loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожалению, загрузить избранные города не получилось, т. к. был превышен лимит на количество запросов. Попробуйте обновить страницу через минуту.");
}

async function doLoadFavouriteCities() {
    clearWeatherBlockList();
    const loaderBlock = makeLoaderCityBlock();
    addWeatherBlockInList(loaderBlock);
    const result = await getFavouritesRequest();

    if (result.status === 200) {
        loadFavouriteCitiesSuccess(result.weatherState, loaderBlock);
    } else if (result.status === 404) {
        loadFavouriteCitiesFailure(loaderBlock);
    } else if (result.status === 429) {
        loadFavouriteCitiesTooManyRequests(loaderBlock);
    }
}