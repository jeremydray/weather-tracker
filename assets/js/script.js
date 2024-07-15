const searchEl = document.querySelector("#searchBar");
const weatherEl = document.querySelector("#weather");
const submitFormEl = document.querySelector("#searchForm");
const today = dayjs()

function getCoordData(location) {
    const searchCoords = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=1410727907f1356e58d504895991c0a8`;


    fetch(searchCoords)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                const lon = data[i].lon
                const lat = data[i].lat
                getLocationData(lat, lon);
                getForecastData(lat, lon)
            }
        })
};

function getLocationData(lat, lon) {
    const searchLocation = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1410727907f1356e58d504895991c0a8&units=imperial`;

    fetch(searchLocation)
        .then(function (response) {
            return response.json();
        })
        .then(function (results) {
            console.log(results);
            currentResults(results)
        })

};

//Creation of the Search Results and 5-Day Forecast Cards
function currentResults(resultsObj) {

    let weatherData = {
        city: resultsObj.name,
        date: today.format('MM/DD/YYYY'),
        icon: `https://openweathermap.org/img/wn/${resultsObj.weather[0].icon}@2x.png`,
        temp: resultsObj.main.temp,
        wind: resultsObj.wind.speed,
        humidity: resultsObj.main.humidity
    }

    console.log(weatherData.city)
    const weatherSummary = document.createElement('div');
    weatherSummary.classList.add('container.xl', 'col-12', 'summary')
    weatherSummary.innerHTML = `<h2><strong>${weatherData.city} (${weatherData.date})</strong> <img src=${weatherData.icon} height="35"></img></h2><br/> <h4>Temp: ${weatherData.temp}</h4><br/><h4>Wind: ${weatherData.wind} MPH</h4><br/><h4>Humidity: ${weatherData.humidity}%</h4>`;
    const weatherHeaderObj = document.createElement('div');
    weatherHeaderObj.classList.add('container.xl', 'col-12', 'header-container', 'align-text-bottom');
    weatherHeaderObj.textContent = '5 Day Forecast:';

    weatherEl.append(weatherSummary, weatherHeaderObj)
}

function getForecastData(lat, lon) {
    const searchLocation = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=1410727907f1356e58d504895991c0a8&units=imperial`;

    fetch(searchLocation)
        .then(function (response) {
            return response.json();
        })
        .then(function (results) {
            console.log(results);
            forecastResults(results)
        })
}

// function forecastResults() {
//     const forecastBody = document.createElement('div');
//     forecastBody.classList.add('container.xl', 'col-12', 'row', 'justify-content-start', 'forecast');

//     for (let i = 0; i < 5; i++) {
//         const forecastCard = document.createElement('div');
//         forecastCard.classList.add('col');
//         const forecastDetail = document.createElement('div');
//         forecastDetail.classList.add('p-3', 'five-day-summary', `day${i}`);
//         forecastCard.append(forecastDetail)
//         forecastBody.append(forecastCard)
//     }
//     weatherEl.append(forecastBody)
// }

function searchFormSubmission(event) {
    event.preventDefault();
    weatherEl.innerHTML = "";
    const citySearch = document.querySelector('#citySubmission').value;
    console.log(citySearch);

    getCoordData(citySearch)
}


//Bootstrap Data Validation for Form Submission
(function () {
    'use strict'

    var forms = document.querySelectorAll('.needs-validation')

    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()


submitFormEl.addEventListener('submit', searchFormSubmission)
