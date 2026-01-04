/**
 * phonetics.js
 * Optimized for English speakers to find the Polish rhythm.
 * Bold CAPS = Stressed Syllable.
 */
const phonetics = {
    // Months in Genitive Case (e.g., "1st of May" = "1-go Maja")
    months: {
        "stycznia": "STITCH-nyah",
        "lutego": "loo-TEH-goh",
        "marca": "MAR-tsah",
        "kwietnia": "KVIET-nyah",
        "maja": "MAH-yah",
        "czerwca": "CHERV-tsah",
        "lipca": "LEEP-tsah",
        "sierpnia": "SYERP-nyah",
        "września": "VZHESH-nyah",
        "października": "pazh-dzier-NEE-kah",
        "listopada": "lee-stoh-PAH-dah",
        "grudnia": "GROOD-nyah"
    },
    
    // Days of the week
    days: {
        "poniedziałek": "poh-nyeh-DZIA-wek",
        "wtorek": "VTO-rek",
        "środa": "SHRO-dah",
        "czwartek": "CHVAR-tek",
        "piątek": "PION-tek",
        "sobota": "soh-BO-tah",
        "niedziela": "nyeh-DZIE-lah"
    },

    /**
     * Helper to get phonetic string for a full date
     * @param {string} dayPl - Polish day name
     * @param {number} date - Day number
     * @param {string} monthGenPl - Genitive month name
     */
    getFullPhonetic(dayPl, date, monthGenPl) {
        const d = this.days[dayPl.toLowerCase()] || dayPl;
        const m = this.months[monthGenPl.toLowerCase()] || monthGenPl;
        return `${d}, ${date} ${m}`;
    }
};

export default phonetics;
