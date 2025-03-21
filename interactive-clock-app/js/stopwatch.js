class Stopwatch {
    constructor() {
        this.display = document.querySelector('.stopwatch-display');
        this.startBtn = document.querySelector('.stopwatch-section .start-btn');
        this.stopBtn = document.querySelector('.stopwatch-section .stop-btn');
        this.resetBtn = document.querySelector('.stopwatch-section .reset-btn');
        this.lapList = document.querySelector('.lap-times');

        this.startTime = 0;
        this.elapsedTime = 0;
        this.intervalId = null;
        this.isRunning = false;
        this.laps = [];

        this.init();
    }

    init() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.intervalId = setInterval(() => this.update(), 10);
            this.startBtn.textContent = '计次';
            this.startBtn.removeEventListener('click', () => this.start());
            this.startBtn.addEventListener('click', () => this.lap());
        }
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.intervalId);
            this.startBtn.textContent = '开始';
            this.startBtn.removeEventListener('click', () => this.lap());
            this.startBtn.addEventListener('click', () => this.start());
        }
    }

    reset() {
        this.stop();
        this.elapsedTime = 0;
        this.laps = [];
        this.updateDisplay();
        this.updateLapList();
    }

    lap() {
        this.laps.push(this.elapsedTime);
        this.updateLapList();
    }

    update() {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
    }

    updateDisplay() {
        const time = new Date(this.elapsedTime);
        const minutes = String(time.getUTCMinutes()).padStart(2, '0');
        const seconds = String(time.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(Math.floor(time.getUTCMilliseconds() / 10)).padStart(2, '0');
        this.display.textContent = `${minutes}:${seconds}.${milliseconds}`;
    }

    updateLapList() {
        this.lapList.innerHTML = '';
        this.laps.forEach((lapTime, index) => {
            const li = document.createElement('li');
            const time = new Date(lapTime);
            const minutes = String(time.getUTCMinutes()).padStart(2, '0');
            const seconds = String(time.getUTCSeconds()).padStart(2, '0');
            const milliseconds = String(Math.floor(time.getUTCMilliseconds() / 10)).padStart(2, '0');
            li.textContent = `计次 ${index + 1}: ${minutes}:${seconds}.${milliseconds}`;
            this.lapList.appendChild(li);
        });
    }
} 