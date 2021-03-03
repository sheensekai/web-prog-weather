document.addEventListener("DOMContentLoaded", function() {
    const buttonId = "update-main-btn";
    const button = document.getElementById(buttonId);
    button.onclick = () => navigator.geolocation.getCurrentPosition(currentPositionSuccess, currentPositionError, {
        enableHighAccuracy: true
    });
});

const cityNameTextField = document.getElementById("city-name-input");
document.addEventListener("keyup", function (event) {
    if (event.key === "Enter" && event.target.id === "city-name-input") {
        addCityButtonClick();
    }
});

navigator.geolocation.getCurrentPosition(currentPositionSuccess, currentPositionError, {
    enableHighAccuracy: true
});