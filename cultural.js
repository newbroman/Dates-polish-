const culturalData = {
    // Month data with etymology and seasons
    months: {
        0: { pl: "Styczeń", derivation: "From 'stykać' (to meet), as the old year meets the new.", season: "winter" },
        1: { pl: "Luty", derivation: "Old Polish for 'fierce' or 'bitter frost'.", season: "winter" },
        2: { pl: "Marzec", derivation: "Likely from Roman God Mars, or 'marznąć' (to freeze).", season: "spring" },
        3: { pl: "Kwiecień", derivation: "From 'kwiat' (flower); the month of blooming.", season: "spring" },
        4: { pl: "Maj", derivation: "The only month named after a Roman goddess (Maia).", season: "spring" },
        5: { pl: "Czerwiec", derivation: "From 'czerw' (larva), used to make red dye.", season: "summer" },
        6: { pl: "Lipiec", derivation: "From 'lipa' (linden tree), which blooms in July.", season: "summer" },
        7: { pl: "Sierpień", derivation: "From 'sierp' (sickle), the tool for harvest.", season: "summer" },
        8: { pl: "Wrzesień", derivation: "From 'wrzos' (heather), which flowers now.", season: "autumn" },
        9: { pl: "Październik", derivation: "From 'paździerz' (flax waste) from making cloth.", season: "autumn" },
        10: { pl: "Listopad", derivation: "A poetic name: 'liście' (leaves) + 'padać' (to fall).", season: "autumn" },
        11: { pl: "Grudzień", derivation: "From 'gruda' (frozen clod of earth).", season: "winter" }
    },

    // Days with religious/numerical origins
    days: {
        monday: "Poniedziałek (Day after Sunday)",
        tuesday: "Wtorek (The second day)",
        wednesday: "Środa (The middle day)",
        thursday: "Czwartek (The fourth day)",
        friday: "Piątek (The fifth day)",
        saturday: "Sobota (From the Sabbath)",
        sunday: "Niedziela (No-work day)"
    },

    // Holiday Explanations
    holidayExplanations: {
        "1-1": "New Year's Day: A fresh start with family celebrations.",
        "1-6": "Three Kings Day: Religious processions through city streets.",
        "5-1": "Labour Day: Often a day for rallies or spring picnics.",
        "5-3": "Constitution Day: Celebrating Europe's first modern constitution (1791).",
        "8-15": "Armed Forces Day & Assumption of Mary: Military parades and church services.",
        "11-1": "All Saints' Day: Cemeteries glow with thousands of candles left for loved ones.",
        "11-11": "Independence Day: Patriotic marches celebrating the rebirth of Poland in 1918.",
        "12-25": "Christmas Day: Quiet family time following the Christmas Eve Vigil (Wigilia)."
    },

    grammarGuide: {
        title: "The Grammar of Dates",
        sections: [
            { heading: "The Whose Rule (Genitive)", content: "In Polish dates, we use the Genitive case. Instead of 'January', we say 'of January' (stycznia)." }
        ]
    }
};
export default culturalData;
