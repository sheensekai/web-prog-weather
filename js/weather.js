document.addEventListener("DOMContentLoaded", function () {
    const buttonId = "update-main-btn";
    const button = document.getElementById(buttonId);
    button.onclick = () => navigator.geolocation.getCurrentPosition(currentPositionSuccess, currentPositionError, {
        enableHighAccuracy: true
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const buttonId = "add-city-btn";
    const button = document.getElementById(buttonId);
    button.onclick = addCityButtonClick;
});

document.addEventListener("keyup", function (event) {
    if (event.key === "Enter" && event.target.id === "city-name-input") {
        addCityButtonClick();
    }
});

document.addEventListener("DOMContentLoaded", () => loadTemplates());
document.addEventListener("DOMContentLoaded", () => loadFavouriteCities());

// navigator.geolocation.getCurrentPosition(currentPositionSuccess, currentPositionError, {
//     enableHighAccuracy: true
// });

