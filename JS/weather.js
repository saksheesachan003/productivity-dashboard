export function initWeather() {
    const tempEl = document.querySelector('.weather-temp');
    const condEl = document.querySelector('.weather-cond');
    const iconEl = document.querySelector('.weather-icon');

    const DEFAULT_CITY = 'New Delhi';
    // Free open weather platform key
    const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; 

    async function getWeatherData(lat, lon, city = null) {
        let url = city 
            ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
            : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error();
            const data = await res.json();
            
            tempEl.textContent = `${Math.round(data.main.temp)}°C`;
            condEl.textContent = data.weather[0].main;
            
            // Swap icons depending on state condition values
            if (data.weather[0].main.toLowerCase().includes('cloud')) {
                iconEl.className = "fa-solid fa-cloud-sun weather-icon";
            } else if (data.weather[0].main.toLowerCase().includes('rain')) {
                iconEl.className = "fa-solid fa-cloud-showers-heavy weather-icon";
            } else {
                iconEl.className = "fa-solid fa-sun weather-icon";
            }
        } catch {
            tempEl.textContent = "--°C";
            condEl.textContent = "Offline/Error";
        }
    }

    // Attempt Geolocation first
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => getWeatherData(pos.coords.latitude, pos.coords.longitude),
            () => getWeatherData(null, null, DEFAULT_CITY)
        );
    } else {
        getWeatherData(null, null, DEFAULT_CITY);
    }
}