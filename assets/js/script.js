const searchEl = document.querySelector("#searchBar");
const weatherEl = document.querySelector("#weather");
const submitFormEl = document.querySelector("#searchForm");
const savedSearchEl = document.querySelector('.previousSearches')
const previousSearchEl = document.querySelector('.previousSearches')
const clearSearchEl = document.querySelector('.clearData')
const citySearchEl = document.querySelector('#citySubmission')
const today = dayjs()



function pullStoredData() {
    let savedCity = JSON.parse(localStorage.getItem('citySearch'))

    if (!savedCity) {
        savedCity = [];
    }
    return savedCity;
}

function getCoordData(location) {
    const searchCoords = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=1410727907f1356e58d504895991c0a8`;


    fetch(searchCoords)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let i = 0; i < data.length; i++) {
                const lon = data[i].lon
                const lat = data[i].lat
                getLocationData(lat, lon);
                getForecastData(lat, lon);
            }
        })
};

function getLocationData(lat, lon) {
    const searchLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1410727907f1356e58d504895991c0a8&units=imperial`;

    fetch(searchLocation)
        .then(function (response) {
            return response.json();
        })
        .then(function (results) {
            console.log(results)
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

    const savedCity = JSON.parse(localStorage.getItem('citySearch'));
    previousSearchEl.innerHTML = ""
    localStorage.setItem('citySearch', JSON.stringify(savedCity))
    for (let i = 0; i < savedCity.length; i++) {
        const saveButtons = document.createElement('button')
        saveButtons.classList.add('button', 'savedCity', 'col-12', 'btn-warning')
        saveButtons.setAttribute('value', `${savedCity[i]}`)
        saveButtons.append(savedCity[i]);
        savedSearchEl.append(saveButtons)

    }
}


function getForecastData(lat, lon) {
    const searchLocation = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=1410727907f1356e58d504895991c0a8&units=imperial`;

    fetch(searchLocation)
        .then(function (response) {
            return response.json();
        })
        .then(function (results) {
            forecastResults(results)
        })
}

function forecastResults(results) {
    console.log(results)
    const forecastBody = document.createElement('div');
    forecastBody.classList.add('container.xl', 'col-12', 'row', 'justify-content-start', 'forecast');

    for (let i = 4; i < 44; i = i + 8) {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('col');
        const forecastDetail = document.createElement('div');
        forecastDetail.classList.add('p-3', 'five-day-summary', `day${i}`);

        let date = results.list[i].dt_txt.replace(" 18:00:00", '')
        const forecastDay = dayjs(date).format("MM/DD/YYYY");
        const forecastIcon = `https://openweathermap.org/img/wn/${results.list[i].weather[0].icon}@2x.png`;
        const forecastTemp = results.list[i].main.temp
        const forecastWind = results.list[i].wind.speed
        const forecastHumidity = results.list[i].main.humidity

        forecastDetail.innerHTML = `<h5>${forecastDay}</h5> <img src=${forecastIcon} height="35"></img><br/> <div>Temp: ${forecastTemp}</div><br/><div>Wind: ${forecastWind} MPH</div><br/><div>Humidity: ${forecastHumidity}%</div>`

        forecastCard.append(forecastDetail)
        forecastBody.append(forecastCard)
    }
    weatherEl.append(forecastBody)
}

function searchFormSubmission(event) {
    event.preventDefault();
    weatherEl.innerHTML = "";
    let citySearch = citySearchEl.value;
    let savedCity = pullStoredData()
    savedCity.push(citySearch);
    savedSearchEl.innerHTML = ""
    localStorage.setItem('citySearch', JSON.stringify(savedCity))

    getCoordData(citySearch)
}

function previousResultClick(event) {
    event.preventDefault();
    const previousSearch = event.target.getAttribute("value")
    weatherEl.innerHTML = ""
    getCoordData(previousSearch);
}

function clearData() {
    localStorage.clear();
    previousSearchEl.innerHTML = ""
    location.reload();
}



// Bootstrap Data Validation for Form Submission
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

previousSearchEl.addEventListener('click', previousResultClick)

clearSearchEl.addEventListener('click', clearData)