import holidayData from './holiday.js';
import culturalData from './cultural.js';
import yearData from './year.js';
import phonetics from './phonetics.js';
import { getWrittenDay } from './numbers.js'; // New Import

// ... existing state and renderCalendar logic ...

function updateUI() {
    const mIdx = selectedDate.getMonth();
    const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][selectedDate.getDay()];
    
    // Get the Polish day name (e.g., "Niedziela")
    const dayNamePl = culturalData.days[dayKey].split(' ')[0];
    
    // Get the Genitive month name (e.g., "stycznia")
    const rawMonth = culturalData.months[mIdx].pl;
    const monthGen = rawMonth.replace(/ń$/, 'nia').replace(/ec$/, 'ca').replace(/y$/, 'ego').toLowerCase();
    
    // Use the new numbers module to get the written day
    const dayNumWritten = getWrittenDay(selectedDate.getDate());
    const yearPl = yearData.getYearInPolish(selectedDate.getFullYear());

    // Update the phrase with written-out words
    const fullDatePl = `${dayNamePl}, ${dayNumWritten} ${monthGen}`;
    document.getElementById('plPhrase').innerText = repeatYear ? `${fullDatePl} ${yearPl}` : fullDatePl;

    // Update phonetics using your phonetics module
    const pDay = phonetics.days[dayNamePl.toLowerCase()] || "";
    const pMonth = phonetics.months[monthGen] || "";
    // Note: Ensure yearData.getYearPhonetic exists for 2026/2027 phonetics
    const pYear = yearData.getYearPhonetic ? yearData.getYearPhonetic(selectedDate.getFullYear()) : "";
    
    document.getElementById('phoneticPhrase').innerText = repeatYear ? 
        `${pDay}, ${pMonth} ${pYear}` : 
        `${pDay}, ${pMonth}`;
}
