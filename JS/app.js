/**
 * PRODUCTIVITY DASHBOARD - UNIFIED APPLICATION ARCHITECTURE
 * Core Technologies: Local Storage, Geolocation, DOM Injections, Timers[cite: 1]
 */

// ==========================================
// 1. DATA STORAGE STATE ENGINE[cite: 1]
// ==========================================
const STORAGE_KEYS = {
    TODO: 'prod_dashboard_todos',
    PLANNER: 'prod_dashboard_planner',
    GOALS: 'prod_dashboard_goals',
    THEME: 'prod_dashboard_theme'
};

const AppStorage = {
    get(key, fallback) {
        const data = localStorage.getItem(STORAGE_KEYS[key.toUpperCase()]);
        return data ? JSON.parse(data) : fallback;
    },
    save(key, data) {
        localStorage.setItem(STORAGE_KEYS[key.toUpperCase()], JSON.stringify(data));
    }
};

// ==========================================
// 2. INTERACTIVE SIDE PANEL ROUTER[cite: 1]
// ==========================================
function initNavigation() {
    const cards = document.querySelectorAll('.feature-card');
    const homeView = document.getElementById('dashboard-home');
    const featureViews = document.querySelectorAll('.feature-view');
    const backButtons = document.querySelectorAll('.back-btn');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                homeView.classList.add('hidden');
                targetView.classList.remove('hidden');
            }
        });
    });

    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            featureViews.forEach(view => view.classList.add('hidden'));
            homeView.classList.remove('hidden');
        });
    });
}

