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
    const response = xhr.response;
    const state = getWeatherStateFromResponse(response);
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

function addCityWithRequest(cityName) {
    const loaderBlock = makeLoaderCityBlock();
    addWeatherBlockInList(loaderBlock);
    const xhr = makeCityWeatherRequest(cityName);
    sendWeatherRequest(xhr, (xhr) => addCityReceiveResponse(xhr, loaderBlock));
}

function addCityButtonClick() {
    const cityNameInput = document.getElementById("city-name-input");
    const cityName = cityNameInput.value;
    cityNameInput.value = "";
    addCityWithRequest(cityName);
}

function updateCitySuccess(xhr, cityName, loaderBlock, weatherBlock) {
    const response = xhr.response;
    const state = getWeatherStateFromResponse(response);
    if (state === null) {
        updateCityFailure(xhr, cityName, loaderBlock, weatherBlock);
    } else {
        replaceLoaderBlockWithNewCityBlock(state, loaderBlock);
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

function updateCityWithRequest(cityName, weatherBlock) {
    const loaderBlock = makeLoaderCityBlock();
    replaceWeatherBlockFromList(weatherBlock, loaderBlock);
    const xhr = makeCityWeatherRequest(cityName);
    sendWeatherRequest(xhr, (xhr) => updateCityReceiveResponse(xhr, cityName, loaderBlock, weatherBlock));
}

function updateCityButtonClick(weatherBlock) {
    const cityName = weatherBlock.getElementsByClassName("wtr-city-name")[0].innerText;
    updateCityWithRequest(cityName, weatherBlock);
}

function deleteCityButtonClick(weatherBlock) {
    removeWeatherBlockFromList(weatherBlock);
}