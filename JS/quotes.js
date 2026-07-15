export function initQuotes() {
    const view = document.getElementById('motivation-view');
    const txt = view.querySelector('.quote-text');
    const auth = view.querySelector('.quote-author');
    const btn = view.querySelector('.fetch-quote-btn');
    const loader = view.querySelector('.quote-loading');

    const fallbacks = [
        { text: "Act as if what you do makes a difference. It does.", author: "William James" },
        { text: "Quality is not an act, it is a habit.", author: "Aristotle" }
    ];

    async function fetchNewQuote() {
        loader.classList.remove('hidden');
        txt.style.opacity = '0.3';
        
        try {
            // Using a reliable public API endpoint
            const res = await fetch('https://api.quotable.io/random');
            if (!res.ok) throw new Error("API issues");
            const data = await res.json();
            
            txt.textContent = `"${data.content}"`;
            auth.textContent = `— ${data.author}`;
        } catch (err) {
            // Graceful error fallback execution
            const randomPick = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            txt.textContent = `"${randomPick.text}"`;
            auth.textContent = `— ${randomPick.author}`;
        } finally {
            loader.classList.add('hidden');
            txt.style.opacity = '1';
        }
    }

    btn.addEventListener('click', fetchNewQuote);
    // Initial fetch on view loading
    fetchNewQuote();
}