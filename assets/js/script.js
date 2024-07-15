const searchEl = document.querySelector("#searchBar")
const forecastEl = document.querySelector("#forecast");
const submitFormEl = document.querySelector("#searchForm")

// function getSearchParameters() {
//     const searchParamsArr = document.location.search.split('&');
//     console.log(searchParamsArr)
//     const searchedCity = searchParamsArr[0].split('=').pop();
//     console.log(searchedCity)
//     // getWeatherData(searchedCity)
// }

function getWeatherData(location) {
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
                getLocationData(lat, lon)
            }
        })
};

function getLocationData(lat, lon) {
    const searchLocation = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=1410727907f1356e58d504895991c0a8`;

    fetch(searchLocation)
        .then(function (response) {
            return response.json();
        })
        .then(function (results) {
            console.log(results);
            for (let i = 0; i < results.length; i++)
                forecastResults(results)
        })
};

//Creation of the Search Results and 5-Day Forecast Cards
function forecastResults(resultsObj) {
    console.log(resultsObj);

    const forecastSummary = document.createElement('div');
    forecastSummary.classList.add('container.xl', 'col-12', 'summary')
    const forecastHeaderObj = document.createElement('div');
    forecastHeaderObj.classList.add('container.xl', 'col-12', 'header-container', 'align-text-bottom');
    forecastHeaderObj.textContent = '5 Day Forecast:';

    const forecastBody = document.createElement('div');
    forecastBody.classList.add('container.xl', 'col-12', 'row', 'justify-content-start')

    // if (results.name)

    for (let i = 0; i < 5; i++) {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('col');
        const forecastDetail = document.createElement('div');
        forecastDetail.classList.add('p-3', 'five-day-summary', `day${i}`);
        forecastCard.append(forecastDetail)
        forecastBody.append(forecastCard)
    }

    forecastEl.append(forecastSummary, forecastHeaderObj)
    forecastEl.append(forecastBody)
}

function searchFormSubmission(event) {
    event.preventDefault();
    const citySearch = document.querySelector('#citySubmission').value;
    console.log(citySearch)

    getWeatherData(citySearch)
}


//Bootstrap Data Validation for Form Submission
// (function () {
//     'use strict'

//     var forms = document.querySelectorAll('.needs-validation')

//     Array.prototype.slice.call(forms)
//         .forEach(function (form) {
//             form.addEventListener('submit', function (event) {
//                 if (!form.checkValidity()) {
//                     event.preventDefault()
//                     event.stopPropagation()
//                 }

//                 form.classList.add('was-validated')
//             }, false)
//         })
// })()


submitFormEl.addEventListener('submit', searchFormSubmission)
