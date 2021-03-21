let favCityBlockTmpl, mainCityBlockTmpl, wtrFeatTmpl;
let favCityBlockElem, mainCityBlockElem, wtrFeatElem;

function loadTemplates() {
    favCityBlockTmpl = document.getElementById("fav-city-block-tmpl");
    mainCityBlockTmpl = document.getElementById("main-city-block-tmpl");
    wtrFeatTmpl = document.getElementById("wtr-feat-tmpl");

    favCityBlockElem = favCityBlockTmpl.content.children[0];
    mainCityBlockElem = mainCityBlockTmpl.content.children[0];
    wtrFeatElem = wtrFeatTmpl.content.children[0];
}

function makeWeatherProperty(name, value) {
    const elem = wtrFeatElem.cloneNode(true);
    elem.getElementsByClassName("feat-name")[0].innerHTML = name;
    elem.getElementsByClassName("feat-val")[0].innerHTML = value;
    return elem;
}

function makeWeatherPropertyList(properties) {
    const propList = document.createElement("ul");
    propList.className = "feat-list";
    for (let i = 0; i < properties.length; ++i) {
        let prop = properties[i];
        let propElem = makeWeatherProperty(prop.name, prop.value);
        propList.appendChild(propElem);
    }
    return propList;
}

function makeWeatherBlockHeader(cityName, tempVal, imgSrc) {
    const city = document.createElement("h3");
    city.className = "wtr-city-name";
    city.innerText = cityName;

    const temp = document.createElement("span");
    temp.className = "wtr-temp";
    temp.innerText = tempVal + "°C";

    const img = document.createElement("img");
    img.setAttribute("alt", "Иконка погоды");
    img.setAttribute("src", imgSrc);
    img.className = "wtr-icon"

    const updateButton = document.createElement("button");
    updateButton.className = "wtr-upd-btn";
    const updateIcon = document.createElement("img")
    updateIcon.className = "block-icon";
    updateIcon.setAttribute("src", "img/update.png");
    updateIcon.setAttribute("alt", "Обновить");
    updateButton.appendChild(updateIcon);

    const closeButton = document.createElement("button");
    closeButton.className = "wtr-cls-btn";
    const closeIcon = document.createElement("img")
    closeIcon.className = "block-icon";
    closeIcon.setAttribute("src", "img/close.png");
    closeIcon.setAttribute("alt", "Зарыть");
    closeButton.appendChild(closeIcon);

    const propertiesCont = document.createElement("div");
    propertiesCont.className = "wtr-header";
    propertiesCont.appendChild(temp);
    propertiesCont.appendChild(img);
    propertiesCont.appendChild(updateButton);
    propertiesCont.appendChild(closeButton);

    const header = document.createElement("div");
    header.className = "wtr-header";
    header.appendChild(city);
    header.appendChild(propertiesCont);

    return header;
}

function makeWeatherBlock(cityName, tempVal, imgSrc, properties) {
    const header = makeWeatherBlockHeader(cityName, tempVal, imgSrc);
    const propList = makeWeatherPropertyList(properties);

    const weatherBlock = document.createElement("li");
    weatherBlock.className = "wtr-block";
    weatherBlock.appendChild(header);
    weatherBlock.appendChild(propList);

    const updateButton = header.getElementsByClassName("wtr-upd-btn")[0];
    updateButton.onclick = () => updateCityButtonClick(weatherBlock);

    const closeButton = header.getElementsByClassName("wtr-cls-btn")[0];
    closeButton.onclick = () => deleteCityButtonClick(weatherBlock);
    return weatherBlock;
}

function makeWeatherBlockFromState(state) {
    const weatherProperties = getRuPropertyListFromState(state);
    const imgSrc = getIconUrlFromResponseState(state);
    return makeWeatherBlock(state.cityName, state.temp, imgSrc, weatherProperties);
}

function makeMainWeatherBlockHeader(cityName, tempVal, imgSrc) {
    const city = document.createElement("h2");
    city.className = "wtr-city-name";
    city.innerText = cityName;

    const temp = document.createElement("span");
    temp.className = "wtr-temp";
    temp.innerText = tempVal + "°C";

    const img = document.createElement("img");
    img.className = "wtr-icon";
    img.setAttribute("alt", "Иконка погоды");
    img.setAttribute("src", imgSrc);

    const mainSubBlock = document.createElement("div");
    mainSubBlock.className = "main-block";
    mainSubBlock.appendChild(img);
    mainSubBlock.appendChild(temp);

    const header = document.createElement("div");
    header.id = "wtr-main";
    header.className = "wtr-block";
    header.appendChild(city);
    header.appendChild(mainSubBlock);
    return header;
}

function makeMainWeatherBlock(cityName, tempVal, imgSrc, properties) {
    const header = makeMainWeatherBlockHeader(cityName, tempVal, imgSrc);
    const propList = makeWeatherPropertyList(properties);
    propList.className = "wtr-block";

    const mainBlock = document.createElement("section");
    mainBlock.className = "wtr-list";
    mainBlock.id = "wtr-main-block";
    mainBlock.appendChild(header);
    mainBlock.appendChild(propList);
    return mainBlock;
}

function makeLoaderBlock() {
    const par = document.createElement("p");
    par.innerText = "Подождите, данные загружаются";

    const loader = document.createElement("div");
    loader.className = "loader";

    const loaderBlock = document.createElement("li");
    loaderBlock.className = "update-block wtr-block";
    loaderBlock.appendChild(par);
    loaderBlock.appendChild(loader);
    return loaderBlock;
}

function makeLoaderBaseBlock() {
    const firstBlock = makeLoaderBlock();
    const secondBlock = makeLoaderBlock();

    const mainBlock = document.createElement("div");
    mainBlock.appendChild(firstBlock);
    mainBlock.appendChild(secondBlock);
    return mainBlock;
}

function makeLoaderMainBlock() {
    const mainBlock = makeLoaderBaseBlock();
    mainBlock.className = "wtr-list";
    mainBlock.id = "wtr-main-block";
    return mainBlock;
}

function makeLoaderCityBlock() {
    return makeLoaderBlock();
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
    const foundBlock = document.getElementById("wtr-main-block");
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