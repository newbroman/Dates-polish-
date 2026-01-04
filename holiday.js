/**
 * holiday.js
 * Handles fixed and moveable Polish holidays.
 * Returns holiday names as strings to prevent [object Object] errors.
 */

const holidayData = {
    // Fixed holidays: [Month (0-indexed)-Day]
    fixed: {
        "0-1": "Nowy Rok",
        "0-6": "Święto Trzech Króli",
        "4-1": "Święto Pracy",
        "4-3": "Święto Konstytucji 3 Maja",
        "7-15": "Wniebowzięcie Najświętszej Maryi Panny",
        "10-1": "Wszystkich Świętych",
        "10-11": "Narodowe Święto Niepodległości",
        "11-25": "Boże Narodzenie (Pierwszy Dzień)",
        "11-26": "Boże Narodzenie (Drugi Dzień)"
    },

    /**
     * Calculates Easter Sunday for a given year.
     * Based on the Anonymous Gregorian Algorithm.
     */
    getEaster(year) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        
        return new Date(year, month - 1, day);
    },

    /**
     * Returns an object of all significant holidays for a given year.
     * Logic updated to return Polish names directly as strings.
     */
    getHolidaysForYear(year) {
        const holidays = {};

        // 1. Add Fixed Holidays
        Object.keys(this.fixed).forEach(key => {
            holidays[key] = this.fixed[key];
        });

        // 2. Calculate Moveable Holidays
        const easter = this.getEaster(year);
        
        // Easter Monday (Poniedziałek Wielkanocny) - 1 day after Easter
        const easterMonday = new Date(easter);
        easterMonday.setDate(easter.getDate() + 1);
        holidays[`${easterMonday.getMonth()}-${easterMonday.getDate()}`] = "Poniedziałek Wielkanocny";

        // Corpus Christi (Boże Ciało) - 60 days after Easter
        const corpusChristi = new Date(easter);
        corpusChristi.setDate(easter.getDate() + 60);
        holidays[`${corpusChristi.getMonth()}-${corpusChristi.getDate()}`] = "Boże Ciało";

        return holidays;
    }
};

export default holidayData;
