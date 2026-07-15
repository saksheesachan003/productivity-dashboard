import { Storage } from './storage.js';

export function initPlanner() {
    const view = document.getElementById('planner-view');
    const grid = view.querySelector('.planner-grid');
    
    // Generate empty day matrix if nothing exists
    let schedule = Storage.get('planner', {});

    function render() {
        grid.innerHTML = '';
        // Loop from 9 AM to 6 PM dynamically
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
            Storage.save('planner', schedule);
        }
    });

    render();
}