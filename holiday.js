/**
 * holiday.js
 * Handles fixed and moveable Polish holidays.
 */

const holidayData = {
  // Fixed holidays: [Month (0-indexed), Day]
  fixed: {
    "0-1":   { pl: "Nowy Rok", en: "New Year's Day" },
    "0-6":   { pl: "Święto Trzech Króli", en: "Epiphany" },
    "4-1":   { pl: "Święto Pracy", en: "Labor Day" },
    "4-3":   { pl: "Święto Konstytucji 3 Maja", en: "Constitution Day" },
    "7-15":  { pl: "Wniebowzięcie Najświętszej Maryi Panny", en: "Assumption Day" },
    "10-1":  { pl: "Wszystkich Świętych", en: "All Saints' Day" },
    "10-11": { pl: "Narodowe Święto Niepodległości", en: "Independence Day" },
    "11-25": { pl: "Boże Narodzenie (Pierwszy Dzień)", en: "Christmas Day" },
    "11-26": { pl: "Boże Narodzenie (Drugi Dzień)", en: "Boxing Day" }
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
   * Returns an array of all significant holidays for a given year.
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
    holidays[`${easterMonday.getMonth()}-${easterMonday.getDate()}`] = {
      pl: "Poniedziałek Wielkanocny",
      en: "Easter Monday"
    };

    // Corpus Christi (Boże Ciało) - 60 days after Easter
    const corpusChristi = new Date(easter);
    corpusChristi.setDate(easter.getDate() + 60);
    holidays[`${corpusChristi.getMonth()}-${corpusChristi.getDate()}`] = {
      pl: "Boże Ciało",
      en: "Corpus Christi"
    };

    return holidays;
  }
};

export default holidayData;
