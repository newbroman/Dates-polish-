/**
 * cultural.js
 * Data for month etymology, holiday significance, grammar basics, and Name Days.
 */

const culturalData = {
  grammarGuide: {
    title: "Quick Start: Polish Date Grammar",
    sections: [
      {
        heading: "1. The 'Whose' Rule (Genitive Case)",
        content: "In English, we say 'January first.' In Polish, we say 'The first OF January.' This is why month names change: Styczeń becomes Stycznia."
      },
      {
        heading: "2. Ordinal Years",
        content: "Polish years are spoken as 'orders' (e.g., 2026 is the 'two thousandth twenty-sixth' year). The app handles this complex conversion for you."
      },
      {
        heading: "3. The Rhythm of Speech",
        content: "Polish words are almost always stressed on the second-to-last syllable. The phonetics in this app use BOLD CAPS to help you find that rhythm."
      }
    ]
  },

  months: {
    0: { pl: "Styczeń", derivation: "From 'stykać' (to join), as the old year meets the new year.", season: "winter" },
    1: { pl: "Luty", derivation: "From 'luty' (fierce/bitter), describing the harsh winter.", season: "winter" },
    2: { pl: "Marzec", derivation: "Named for the Roman God Mars, but linked to 'marznąć' (to freeze).", season: "spring" },
    3: { pl: "Kwiecień", derivation: "From 'kwiaty' (flowers), as the first blooms appear.", season: "spring" },
    4: { pl: "Maj", derivation: "A Latin-derived name, traditionally a time for outdoor festivals.", season: "spring" },
    5: { pl: "Czerwiec", derivation: "From 'czerwie' (larvae), used historically for red dye.", season: "summer" },
    6: { pl: "Lipiec", derivation: "From 'lipa' (linden tree), which blossoms in mid-summer.", season: "summer" },
    7: { pl: "Sierpień", derivation: "From 'sierp' (sickle), the tool for the summer harvest.", season: "summer" },
    8: { pl: "Wrzesień", derivation: "From 'wrzos' (heather), the flower of early autumn.", season: "autumn" },
    9: { pl: "Październik", derivation: "From 'paździerze' (flax waste) from textile processing.", season: "autumn" },
    10: { pl: "Listopad", derivation: "From 'liście' (leaves) and 'padać' (to fall).", season: "autumn" },
    11: { pl: "Grudzień", derivation: "From 'gruda' (frozen clump of earth) in the winter ground.", season: "winter" }
  },

  days: {
    sunday: "Niedziela (From 'nie działać' - 'to not work').",
    monday: "Poniedziałek (The day after 'Niedziela').",
    tuesday: "Wtorek (From 'wtóry' - the second day).",
    wednesday: "Środa (The middle of the week).",
    thursday: "Czwartek (The fourth day).",
    friday: "Piątek (The fifth day).",
    saturday: "Sobota (Derived from Sabbath)."
  },

  holidayDescriptions: {
    "11-11": "Independence Day: Celebrates the return of sovereignty in 1918.",
    "4-3": "Constitution Day: Commemorates the historic Constitution of 1791.",
    "0-6": "Epiphany (Trzech Króli): Chalking 'K+M+B' on doors to bless the home.",
    "Easter Monday": "Śmigus-dyngus: A tradition of throwing water for luck.",
    "Corpus Christi": "Boże Ciało: Religious processions through town streets."
  },


};

export default culturalData;
