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
