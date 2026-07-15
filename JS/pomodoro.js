export function initPomodoro() {
    const view = document.getElementById('pomodoro-view');
    const display = view.querySelector('.timer-display');
    const startBtn = view.querySelector('.btn-control.start');
    const pauseBtn = view.querySelector('.btn-control.pause');
    const resetBtn = view.querySelector('.btn-control.reset');
    const statusLabel = view.querySelector('.timer-status');

    let timerInterval = null;
    let defaultTime = 25 * 60; // 25 mins in total seconds
    let timeLeft = defaultTime;
    let isWorking = true;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    function updateDisplay() {
        display.textContent = formatTime(timeLeft);
    }

    function startTimer() {
        if (timerInterval) return; // Prevent multiple instances Running

        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');

        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                alert(isWorking ? "Work block finished! Rest up." : "Break over! Time to focus.");
                
                // Toggle between Work & Break States
                isWorking = !isWorking;
                timeLeft = isWorking ? 25 * 60 : 5 * 60;
                statusLabel.textContent = isWorking ? "Work Session" : "Short Break";
                
                startBtn.classList.remove('hidden');
                pauseBtn.classList.add('hidden');
                updateDisplay();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }

    function resetTimer() {
        pauseTimer();
        isWorking = true;
        timeLeft = defaultTime;
        statusLabel.textContent = "Work Session";
        updateDisplay();
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    updateDisplay();
}