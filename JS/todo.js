import { Storage } from './storage.js';

export function initTodo() {
    const view = document.getElementById('todo-view');
    const form = view.querySelector('form');
    const input = view.querySelector('input');
    const list = view.querySelector('.item-list');

    let todos = Storage.get('todo', []);

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
        Storage.save('todo', todos);
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

        Storage.save('todo', todos);
        render();
    });

    render();
}