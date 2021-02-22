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
    img.className = "wtr-icon";
    img.setAttribute("alt", "Иконка погоды");
    img.setAttribute("src", imgSrc);

    const button = document.createElement("button");
    button.className = "wtr-cls-btn";
    button.innerText = "×";

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

    const button = header.getElementsByTagName("button")[0];
    button.onclick = function() {
        const parent = weatherBlock.parentElement;
        if (parent != null) {
            parent.removeChild(weatherBlock);
        }
    }

    return weatherBlock;
}

function addWeatherBlockInList(weatherBlock) {
    const list = document.getElementById("wtr-blocks-cont");
    list.appendChild(weatherBlock);
}

function removeWeatherBlockFromList(weatherBlock) {
    const list = document.getElementById("wtr-blocks-cont");
    list.removeChild(weatherBlock);
}