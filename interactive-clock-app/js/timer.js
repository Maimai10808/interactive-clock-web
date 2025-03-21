class Timer {
    constructor() {
        this.display = document.querySelector('.timer-display');
        this.hoursInput = document.querySelector('.timer-set .hours');
        this.minutesInput = document.querySelector('.timer-set .minutes');
        this.secondsInput = document.querySelector('.timer-set .seconds');
        this.startBtn = document.querySelector('.timer-start');
        this.stopBtn = document.querySelector('.timer-stop');
        this.resetBtn = document.querySelector('.timer-reset');

        this.remainingTime = 0;
        this.endTime = 0;
        this.intervalId = null;
        this.isRunning = false;

        this.init();
    }

    init() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.resetBtn.addEventListener('click', () => this.reset());

        // 输入限制
        [this.hoursInput, this.minutesInput, this.secondsInput].forEach(input => {
            input.addEventListener('input', () => {
                let value = parseInt(input.value) || 0;
                const max = parseInt(input.getAttribute('max'));
                if (value > max) value = max;
                if (value < 0) value = 0;
                input.value = value;
            });
        });
    }

    start() {
        if (!this.isRunning) {
            const hours = parseInt(this.hoursInput.value) || 0;
            const minutes = parseInt(this.minutesInput.value) || 0;
            const seconds = parseInt(this.secondsInput.value) || 0;

            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            if (totalSeconds === 0) return;

            this.isRunning = true;
            this.remainingTime = totalSeconds * 1000;
            this.endTime = Date.now() + this.remainingTime;

            this.update();
            this.intervalId = setInterval(() => this.update(), 1000);

            // 禁用输入
            this.toggleInputs(true);
        }
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.intervalId);
            this.remainingTime = this.endTime - Date.now();
        }
    }

    reset() {
        this.stop();
        this.remainingTime = 0;
        this.updateDisplay();
        this.toggleInputs(false);
        this.hoursInput.value = '';
        this.minutesInput.value = '';
        this.secondsInput.value = '';
    }

    update() {
        if (!this.isRunning) return;

        const now = Date.now();
        this.remainingTime = this.endTime - now;

        if (this.remainingTime <= 0) {
            this.finish();
            return;
        }

        this.updateDisplay();
    }

    updateDisplay() {
        const time = new Date(Math.max(0, this.remainingTime));
        const hours = String(Math.floor(this.remainingTime / 3600000)).padStart(2, '0');
        const minutes = String(time.getUTCMinutes()).padStart(2, '0');
        const seconds = String(time.getUTCSeconds()).padStart(2, '0');
        this.display.textContent = `${hours}:${minutes}:${seconds}`;
    }

    finish() {
        this.stop();
        this.remainingTime = 0;
        this.updateDisplay();
        this.toggleInputs(false);
        this.playAlarm();
    }

    toggleInputs(disabled) {
        this.hoursInput.disabled = disabled;
        this.minutesInput.disabled = disabled;
        this.secondsInput.disabled = disabled;
    }

    playAlarm() {
        // 创建音频上下文
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    }
} 