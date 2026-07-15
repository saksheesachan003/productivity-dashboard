import { Storage } from './storage.js';

export function initThemeSwitch() {
    const btn = document.querySelector('.theme-toggle-btn');
    const body = document.body;
    
    // Read previous choices first
    let savedTheme = Storage.get('theme', 'light-theme');
    body.className = savedTheme;
    updateIcon(savedTheme);

    function updateIcon(current) {
        const icon = btn.querySelector('i');
        if (current === 'dark-theme') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    btn.addEventListener('click', () => {
        let newTheme = body.classList.contains('light-theme') ? 'dark-theme' : 'light-theme';
        body.className = newTheme;
        Storage.save('theme', newTheme);
        updateIcon(newTheme);
    });
}