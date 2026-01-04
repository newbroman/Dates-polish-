/**
 * phonetics.js
 * Optimized for English speakers with CAPS for STRESSED syllables.
 */
const phonetics = {
    // Months in Genitive Case
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

    // NEW: Phonetics for the written day numbers (Genitive Case)
    // This fixes the "4" vs "chvar-TAY-goh" issue
    numbers: {
        1: "pyer-VSHAY-goh",
        2: "droo-GYAY-goh",
        3: "tshe-TSYAY-goh",
        4: "chvar-TAY-goh",
        5: "pyon-TAY-goh",
        6: "shoos-TAY-goh",
        7: "shood-MAY-goh",
        8: "oos-MAY-goh",
        9: "jay-vyon-TAY-goh",
        10: "jay-shon-TAY-goh",
        11: "yeh-den-ash-TAY-goh",
        12: "dvoo-nash-TAY-goh",
        // ... extend as needed for 1-31
        20: "dvoo-jay-STAY-goh",
        27: "dvoo-jay-STAY-goh shood-MAY-goh",
        30: "tshih-jay-STAY-goh"
    }
};

export default phonetics;
