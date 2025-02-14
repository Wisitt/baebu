window.APP = window.APP || {};

window.APP.Timer = class {
    constructor(startDate) {
        this.startDate = new Date(startDate);
        this.elements = {
            years: document.getElementById('years'),
            months: document.getElementById('months'),
            days: document.getElementById('days'),
            hours: document.getElementById('hours')
        };
    }

    calculateTimeDifference() {
        const now = new Date();
        
        // คำนวณความแตกต่างของปี
        let years = now.getFullYear() - this.startDate.getFullYear();
        
        // คำนวณความแตกต่างของเดือน
        let months = now.getMonth() - this.startDate.getMonth();
        
        // ปรับค่าปีและเดือนถ้าเดือนติดลบ
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // คำนวณวัน
        let days = now.getDate() - this.startDate.getDate();
        if (days < 0) {
            months--;
            const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        // คำนวณชั่วโมง
        const hours = now.getHours();

        return { years, months, days, hours };
    }

    updateDisplay() {
        const time = this.calculateTimeDifference();
        
        // อัพเดตการแสดงผล
        if (this.elements.years) {
            this.elements.years.textContent = String(time.years).padStart(2, '0');
        }
        if (this.elements.months) {
            this.elements.months.textContent = String(time.months).padStart(2, '0');
        }
        if (this.elements.days) {
            this.elements.days.textContent = String(time.days).padStart(2, '0');
        }
        if (this.elements.hours) {
            this.elements.hours.textContent = String(time.hours).padStart(2, '0');
        }
    }

    start() {
        // อัพเดตทันทีเมื่อเริ่มต้น
        this.updateDisplay();
        
        // อัพเดตทุกชั่วโมง
        setInterval(() => {
            this.updateDisplay();
        }, 1000 * 60 * 60); // อัพเดตทุกชั่วโมง
    }
};

// Initialize timer
document.addEventListener('DOMContentLoaded', () => {
    const timer = new window.APP.Timer(window.APP.CONFIG.startDate);
    timer.start();
});