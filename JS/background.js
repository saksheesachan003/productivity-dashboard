export function initBackground() {
    const bgWrapper = document.querySelector('.dashboard-bg-wrapper');

    function checkThemeWindow() {
        const currentHour = new Date().getHours();
        bgWrapper.className = 'dashboard-bg-wrapper'; // Clear pre-existing variables

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

    checkThemeWindow();
    // Check every 15 minutes to automatically transition backgrounds across day boundaries
    setInterval(checkThemeWindow, 900000);
}