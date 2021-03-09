function replaceLoaderBlockWithNewCityBlock(state, loaderBlock) {
    const weatherBlock = makeWeatherBlockFromState(state);
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

function addCityWithRequest(source) {
    const loaderBlock = makeLoaderCityBlock();
    addWeatherBlockInList(loaderBlock);
    addFavouriteRequest(source.cityName,
        (xhr) => addCityReceiveResponse(xhr, loaderBlock));
}

function addCityButtonClick() {
    const cityNameInput = document.getElementById("city-name-input");
    const cityName = cityNameInput.value;
    cityNameInput.value = "";
    const source = {byCity: true, cityName: cityName};
    addCityWithRequest(source);
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

function updateCityWithRequest(source, weatherBlock) {
    const loaderBlock = makeLoaderCityBlock();
    replaceWeatherBlockFromList(weatherBlock, loaderBlock);
    getFavouritesRequest(
        (xhr) => updateCityReceiveResponse(xhr, source.cityName, loaderBlock, weatherBlock));
}

function updateCityButtonClick(weatherBlock) {
    const cityName = weatherBlock.getElementsByClassName("wtr-city-name")[0].innerText;
    const source = {byCity: true, cityName: cityName};
    updateCityWithRequest(source, weatherBlock);
}


function deleteCitySuccess(xhr, cityName, weatherBlock) {
    removeWeatherBlockFromList(weatherBlock);
}

function deleteCityFailure(xhr, cityName, weatherBlock) {
    alert("К сожалению, удалить город из списка не вышло. Попробуйте обновить станицу и повторить попытку.");
}


function deleteCityTooManyRequests(xhr, cityName, weatherBlock) {
    alert("К сожалению, удалить город из списка не вышло, т. к. был превышен лимит на количество запросов. Попрбуйте еще раз через минуту.");
}

function deleteCityReceiveResponse(xhr, cityName, weatherBlock) {
    if (xhr.status === 200) {
        deleteCitySuccess(xhr, cityName, weatherBlock);
    } else if (xhr.status === 404) {
        deleteCityFailure(xhr, cityName, weatherBlock);
    } else if (xhr.status === 429) {
        deleteCityTooManyRequests(xhr, cityName, weatherBlock);
    }
}

function deleteCityWithRequest(source, weatherBlock) {
    const cityName = source.cityName
    deleteFavouriteRequest(cityName,
        (xhr) => deleteCityReceiveResponse(xhr, cityName, weatherBlock));
}

function deleteCityButtonClick(weatherBlock) {
    const cityName = weatherBlock.getElementsByClassName("wtr-city-name")[0].innerText;
    const source = {byCity: true, cityName: cityName};
    deleteCityWithRequest(source, weatherBlock);
}


function loadFavouriteCitiesSuccess(xhr, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    const statesArr = xhr.response;
    const blocksArr = [];
    for (let state of statesArr) {
        blocksArr.push(makeWeatherBlockFromState(state));
    }
    addSeveralWeatherBlocksInList(blocksArr);
}

function loadFavouriteCitiesFailure(xhr, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожалению, загрузить избранные города не получилось.")
}

function loadFavouritesCitiesTooManyRequests(xhr, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожалению, загрузить избранные города не получилось, т. к. был превышен лимит на количество запросов. Попробуйте обновить страницу через минуту.");
}

function loadFavouriteCities() {
    clearWeatherBlockList();
    const loaderBlock = makeLoaderCityBlock();
    addWeatherBlockInList(loaderBlock);
    getFavouritesRequest(function(xhr) {
        if (xhr.status === 200) {
            loadFavouriteCitiesSuccess(xhr, loaderBlock);
        } else if (xhr.status === 404) {
            loadFavouriteCitiesFailure(xhr, loaderBlock);
        } else if (xhr.status === 429) {
            loadFavouritesCitiesTooManyRequests(xhr, loaderBlock);
        }
    })
}