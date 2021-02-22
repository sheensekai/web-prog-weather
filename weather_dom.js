function makeWeatherProperty(name, value) {
    const paramNameObj = document.createElement("span");
    paramNameObj.className = "feat-name";
    paramNameObj.innerText = name;

    const paramValueObj = document.createElement("span");
    paramNameObj.className = "feat-val";
    paramValueObj.innerText = value;

    const container = document.createElement("div");
    container.className = "feat-cont";
    container.appendChild(paramNameObj);
    container.appendChild(paramValueObj);
    return container;
}

function makeWeatherPropertyList(properties) {
    const propList = document.createElement("ul");
    for (let prop of properties) {
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
    img.className = "wtr-icon";
    img.setAttribute("alt", "Иконка погоды");
    img.setAttribute("src", imgSrc);

    const button = document.createElement("button");
    button.className = "wtr-cls-btn";
    button.innerText = "&times;"

    const header = document.createElement("div");
    header.className = "wtr-header";
    header.appendChild(city);
    header.appendChild(temp);
    header.appendChild(img);
    header.appendChild(button);
    return header;
}

function makeWeatherBlock(cityName, tempVal, imgSrc, properties) {
    const header = makeWeatherBlockHeader(cityName, tempVal, imgSrc);
    const propList = makeWeatherPropertyList(properties);

    const weatherBlock = document.createElement("div");
    weatherBlock.className = "wtr-block";
    weatherBlock.appendChild(header);
    weatherBlock.appendChild(propList);
    return weatherBlock;
}