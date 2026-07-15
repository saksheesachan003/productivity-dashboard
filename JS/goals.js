import { Storage } from './storage.js';

export function initGoals() {
    const view = document.getElementById('goals-view');
    const form = view.querySelector('form');
    const input = view.querySelector('input');
    const list = view.querySelector('.item-list');
    const progText = view.querySelector('.progress-text span');
    const progBar = view.querySelector('.progress-bar-inner');

    let goals = Storage.get('goals', []);

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
        Storage.save('goals', goals);
        input.value = '';
        render();
    });

    list.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const index = parseInt(e.target.getAttribute('data-index'));
            goals[index].completed = e.target.checked;
            Storage.save('goals', goals);
            render();
        }
    });

    list.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete');
        if (!btn) return;
        const index = parseInt(btn.getAttribute('data-index'));
        goals.splice(index, 1);
        Storage.save('goals', goals);
        render();
    });

    render();
}