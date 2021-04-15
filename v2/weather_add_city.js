let cities;

function replaceLoaderBlockWithNewCityBlock(weatherState, loaderBlock) {
    const weatherBlock = makeWeatherBlockFromState(weatherState);
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
    const loaderBlock = makeLoaderBlock();
    addWeatherBlockInList(loaderBlock);
    const result = await getCityRequest(source);

    if (result.status === 200) {
        const weatherState = result.weatherState;
        replaceLoaderBlockWithNewCityBlock(weatherState, loaderBlock);
        addCityStateInStorage(weatherState);
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
    const loaderBlock = makeLoaderBlock();
    replaceWeatherBlockFromList(weatherBlock, loaderBlock);
    const result = await getCityRequest(source);

    if (result.status === 200) {
        const weatherState = result.weatherState;
        replaceLoaderBlockWithNewCityBlock(weatherState, loaderBlock);
        addCityStateInStorage(weatherState);
    } else if (result.status === 404) {
        updateCityFailure(loaderBlock, weatherBlock);
    } else if (result.status === 429) {
        updateCityTooManyRequests(loaderBlock, weatherBlock);
    }
}

function updateCityButtonClick(weatherBlock) {
    const cityName = getCityName(weatherBlock);
    const source = {byCity: true, cityName: cityName};
    doUpdateCity(source, weatherBlock);
}

function deleteCityButtonClick(weatherBlock) {
    removeWeatherBlockFromList(weatherBlock);
    const cityName = getCityName(weatherBlock);
    removeCityStateFromStorage(cityName);
}

function addAllSavedCities() {
    for (let cityName in cities) {
        const weatherState = cities[cityName];
        const weatherBlock = makeWeatherBlockFromState(weatherState);
        addWeatherBlockInList(weatherBlock);
    }
}

function makeFavouriteCitiesPromises() {
    const promises = [];
    for (let cityName in cities) {
        const promise = new Promise(async (resolve, reject)  =>  {
            const result = await getCityByNameRequest(cityName);
            if (result.status !== 200) {
                reject();
            } else {
                cities[cityName] = result.weatherState;
                resolve();
            }
        });
        promises.push(promise);
    }
    return promises;
}

function doLoadFavouriteCities() {
    if (!localStorage.hasOwnProperty("favouriteCities")) {
        cities = {};
    } else {
        cities = JSON.parse(localStorage.favouriteCities);
        const promises = makeFavouriteCitiesPromises();

        Promise.all(promises)
            .then(() => addAllSavedCities())
            .catch(() => alert("К сожалению, загрузить сохраненные города не получилось."));
    }
}