export function initDateTime() {
    const timeDisplay = document.getElementById('live-time');
    const dateDisplay = document.getElementById('live-date');

    function ticker() {
        const now = new Date();
        
        // Custom clean string parameters
        timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        dateDisplay.textContent = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Call layout immediately to avoid a blank step flash on instantiation[cite: 1]
    ticker();
    setInterval(ticker, 1000);
}