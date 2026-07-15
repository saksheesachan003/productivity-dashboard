import { initNavigation } from './navigation.js';
import { initTodo } from './todo.js';
import { initPlanner } from './planner.js';
import { initGoals } from './goals.js';
import { initPomodoro } from './pomodoro.js';
import { initQuotes } from './quotes.js';
import { initWeather } from './weather.js';
import { initDateTime } from './datetime.js';
import { initBackground } from './background.js';
import { initThemeSwitch } from './theme.js';

// DOM Content Execution Root Entry Point
document.addEventListener('DOMContentLoaded', () => {
    // Structural System Initializations
    initNavigation();
    initThemeSwitch();
    initBackground();
    initDateTime();
    
    // Core Functional Feature Modules
    initTodo();
    initPlanner();
    initGoals();
    initPomodoro();
    
    // API Integrated Interfaces
    initQuotes();
    initWeather();

    console.log("Productivity Dashboard initialized and fully functional.");
});