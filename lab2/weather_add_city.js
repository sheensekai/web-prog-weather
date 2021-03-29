function replaceLoaderBlockWithNewCityBlock(weatherState, loaderBlock) {
    const weatherBlock = makeWeatherBlockFromResponse(weatherState);
    if (!checkIfWeatherBlockIsAlreadyInList(weatherBlock)) {
        replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    } else {
        removeWeatherBlockFromList(loaderBlock);
        alert("Этот город уже был добавлен в список.")
    }
}

function addCityFailure(loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожаление, данные о погоде в указанном городе найти не получилось. Убедитесь, что ввели правильное название.");
}

function addCityTooManyRequests(loaderBlock) {
    removeWeatherBlockFromList(loaderBlock);
    alert("К сожаление, данные о погоде в указанном городе найти не получилось. Был превышен лимит запросов для приложения. Подождите минуту и добавьте город еще раз.");
}

async function doAddCity(source) {
    const loaderBlock = makeLoaderCityBlock();
    addWeatherBlockInList(loaderBlock);
    const result = await getCityRequest(source);

    if (result.status === 200) {
        replaceLoaderBlockWithNewCityBlock(result.weatherState, loaderBlock);
    } else if (result.status === 404) {
        addCityFailure(loaderBlock);
    } else if (result.status === 429) {
        addCityTooManyRequests(loaderBlock);
    }
}

function addCityButtonClick() {
    const cityNameInput = document.getElementById("city-name-input");
    const cityName = cityNameInput.value;
    if (cityName !== null && cityName !== "") {
        cityNameInput.value = "";
        const source = {byCity: true, cityName: cityName};
        doAddCity(source);
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

async function doUpdateCity(source, weatherBlock) {
    const loaderBlock = makeLoaderCityBlock();
    replaceWeatherBlockFromList(weatherBlock, loaderBlock);
    const result = await getCityRequest(source);

    if (result.status === 200) {
        replaceLoaderBlockWithNewCityBlock(result, loaderBlock);
    } else if (result.status === 404) {
        updateCityFailure(loaderBlock, weatherBlock);
    } else if (result.status === 429) {
        updateCityTooManyRequests(loaderBlock, weatherBlock);
    }
}

function updateCityButtonClick(weatherBlock) {
    const cityName = weatherBlock.getElementsByClassName("wtr-city-name")[0].innerText;
    const source = {byCity: true, cityName: cityName};
    doUpdateCity(source, weatherBlock);
}

function deleteCitySuccess(weatherBlock) {
    removeWeatherBlockFromList(weatherBlock);
}

function deleteCityButtonClick(weatherBlock) {
    deleteCitySuccess(weatherBlock);
}