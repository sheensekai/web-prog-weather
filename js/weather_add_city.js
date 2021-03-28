function replaceLoaderBlockWithNewCityBlock(state, loaderBlock) {
    const weatherBlock = makeWeatherBlockFromState(state);
    if (!checkIfWeatherBlockIsAlreadyInList(weatherBlock)) {
        replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    } else {
        removeWeatherBlockFromList(loaderBlock);
        alert("Этот город уже был добавлен в список.")
    }
}

function addCitySuccess(response, loaderBlock) {
    response.json()
        .then(function (state) {
            if (state !== null) {
                replaceLoaderBlockWithNewCityBlock(state, loaderBlock);
            } else {
                addCityFailure(response, loaderBlock);
            }
        }).catch(() => addCityFailure(response, loaderBlock));
}

function addCityFailure(response, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожаление, данные о погоде в указанном городе найти не получилось. Убедитесь, что ввели правильное название.");
}

function addCityTooManyRequests(response, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожаление, данные о погоде в указанном городе найти не получилось. Был превышен лимит запросов для приложения. Подождите минуту и добавьте город еще раз.");
}

function addCityReceiveResponse(response, loaderBlock) {
    if (response.status === 200) {
        addCitySuccess(response, loaderBlock);
    } else if (response.status === 404) {
        addCityFailure(response, loaderBlock);
    } else if (response.status === 429) {
        addCityTooManyRequests(response, loaderBlock);
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
    if (cityName !== null && cityName !== "") {
        cityNameInput.value = "";
        const source = {byCity: true, cityName: cityName};
        addCityWithRequest(source);
    }
}


function updateCitySuccess(response, cityName, loaderBlock, weatherBlock) {
    response.json()
        .then(function(states) {
            if (states === null || states.length !== 1) {
                updateCityFailure(response, cityName, loaderBlock, weatherBlock);
            } else {
                const state = states[0];
                replaceLoaderBlockWithNewCityBlock(state, loaderBlock);
            }
        }).catch(() => updateCityFailure(response, cityName, loaderBlock, weatherBlock));
}

function updateCityFailure(response, cityName, loaderBlock, weatherBlock) {
    replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    alert("К сожалению, обновить данные о данном городе не получилось.");
}

function updateCityTooManyRequests(response, cityName, loaderBlock, weatherBlock) {
    replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    alert("К сожалению, обновить данные о данном городе не получилось, поскольку был превышен лимит посылаемых запросов. Попробуйте еще раз через минуту.");
}

function updateCityReceiveResponse(response, cityName, loaderBlock, weatherBlock) {
    if (response.status === 200) {
        updateCitySuccess(response, cityName, loaderBlock, weatherBlock);
    } else if (response.status === 404) {
        updateCityFailure(response, cityName, loaderBlock, weatherBlock);
    } else if (response.status === 429) {
        updateCityTooManyRequests(response, cityName, loaderBlock, weatherBlock);
    }
}

function updateCityWithRequest(source, weatherBlock) {
    const loaderBlock = makeLoaderCityBlock();
    replaceWeatherBlockFromList(weatherBlock, loaderBlock);
    getFavouriteByNameRequest(
        (response) => updateCityReceiveResponse(response, source.cityName, loaderBlock, weatherBlock),
        source.cityName);
}

function updateCityButtonClick(weatherBlock) {
    const cityName = weatherBlock.getElementsByClassName("wtr-city-name")[0].innerText;
    const source = {byCity: true, cityName: cityName};
    updateCityWithRequest(source, weatherBlock);
}


function deleteCitySuccess(response, cityName, weatherBlock) {
    removeWeatherBlockFromList(weatherBlock);
}

function deleteCityFailure(response, cityName, weatherBlock) {
    alert("К сожалению, удалить город из списка не вышло. Попробуйте обновить станицу и повторить попытку.");
}

function deleteCityTooManyRequests(response, cityName, weatherBlock) {
    alert("К сожалению, удалить город из списка не вышло, т. к. был превышен лимит на количество запросов. Попрбуйте еще раз через минуту.");
}

function deleteCityReceiveResponse(response, cityName, weatherBlock) {
    if (response.status === 200) {
        deleteCitySuccess(response, cityName, weatherBlock);
    } else if (response.status === 404) {
        deleteCityFailure(response, cityName, weatherBlock);
    } else if (response.status === 429) {
        deleteCityTooManyRequests(response, cityName, weatherBlock);
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


function loadFavouriteCitiesSuccess(response, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    response.json().then(function(statesArr) {
        const blocksArr = [];
        for (let state of statesArr) {
            blocksArr.push(makeWeatherBlockFromState(state));
        }
        addSeveralWeatherBlocksInList(blocksArr);
    }).catch(() => loadFavouriteCitiesFailure(response, loaderBlock));
}

function loadFavouriteCitiesFailure(response, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожалению, загрузить избранные города не получилось.")
}

function loadFavouritesCitiesTooManyRequests(response, loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожалению, загрузить избранные города не получилось, т. к. был превышен лимит на количество запросов. Попробуйте обновить страницу через минуту.");
}

function loadFavouriteCities() {
    clearWeatherBlockList();
    const loaderBlock = makeLoaderCityBlock();
    addWeatherBlockInList(loaderBlock);
    getFavouritesRequest(function(response) {
        if (response.status === 200) {
            loadFavouriteCitiesSuccess(response, loaderBlock);
        } else if (response.status === 404) {
            loadFavouriteCitiesFailure(response, loaderBlock);
        } else if (response.status === 429) {
            loadFavouritesCitiesTooManyRequests(response, loaderBlock);
        }
    })
}