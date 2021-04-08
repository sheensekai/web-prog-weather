errorMessage = {}
errorMessage[404] = "К сожалению, выполнить запрос не получилось.";
errorMessage[429] = "К сожалению, выполнить запрос не получилось не получилось, поскольку был превышен лимит посылаемых запросов. Попробуйте еще раз через минуту.";
errorMessage[500] = "К сожалению, выоплнить запрос не получилось, т. к. на сервере произошла ошибка.";

function replaceLoaderBlockWithNewCityBlock(state, loaderBlock) {
    const weatherBlock = makeWeatherBlockFromState(state);
    if (!checkIfWeatherBlockIsAlreadyInList(weatherBlock)) {
        replaceWeatherBlockFromList(loaderBlock, weatherBlock);
    } else {
        removeWeatherBlockFromList(loaderBlock);
        alert("Этот город уже был добавлен в список.")
    }
}

async function doAddCity(cityName) {
    const loaderBlock = makeLoaderCityBlock();
    addWeatherBlockInList(loaderBlock);
    const result = await addFavouriteRequest(cityName);

    if (result.status === 200) {
        replaceLoaderBlockWithNewCityBlock(result.weatherState, loaderBlock);
    } else {
        removeWeatherBlockFromList(loaderBlock);
        alert(errorMessage[result.status]);
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

async function doUpdateCity(cityName, weatherBlock) {
    const loaderBlock = makeLoaderCityBlock();
    replaceWeatherBlockFromList(weatherBlock, loaderBlock);
    const result = await getFavouritesRequest(cityName)

    if (result.status === 200) {
        replaceLoaderBlockWithNewCityBlock(result.weatherState, loaderBlock);
    }  else {
        replaceWeatherBlockFromList(loaderBlock, weatherBlock);
        alert(errorMessage[result.status]);
    }
}

function updateCityButtonClick(weatherBlock) {
    const cityName = weatherBlock.getElementsByClassName("wtr-city-name")[0].innerText;
    doUpdateCity(cityName, weatherBlock);
}

async function doDeleteCity(cityName, weatherBlock) {
    const result = await deleteFavouriteRequest(cityName);

    if (result.status === 200) {
        removeWeatherBlockFromList(weatherBlock);
    } else {
        alert(errorMessage[result.status]);
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

async function doLoadFavouriteCities() {
    clearWeatherBlockList();
    const loaderBlock = makeLoaderCityBlock();
    addWeatherBlockInList(loaderBlock);
    const result = await getFavouritesRequest();

    if (result.status === 200) {
        loadFavouriteCitiesSuccess(result.weatherState, loaderBlock);
    } else {
        removeWeatherBlockFromList(loaderBlock);
        alert(errorMessage[result.status]);
    }
}