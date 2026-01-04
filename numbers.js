/**
 * numbers.js
 * Handles the written-out ordinal numbers in the Genitive case.
 * Used for "The Whose Rule" in Polish dates.
 */
const writtenNumbersGen = {
    1: "pierwszego", 2: "drugiego", 3: "trzeciego", 4: "czwartego", 5: "piątego",
    6: "szóstego", 7: "siódmego", 8: "ósmego", 9: "dziewiątego", 10: "dziesiątego",
    11: "jedenastego", 12: "dwunastego", 13: "trzynastego", 14: "czternastego", 15: "piętnastego",
    16: "szesnastego", 17: "siedemnastego", 18: "osiemnastego", 19: "dziewiętnastego", 20: "dwudziestego",
    21: "dwudziestego pierwszego", 22: "dwudziestego drugiego", 23: "dwudziestego trzeciego", 
    24: "dwudziestego czwartego", 25: "dwudziestego piątego", 26: "dwudziestego szóstego",
    27: "dwudziestego siódmego", 28: "dwudziestego ósmego", 29: "dwudziestego dziewiątego",
    30: "trzydziestego", 31: "trzydziestego pierwszego"
};

export const getWrittenDay = (day) => writtenNumbersGen[day] || day;
