const def_imgSrc = "img/icon-set/PNG/50x50/cloudy.png";
const def_cityName = "Moscow";
const def_temp = 5;

function addSampleWeatherBlock() {
    const property = {name: "Ветер", value: "Moderate breeze, 6.0 m/s, North-northwest"};
    let propertyList = []
    for (let i = 0; i < 5; ++i) {
        propertyList.push(JSON.parse(JSON.stringify(property)));
    }
    const weatherBlock = makeWeatherBlock(def_cityName, def_temp,
        def_imgSrc, propertyList);
    addWeatherBlockInList(weatherBlock);
}

function addCityWithRequest(source) {
    const xhr = makeSourceWeatherRequest(source);
    sendWeatherRequest(xhr, function() {
        const state = getWeatherStateFromResponse(xhr.response);
        if (state !== null) {
            const weatherProperties = getRuPropertyListFromState(state);
            const weatherBlock = makeWeatherBlock(state.cityName, state.temp, def_imgSrc, weatherProperties);
            addWeatherBlockInList(weatherBlock);
        }
    });
}

function addCityButtonClick() {
    const cityNameInput = document.getElementById("city-name-input");
    const cityName = cityNameInput.value;
    cityNameInput.value = "";
    const source = {byCity: true, cityName: cityName};
    addCityWithRequest(source);
}

document.addEventListener("DOMContentLoaded", function() {
    const buttonId = "add-city-btn";
    const button = document.getElementById(buttonId);
    button.onclick = addCityButtonClick;
});