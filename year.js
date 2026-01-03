/**
 * year.js
 * Converts years (0 - 3000) into grammatical Polish ordinals.
 */

const yearData = {
  // Thousands (nominative masculine)
  thousands: ["", "tysiąc", "dwa tysiące", "trzy tysiące"],
  
  // Hundreds (nominative masculine)
  hundreds: [
    "", "sto", "dwieście", "trzysta", "czterysta", "pięćset", 
    "sześćset", "siedemset", "osiemset", "dziewięćset"
  ],

  // Tens (needed for the "ninetieth" part)
  tens: [
    "", "dziesiąty", "dwudziesty", "trzydziesty", "czterdziesty", "pięćdziesiąty",
    "sześćdziesiąty", "siedemdziesiąty", "osiemdziesiąty", "dziewięćdziesiąty"
  ],

  // Units (ordinal form)
  units: [
    "", "pierwszy", "drugi", "trzeci", "czwarty", "piąty", 
    "szósty", "siódmy", "ósmy", "dziewiąty"
  ],

  // Special teens
  teens: [
    "dziesiąty", "jedenasty", "dwunasty", "trzynasty", "czternasty", 
    "piętnasty", "szesnasty", "siedemnasty", "osiemnasty", "dziewiętnasty"
  ],

  /**
   * Main function to get the Polish year string
   * Example: 2024 -> "dwa tysiące dwudziesty czwarty"
   */
  getYearInPolish(year) {
    if (year === 0) return "rok zerowy";
    
    let result = [];
    const t = Math.floor(year / 1000);
    const h = Math.floor((year % 1000) / 100);
    const ten = Math.floor((year % 100) / 10);
    const u = year % 10;

    // Thousands
    if (t > 0) result.push(this.thousands[t]);

    // Hundreds
    if (h > 0) result.push(this.hundreds[h]);

    // Last two digits (The Ordinal Part)
    if (ten === 1) {
      result.push(this.teens[u]);
    } else {
      if (ten > 0) result.push(this.tens[ten]);
      if (u > 0) result.push(this.units[u]);
    }

    return result.join(" ").trim();
  },

  /**
   * Phonetic transcription for English speakers
   */
  getYearPhonetic(year) {
    // Simplified mapping for the year 2024 example:
    // "dva ty-shon-tse dvoo-dye-sty chvar-ty"
    // In a full app, this would use a dictionary lookup or more complex logic.
    const polish = this.getYearInPolish(year);
    return polish
      .replace(/dwudziesty/g, "dvoo-DYE-sty")
      .replace(/czwarty/g, "CHVAR-ty")
      .replace(/tysiące/g, "ty-SHON-tse");
  }
};

export default yearData;
