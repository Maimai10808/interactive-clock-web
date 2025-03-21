class Clock {
    constructor() {
        this.timeElement = document.querySelector('.digital-clock .time');
        this.dateElement = document.querySelector('.digital-clock .date');
        this.hourHand = document.querySelector('.hour-hand');
        this.minuteHand = document.querySelector('.minute-hand');
        this.secondHand = document.querySelector('.second-hand');

        this.init();
    }

    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        
        // 更新数字时钟
        this.updateDigitalClock(now);
        
        // 更新模拟时钟
        this.updateAnalogClock(now);
    }

    updateDigitalClock(date) {
        // 更新时间
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        this.timeElement.textContent = `${hours}:${minutes}:${seconds}`;

        // 更新日期
        const options = { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        this.dateElement.textContent = date.toLocaleDateString('zh-CN', options);
    }

    updateAnalogClock(date) {
        const hours = date.getHours() % 12;
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        // 计算指针角度
        const secondsDegrees = (seconds / 60) * 360;
        const minutesDegrees = ((minutes + seconds / 60) / 60) * 360;
        const hoursDegrees = ((hours + minutes / 60) / 12) * 360;

        // 更新指针位置
        this.secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
        this.minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
        this.hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
    }
} 