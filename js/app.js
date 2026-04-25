document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const cityError = document.getElementById('city-error');
    const unitSelect = document.getElementById('unit-select');
    const saveHistoryCheckbox = document.getElementById('save-history');
    const historyContainer = document.getElementById('history-container');
    const geoBtn = document.getElementById('geo-btn');

    
    const currentSection = document.getElementById('current-weather');
    const forecastSection = document.getElementById('forecast-section');

    
    renderHistory();


                          form.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        const city = cityInput.value.trim();
        const units = unitSelect.value;
        const saveToHistory = saveHistoryCheckbox.checked;

        
        const cityRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-]{3,}$/;
        
        if (!cityRegex.test(city)) {
            cityError.textContent = 'Wprowadź poprawną nazwę miasta (min. 3 litery).';
            cityInput.classList.add('invalid');
            return;
        }
        
        cityError.textContent = '';
        cityInput.classList.remove('invalid');

        await fetchAndDisplayWeather(city, units);

        if (saveToHistory) {
            StorageAPI.saveSearch(city);
            renderHistory();
        }
    });

    geoBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const units = unitSelect.value;
                
                try {
                    const data = await WeatherAPI.getWeatherByCoords(lat, lon, units);
                    
                    await fetchAndDisplayWeather(data.name, units);
                } catch (error) {
                    alert('Nie udało się pobrać pogody dla Twojej lokalizacji.');
                }
            }, () => {
                alert('Odmowa dostępu do lokalizacji.');
            });
        } else {
            alert('Twoja przeglądarka nie wspiera geolokalizacji.');
        }
    });

    
    unitSelect.addEventListener('change', () => {
        const currentCity = document.getElementById('city-name').textContent;
        if (currentCity !== 'Miasto' && !currentSection.classList.contains('hidden')) {
            fetchAndDisplayWeather(currentCity, unitSelect.value);
        }
    });

    
    historyContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('history-btn')) {
            const city = e.target.textContent;
            cityInput.value = city;
            fetchAndDisplayWeather(city, unitSelect.value);
        }
    });


                           async function fetchAndDisplayWeather(city, units) {
        try {
            
            const [currentData, forecastData] = await Promise.all([
                WeatherAPI.getWeatherByCity(city, units),
                WeatherAPI.getForecastByCity(city, units)
            ]);

            updateCurrentWeatherDOM(currentData, units);
            updateForecastDOM(forecastData, units);
            updateBackground(currentData.weather[0].main);

            currentSection.classList.remove('hidden');
            forecastSection.classList.remove('hidden');
        } catch (error) {
            alert(error.message);
            currentSection.classList.add('hidden');
            forecastSection.classList.add('hidden');
        }
    }

    function updateCurrentWeatherDOM(data, units) {
        document.getElementById('city-name').textContent = data.name;
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}${units === 'metric' ? '°C' : '°F'}`;
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('wind-speed').textContent = `${data.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}`;
        document.getElementById('humidity').textContent = data.main.humidity;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    }

    function updateForecastDOM(data, units) {
        const grid = document.getElementById('forecast-grid');
        grid.innerHTML = ''; 

        
        const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));

        dailyData.forEach(day => {
            const date = new Date(day.dt * 1000).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
            
            
            const card = document.createElement('div');
            card.classList.add('forecast-item');
            
            card.innerHTML = `
                <h3>${date}</h3>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon">
                <p><strong>${Math.round(day.main.temp)}${units === 'metric' ? '°C' : '°F'}</strong></p>
            `;
            grid.appendChild(card);
        });
    }

    function updateBackground(weatherMain) {
        const body = document.body;
        body.className = ''; // Reset
        const condition = weatherMain.toLowerCase();

        if (condition.includes('clear')) {
            body.classList.add('bg-sunny');
        } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) {
            body.classList.add('bg-rainy');
        } else {
            body.classList.add('bg-default');
        }
    }

    function renderHistory() {
        const history = StorageAPI.getHistory();
        historyContainer.innerHTML = '';
        history.forEach(city => {
            const btn = document.createElement('button');
            btn.classList.add('btn', 'history-btn');
            btn.type = 'button';
            btn.textContent = city;
            historyContainer.appendChild(btn);
        });
    }
});
