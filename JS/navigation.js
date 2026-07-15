export function initNavigation() {
    const cards = document.querySelectorAll('.feature-card');
    const homeView = document.getElementById('dashboard-home');
    const featureViews = document.querySelectorAll('.feature-view');
    const backButtons = document.querySelectorAll('.back-btn');

    // Open a feature view
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

    // Close feature view and return home
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            featureViews.forEach(view => view.classList.add('hidden'));
            homeView.classList.remove('hidden');
        });
    });
}