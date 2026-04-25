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