// ==========================================
// 3. TODO LIST CONTROLLER[cite: 1]
// ==========================================
function initTodo() {
    const view = document.getElementById('todo-view');
    const form = view.querySelector('form');
    const input = view.querySelector('input');
    const list = view.querySelector('.item-list');

    let todos = AppStorage.get('todo', []);

    function render() {
        list.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `list-item ${todo.important ? 'important' : ''} ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span class="item-text">${todo.text}</span>
                <div class="item-actions">
                    <button class="action-btn flag" data-index="${index}" title="Important">
                        <i class="${todo.important ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                    </button>
                    <button class="action-btn complete" data-index="${index}" title="Complete">
                        <i class="fa-solid ${todo.completed ? 'fa-rotate-left' : 'fa-check'}"></i>
                    </button>
                    <button class="action-btn delete" data-index="${index}" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            list.appendChild(li);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        todos.push({ text, completed: false, important: false });
        AppStorage.save('todo', todos);
        input.value = '';
        render();
    });

    list.addEventListener('click', (e) => {
        const button = e.target.closest('.action-btn');
        if (!button) return;
        const index = parseInt(button.getAttribute('data-index'));
        
        if (button.classList.contains('complete')) {
            todos[index].completed = !todos[index].completed;
        } else if (button.classList.contains('flag')) {
            todos[index].important = !todos[index].important;
        } else if (button.classList.contains('delete')) {
            todos.splice(index, 1);
        }
        AppStorage.save('todo', todos);
        render();
    });

    render();
}

// ==========================================
// 4. HOURLY DAILY PLANNER MATRIX[cite: 1]
// ==========================================
function initPlanner() {
    const view = document.getElementById('planner-view');
    const grid = view.querySelector('.planner-grid');
    let schedule = AppStorage.get('planner', {});

    function render() {
        grid.innerHTML = '';
        for (let hour = 9; hour <= 18; hour++) {
            const timeString = hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
            const value = schedule[timeString] || '';
            const currentHour = new Date().getHours();
            const isCurrent = hour === currentHour ? 'current-hour' : '';

            const row = document.createElement('div');
            row.className = `time-slot-row ${isCurrent}`;
            row.innerHTML = `
                <span class="time-label">${timeString}</span>
                <input type="text" data-time="${timeString}" value="${value}" placeholder="Empty slot - click to add plan...">
            `;
            grid.appendChild(row);
        }
    }

    grid.addEventListener('change', (e) => {
        if (e.target.tagName === 'INPUT') {
            const time = e.target.getAttribute('data-time');
            const val = e.target.value.trim();
            if (val === '') {
                delete schedule[time];
            } else {
                schedule[time] = val;
            }
            AppStorage.save('planner', schedule);
        }
    });

    render();
}

// ==========================================
// 5. DAILY HABIT & PROGRESS GOALS[cite: 1]
// ==========================================
function initGoals() {
    const view = document.getElementById('goals-view');
    const form = view.querySelector('form');
    const input = view.querySelector('input');
    const list = view.querySelector('.item-list');
    const progText = view.querySelector('.progress-text span');
    const progBar = view.querySelector('.progress-bar-inner');

    let goals = AppStorage.get('goals', []);

    function updateProgressBar() {
        const total = goals.length;
        const completed = goals.filter(g => g.completed).length;
        const percent = total > 0 ? (completed / total) * 100 : 0;
        progText.textContent = `${completed} of ${total} completed`;
        progBar.style.width = `${percent}%`;
    }

    function render() {
        list.innerHTML = '';
        goals.forEach((goal, index) => {
            const li = document.createElement('li');
            li.className = `list-item ${goal.completed ? 'checked-item' : ''}`;
            li.innerHTML = `
                <label class="checkbox-container">
                    <input type="checkbox" data-index="${index}" ${goal.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    ${goal.text}
                </label>
                <button class="action-btn delete" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
            `;
            list.appendChild(li);
        });
        updateProgressBar();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        goals.push({ text, completed: false });
        AppStorage.save('goals', goals);
        input.value = '';
        render();
    });

    list.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const index = parseInt(e.target.getAttribute('data-index'));
            goals[index].completed = e.target.checked;
            AppStorage.save('goals', goals);
            render();
        }
    });

    list.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete');
        if (!btn) return;
        const index = parseInt(btn.getAttribute('data-index'));
        goals.splice(index, 1);
        AppStorage.save('goals', goals);
        render();
    });

    render();
}

// ==========================================
// 6. POMODORO TICK ENGINE[cite: 1]
// ==========================================
function initPomodoro() {
    const view = document.getElementById('pomodoro-view');
    const display = view.querySelector('.timer-display');
    const startBtn = view.querySelector('.btn-control.start');
    const pauseBtn = view.querySelector('.btn-control.pause');
    const resetBtn = view.querySelector('.btn-control.reset');
    const statusLabel = view.querySelector('.timer-status');

    let timerInterval = null;
    let defaultTime = 25 * 60;
    let timeLeft = defaultTime;
    let isWorking = true;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    function updateDisplay() {
        display.textContent = formatTime(timeLeft);
    }

    function startTimer() {
        if (timerInterval) return;
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');

        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                alert(isWorking ? "Work session finished!" : "Break over!");
                isWorking = !isWorking;
                timeLeft = isWorking ? 25 * 60 : 5 * 60;
                statusLabel.textContent = isWorking ? "Work Session" : "Short Break";
                startBtn.classList.remove('hidden');
                pauseBtn.classList.add('hidden');
                updateDisplay();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }

    function resetTimer() {
        pauseTimer();
        isWorking = true;
        timeLeft = defaultTime;
        statusLabel.textContent = "Work Session";
        updateDisplay();
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    updateDisplay();
}

// ==========================================
// 7. MOTIVATION SOURCE API[cite: 1]
// ==========================================
function initQuotes() {
    const view = document.getElementById('motivation-view');
    const txt = view.querySelector('.quote-text');
    const auth = view.querySelector('.quote-author');
    const btn = view.querySelector('.fetch-quote-btn');
    const loader = view.querySelector('.quote-loading');

    const fallbacks = [
        { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
        { quote: "Quality is not an act, it is a habit.", author: "Aristotle" }
    ];

    async function fetchNewQuote() {
        loader.classList.remove('hidden');
        txt.style.opacity = '0.3';
        try {
            const res = await fetch('https://dummyjson.com/quotes/random');
            if (!res.ok) throw new Error();
            const data = await res.json();
            txt.textContent = `"${data.quote}"`;
            auth.textContent = `— ${data.author}`;
        } catch {
            const random = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            txt.textContent = `"${random.quote}"`;
            auth.textContent = `— ${random.author}`;
        } finally {
            loader.classList.add('hidden');
            txt.style.opacity = '1';
        }
    }

    btn.addEventListener('click', fetchNewQuote);
    fetchNewQuote();
}

// ==========================================
// 8. ASYNC WEATHER INTERFACE[cite: 1]
// ==========================================
function initWeather() {
    const tempEl = document.querySelector('.weather-temp');
    const condEl = document.querySelector('.weather-cond');
    const iconEl = document.querySelector('.weather-icon');

    const DEFAULT_CITY = 'New Delhi';
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

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => getWeatherData(pos.coords.latitude, pos.coords.longitude),
            () => getWeatherData(null, null, DEFAULT_CITY)
        );
    } else {
        getWeatherData(null, null, DEFAULT_CITY);
    }
}

// ==========================================
// 9. REALTIME DATE & TIME ENGINE[cite: 1]
// ==========================================
function initDateTime() {
    const timeDisplay = document.getElementById('live-time');
    const dateDisplay = document.getElementById('live-date');

    function ticker() {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        dateDisplay.textContent = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    ticker();
    setInterval(ticker, 1000);
}

// ==========================================
// 10. DYNAMIC GRADIENT BACKGROUNDS[cite: 1]
// ==========================================
function initBackground() {
    const bgWrapper = document.querySelector('.dashboard-bg-wrapper');

    function updateBackground() {
        const currentHour = new Date().getHours();
        bgWrapper.className = 'dashboard-bg-wrapper'; 

        if (currentHour >= 5 && currentHour < 12) {
            bgWrapper.classList.add('morning-bg');
        } else if (currentHour >= 12 && currentHour < 17) {
            bgWrapper.classList.add('afternoon-bg');
        } else if (currentHour >= 17 && currentHour < 21) {
            bgWrapper.classList.add('evening-bg');
        } else {
            bgWrapper.classList.add('night-bg');
        }
    }
    updateBackground();
    setInterval(updateBackground, 900000); // Re-calculate dynamic updates every 15 minutes[cite: 1]
}

// ==========================================
// 11. LIGHT / DARK STYLE SCHEME[cite: 1]
// ==========================================
function initThemeSwitch() {
    const btn = document.querySelector('.theme-toggle-btn');
    const body = document.body;
    
    let savedTheme = AppStorage.get('theme', 'light-theme');
    body.className = savedTheme;
    updateIcon(savedTheme);

    function updateIcon(current) {
        const icon = btn.querySelector('i');
        icon.className = current === 'dark-theme' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    btn.addEventListener('click', () => {
        let newTheme = body.classList.contains('light-theme') ? 'dark-theme' : 'light-theme';
        body.className = newTheme;
        AppStorage.save('theme', newTheme);
        updateIcon(newTheme);
    });
}

// ==========================================
// INITIALIZATION KERNEL ORCHESTRATION[cite: 1]
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeSwitch();
    initBackground();
    initDateTime();
    initTodo();
    initPlanner();
    initGoals();
    initPomodoro();
    initQuotes();
    initWeather();

    console.log("Productivity Dashboard initialized and fully functional.");
});