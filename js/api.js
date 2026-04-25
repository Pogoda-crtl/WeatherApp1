const API_KEY = '9690e96730acb4865ed43fe11cf36eb5';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const WeatherAPI = {
    
    getWeatherByCity: async (city, unit = 'metric') => {
        try {
            const response = await fetch(`${BASE_URL}/weather?q=${city}&units=${unit}&appid=${API_KEY}&lang=pl`);
            if (!response.ok) throw new Error('Nie znaleziono miasta');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    getForecastByCity: async (city, unit = 'metric') => {
        try {
            const response = await fetch(`${BASE_URL}/forecast?q=${city}&units=${unit}&appid=${API_KEY}&lang=pl`);
            if (!response.ok) throw new Error('Błąd pobierania prognozy');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    getWeatherByCoords: async (lat, lon, unit = 'metric') => {
        try {
            const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}&lang=pl`);
            if (!response.ok) throw new Error('Błąd lokalizacji');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};
