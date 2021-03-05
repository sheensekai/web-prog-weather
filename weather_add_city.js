function addCityWithRequest(source, replacedBlock = null) {
    const loaderBlock = makeLoaderCityBlock();
    if (replacedBlock != null) {
        replaceWeatherBlockFromList(replacedBlock, loaderBlock);
    } else {
        addWeatherBlockInList(loaderBlock);
    }

    const xhr = makeSourceWeatherRequest(source);
    sendWeatherRequest(xhr, function () {
            const state = getWeatherStateFromResponse(xhr.response);
            if (state !== null) {
                const weatherProperties = getRuPropertyListFromState(state);
                const imgSrc = getIconUrlFromResponseState(state);
                const weatherBlock = makeWeatherBlock(state.cityName, state.temp, imgSrc, weatherProperties);
                replaceWeatherBlockFromList(loaderBlock, weatherBlock);
            }
        },
        function () {
            removeWeatherBlockFromList(loaderBlock);
            alert("К сожаление, данные о погоде в указанном городе найти не получилось. Убедитесь, что ввели правильное название.");
        },
        function () {
            removeWeatherBlockFromList(loaderBlock);
            alert("К сожаление, данные о погоде в указанном городе найти не получилось. Был превышен лимит запросов для приложения. Подождите минуту и добавьте город еще раз.");
        });
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
    addCityWithRequest(source, weatherBlock);
}