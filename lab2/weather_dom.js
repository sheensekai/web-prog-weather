let favCityBlockTmpl, mainCityBlockTmpl, wtrFeatTmpl, wtrLoaderTmpl, wtrMainLoaderTmpl;
let favCityBlockElem, mainCityBlockElem, wtrFeatElem, wtrLoaderElem, wtrMainLoaderElem;

function loadTemplates() {
    favCityBlockTmpl = document.getElementById("fav-city-block-tmpl");
    mainCityBlockTmpl = document.getElementById("main-city-block-tmpl");
    wtrFeatTmpl = document.getElementById("wtr-feat-tmpl");
    wtrLoaderTmpl = document.getElementById("wtr-loader-tmpl");
    wtrMainLoaderTmpl = document.getElementById("wtr-main-loader-tmpl");

    favCityBlockElem = favCityBlockTmpl.content.children[0];
    mainCityBlockElem = mainCityBlockTmpl.content.children[0];
    wtrFeatElem = wtrFeatTmpl.content.children[0];
    wtrLoaderElem = wtrLoaderTmpl.content.children[0];
    wtrMainLoaderElem = wtrMainLoaderTmpl.content.children[0];
}

function makeWeatherProperty(name, value) {
    const elem = wtrFeatElem.cloneNode(true);
    elem.getElementsByClassName("feat-name")[0].innerHTML = name;
    elem.getElementsByClassName("feat-val")[0].innerHTML = value;
    return elem;
}

function setWeatherBlockContent(elem, cityName, tempVal, imgSrc, properties) {
    elem.getElementsByClassName("wtr-city-name")[0].innerHTML = cityName;
    elem.getElementsByClassName("wtr-temp")[0].innerHTML = tempVal + " °C";
    elem.getElementsByClassName("wtr-icon")[0].setAttribute("src", imgSrc);

    const list = elem.getElementsByClassName("wtr-feat-list")[0];
    for (let prop of properties) {
        const listElem = makeWeatherProperty(prop.name, prop.value);
        list.appendChild(listElem);
    }
}

function makeWeatherBlock(cityName, tempVal, imgSrc, properties) {
    const weatherBlock = favCityBlockElem.cloneNode(true);
    setWeatherBlockContent(weatherBlock, cityName, tempVal, imgSrc, properties);

    const updateButton = weatherBlock.getElementsByClassName("wtr-upd-btn")[0];
    updateButton.onclick = () => updateCityButtonClick(weatherBlock);
    const closeButton = weatherBlock.getElementsByClassName("wtr-cls-btn")[0];
    closeButton.onclick = () => deleteCityButtonClick(weatherBlock);

    return weatherBlock;
}

function makeWeatherBlockFromResponse(response) {
    const state = getWeatherStateFromResponse(response);
    const weatherProperties = getRuPropertyListFromState(state);
    const imgSrc = getIconUrlFromResponseState(state);
    return makeWeatherBlock(state.cityName, state.temp, imgSrc, weatherProperties);
}

function makeMainWeatherBlock(cityName, tempVal, imgSrc, properties) {
    const mainBlock = mainCityBlockElem.cloneNode(true);
    setWeatherBlockContent(mainBlock, cityName, tempVal, imgSrc, properties);
    return mainBlock;
}

function makeLoaderBlock() {
    return wtrLoaderElem.cloneNode(true);
}

function makeLoaderCityBlock() {
    return makeLoaderBlock();
}

function makeLoaderMainBlock() {
    return wtrMainLoaderElem.cloneNode(true);
}

function setLoaderForMain() {
    const loaderBlock = makeLoaderMainBlock();
    updateMainWeatherBlock(loaderBlock);
    return loaderBlock;
}

function addSeveralWeatherBlocksInList(weatherBlocks) {
    if (weatherBlocks !== null) {
        for (let block of weatherBlocks) {
            addWeatherBlockInList(block);
        }
    }
}

function addWeatherBlockInList(weatherBlock) {
    const list = document.getElementById("wtr-blocks-cont");
    if (weatherBlock != null && !list.contains(weatherBlock)) {
        list.appendChild(weatherBlock);
    }
}

function clearWeatherBlockList() {
    const list = document.getElementById("wtr-blocks-cont");
    while (list.lastChild != null) {
        list.removeChild(list.lastChild);
    }
}

function removeWeatherBlockFromList(weatherBlock) {
    const list = document.getElementById("wtr-blocks-cont");
    if (list.contains(weatherBlock)) {
        list.removeChild(weatherBlock);
    }
}

function replaceWeatherBlockFromList(weatherBlock, newWeatherBlock) {
    const list = document.getElementById("wtr-blocks-cont");
    if (list.contains(weatherBlock) && newWeatherBlock != null) {
        list.replaceChild(newWeatherBlock, weatherBlock);
    }
}

function addMainWeatherBlock(weatherBlock) {
    const htmlHeader = document.getElementsByTagName("header")[0];
    htmlHeader.appendChild(weatherBlock);
}

function removeMainWeatherBlock(weatherBlock) {
    const htmlHeader = document.getElementsByTagName("header")[0];
    htmlHeader.removeChild(weatherBlock);
}

function updateMainWeatherBlock(weatherBlock) {
    const found = document.getElementsByClassName("wtr-main-block");
    const foundBlock = (found.length === 1 ? found[0] : null);
    if (foundBlock !== null) {
        removeMainWeatherBlock(foundBlock);
    }
    addMainWeatherBlock(weatherBlock);
}

function checkIfWeatherBlockIsAlreadyInList(weatherBlock) {
    const list = document.getElementById("wtr-blocks-cont");
    const cityNames = list.getElementsByClassName("wtr-city-name");
    const cityName = weatherBlock.getElementsByClassName("wtr-city-name")[0];
    for (let name of cityNames) {
        if (name.innerText === cityName.innerText) {
            return true;
        }
    }
    return false;
}