window.APP = window.APP || {};

window.APP.Timer = class {
    constructor(startDate) {
        try {
            // แปลงวันที่เริ่มต้นให้เป็น UTC
            this.startDate = new Date(startDate);
            if (isNaN(this.startDate.getTime())) {
                throw new Error('Invalid date format');
            }
            console.log('Start Date:', this.startDate.toISOString());
        } catch (error) {
            console.error('Error initializing timer:', error);
            this.startDate = new Date();
        }

        this.elements = {
            years: document.getElementById('years'),
            months: document.getElementById('months'),
            days: document.getElementById('days'),
            hours: document.getElementById('hours')
        };
    }

    calculateTimeDifference() {
        const now = new Date();
        console.log('Current Date:', now.toISOString());

        // คำนวณความแตกต่างของเวลาในมิลลิวินาที
        const diffTime = Math.abs(now - this.startDate);
        
        // คำนวณจำนวนวันทั้งหมด
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // คำนวณปี
        const years = Math.floor(diffDays / 365);
        
        // คำนวณเดือนที่เหลือ
        const remainingDays = diffDays % 365;
        const months = Math.floor(remainingDays / 30);
        
        // คำนวณวันที่เหลือ
        const days = remainingDays % 30;
        
        // คำนวณชั่วโมง
        const hours = now.getHours();

        console.log('Time Difference:', { years, months, days, hours });
        
        return {
            years: Math.max(0, years),
            months: Math.max(0, months),
            days: Math.max(0, days),
            hours: Math.max(0, hours)
        };
    }

    updateDisplay() {
        const time = this.calculateTimeDifference();
        
        try {
            Object.entries(this.elements).forEach(([key, element]) => {
                if (element) {
                    element.textContent = String(time[key]).padStart(2, '0');
                }
            });
        } catch (error) {
            console.error('Error updating display:', error);
        }
    }

    start() {
        this.updateDisplay();
        setInterval(() => this.updateDisplay(), 1000 * 60 * 60);
    }
};

// Initialize timer with specific date
document.addEventListener('DOMContentLoaded', () => {
    // กำหนดวันที่เริ่มต้นแบบ UTC
    const startDate = '2024-08-01T00:00:00Z'; // แก้ไขวันที่ตามที่ต้องการ
    try {
        const timer = new window.APP.Timer(startDate);
        timer.start();
    } catch (error) {
        console.error('Error starting timer:', error);
    }
});