// Storage keys
const KEYS = {
    TODO: 'prod_dashboard_todos',
    PLANNER: 'prod_dashboard_planner',
    GOALS: 'prod_dashboard_goals',
    THEME: 'prod_dashboard_theme'
};

export const Storage = {
    get(key, fallback) {
        const data = localStorage.getItem(KEYS[key.toUpperCase()]);
        return data ? JSON.parse(data) : fallback;
    },

    save(key, data) {
        localStorage.setItem(KEYS[key.toUpperCase()], JSON.stringify(data));
        // Emit a custom global event so other modules can react to state changes automatically
        window.dispatchEvent(new CustomEvent(`stateUpdate:${key.toLowerCase()}`, { detail: data }));
    }
};