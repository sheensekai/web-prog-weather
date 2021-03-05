function makeWeatherProperty(name, value) {
    const paramNameObj = document.createElement("span");
    paramNameObj.className = "feat-name";
    paramNameObj.innerText = name;

    const paramValueObj = document.createElement("span");
    paramValueObj.className = "feat-val";
    paramValueObj.innerText = value;

    const container = document.createElement("div");
    container.className = "feat-cont";
    container.appendChild(paramNameObj);
    container.appendChild(paramValueObj);
    return container;
}

function makeWeatherPropertyList(properties) {
    const propList = document.createElement("ul");
    propList.className = "feat-list";
    for (let i = 0; i < properties.length; ++i) {
        let prop = properties[i];
        let propElem = makeWeatherProperty(prop.name, prop.value);
        let li = document.createElement("li");
        li.appendChild(propElem);
        propList.appendChild(li);
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
    updateButton.innerText = "Обновить";

    const closeButton = document.createElement("button");
    closeButton.className = "wtr-cls-btn";
    closeButton.innerText = "×";

    const propertiesCont = document.createElement("ul");
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

    const weatherBlock = document.createElement("section");
    weatherBlock.className = "wtr-block";
    weatherBlock.appendChild(header);
    weatherBlock.appendChild(propList);

    const updateButton = header.getElementsByClassName("wtr-upd-btn")[0];
    updateButton.onclick = () => updateCityButtonClick(weatherBlock);

    const closeButton = header.getElementsByClassName("wtr-cls-btn")[0];
    closeButton.onclick = () => removeWeatherBlockFromList(weatherBlock);
    return weatherBlock;
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
    const listContainer = document.createElement("div");
    listContainer.className = "wtr-block";
    listContainer.appendChild(propList);

    const mainBlock = document.createElement("section");
    mainBlock.className = "wtr-list";
    mainBlock.id = "wtr-main-block";
    mainBlock.appendChild(header);
    mainBlock.appendChild(listContainer);
    return mainBlock;
}

function makeLoaderBlock() {
    const par = document.createElement("p");
    par.innerText = "Подождите, данные загружаются";

    const loader = document.createElement("div");
    loader.className = "loader";

    const loaderBlock = document.createElement("div");
    loaderBlock.className = "wtr-block update-block";
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
}

function addWeatherBlockInList(weatherBlock) {
    const list = document.getElementById("wtr-blocks-cont");
    if (weatherBlock != null && !list.contains(weatherBlock)) {
        const li = document.createElement("li");
        li.appendChild(weatherBlock)
        list.appendChild(li);
    }
}

function removeWeatherBlockFromList(weatherBlock) {
    const list = document.getElementById("wtr-blocks-cont");
    if (list.contains(weatherBlock)) {
        list.removeChild(weatherBlock.parentElement);
    }
}

function replaceWeatherBlockFromList(weatherBlock, newWeatherBlock) {
    const list = document.getElementById("wtr-blocks-cont");
    if (list.contains(weatherBlock) && newWeatherBlock != null) {
        weatherBlock.parentElement.replaceChild(newWeatherBlock, weatherBlock);
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