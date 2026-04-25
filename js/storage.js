const STORAGE_KEY = 'weatherHistory';

const StorageAPI = {
    saveSearch: (city) => {
        try {
            let history = StorageAPI.getHistory();
            
            history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
            history.unshift(city); 
            
            if (history.length > 5) history.pop();
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            return history;
        } catch (error) {
            console.error('Błąd zapisu do localStorage:', error);
        }
    },

    getHistory: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Błąd odczytu z localStorage:', error);
            return [];
        }
    }
};
