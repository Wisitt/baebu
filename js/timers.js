window.APP = window.APP || {};

window.APP.Timer = class {
    constructor(startDate) {
        // แปลง startDate ให้อยู่ในรูปแบบที่ถูกต้อง
        try {
            this.startDate = new Date(startDate);
            // ตรวจสอบว่าวันที่ถูกต้อง
            if (isNaN(this.startDate.getTime())) {
                throw new Error('Invalid date format');
            }
        } catch (error) {
            console.error('Error initializing timer:', error);
            // ถ้าไม่สามารถแปลงวันที่ได้ ให้ใช้วันที่ปัจจุบัน
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
        let years = 0;
        let months = 0;
        let days = 0;
        let hours = 0;

        try {
            // คำนวณความแตกต่างของปี
            years = now.getFullYear() - this.startDate.getFullYear();
            
            // คำนวณความแตกต่างของเดือน
            months = now.getMonth() - this.startDate.getMonth();
            
            // ปรับค่าปีและเดือนถ้าเดือนติดลบ
            if (months < 0) {
                years--;
                months += 12;
            }
            
            // คำนวณวัน
            days = now.getDate() - this.startDate.getDate();
            if (days < 0) {
                months--;
                if (months < 0) {
                    years--;
                    months += 12;
                }
                const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += lastMonth.getDate();
            }
            
            // คำนวณชั่วโมง
            hours = now.getHours();
            
            // ตรวจสอบค่าติดลบ
            years = Math.max(0, years);
            months = Math.max(0, months);
            days = Math.max(0, days);
            hours = Math.max(0, hours);

        } catch (error) {
            console.error('Error calculating time difference:', error);
        }

        return { years, months, days, hours };
    }

    updateDisplay() {
        const time = this.calculateTimeDifference();
        
        try {
            // อัพเดตการแสดงผล
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
    // ตรวจสอบว่า CONFIG มีอยู่และมี startDate
    if (window.APP.CONFIG && window.APP.CONFIG.startDate) {
        try {
            const timer = new window.APP.Timer(window.APP.CONFIG.startDate);
            timer.start();
        } catch (error) {
            console.error('Error starting timer:', error);
        }
    } else {
        console.error('Timer configuration is missing');
    }
});