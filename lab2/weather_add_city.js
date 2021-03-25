function replaceLoaderBlockWithNewCityBlock(response, loaderBlock) {
    const weatherBlock = makeWeatherBlockFromResponse(response);
    if (!checkIfWeatherBlockIsAlreadyInList(weatherBlock)) {
        replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    } else {
        removeWeatherBlockFromList(loaderBlock);
        alert("Этот город уже был добавлен в список.")
    }
}

function addCitySuccess(response, loaderBlock) {
    response.json()
        .then(function (resp) {
            if (response !== null) {
                replaceLoaderBlockWithNewCityBlock(resp, loaderBlock);
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
    getCityRequest(source, (response) => addCityReceiveResponse(response, loaderBlock));
}

function addCityButtonClick() {
    const cityNameInput = document.getElementById("city-name-input");
    const cityName = cityNameInput.value;
    cityNameInput.value = "";
    const source = {byCity: true, cityName: cityName};
    addCityWithRequest(source);
}


function updateCitySuccess(response, cityName, loaderBlock, weatherBlock) {
    response.json()
        .then(function(resp) {
            if (resp === null) {
                updateCityFailure(response, cityName, loaderBlock, weatherBlock);
            } else {
                replaceLoaderBlockWithNewCityBlock(resp, loaderBlock);
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
    getCityRequest(source,
        (response) => updateCityReceiveResponse(response, source.cityName, loaderBlock, weatherBlock),
        source.cityName);
}

function updateCityButtonClick(weatherBlock) {
    const cityName = weatherBlock.getElementsByClassName("wtr-city-name")[0].innerText;
    const source = {byCity: true, cityName: cityName};
    updateCityWithRequest(source, weatherBlock);
}

function deleteCitySuccess(weatherBlock) {
    removeWeatherBlockFromList(weatherBlock);
}

function deleteCityButtonClick(weatherBlock) {
    deleteCitySuccess(weatherBlock);
}