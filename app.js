import holidayData from './holiday.js';
import culturalData from './cultural.js';
import yearData from './year.js';
import phonetics from './phonetics.js'; // Importing the separate file

let viewDate = new Date();
let selectedDate = new Date();
let interfaceLang = 'EN';
let repeatYear = false;

/**
 * Initialize Rollers for Month and Year
 */
function initRollers() {
    const mRoller = document.getElementById('monthRoller');
    const yRoller = document.getElementById('yearRoller');

    // Months
    for (let i = 0; i < 12; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = interfaceLang === 'EN' ? 
            new Intl.DateTimeFormat('en-US', {month:'long'}).format(new Date(2020, i)) : 
            culturalData.months[i].pl;
        mRoller.appendChild(opt);
    }

    // Years (2020 - 2035)
    for (let i = 2020; i <= 2035; i++) {
        const opt = document.createElement('option');
        opt.value = i; opt.innerText = i;
        yRoller.appendChild(opt);
    }

    mRoller.onchange = (e) => { viewDate.setMonth(e.target.value); renderCalendar(); };
    yRoller.onchange = (e) => { viewDate.setFullYear(e.target.value); renderCalendar(); };
}

/**
 * Render Calendar with Holiday logic restored
 */
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
    document.getElementById('monthRoller').value = viewDate.getMonth();
    document.getElementById('yearRoller').value = viewDate.getFullYear();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Apply Seasonal Theme
    document.body.className = culturalData.months[month].season;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const holidays = holidayData.getHolidaysForYear(year);

    // Empty slots
    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'));

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.innerText = day;

        // Holiday & Selection Highlighting
        if (holidays[`${month}-${day}`]) dayEl.classList.add('holiday');
        if (new Date(year, month, day).toDateString() === selectedDate.toDateString()) dayEl.classList.add('selected');

        dayEl.onclick = () => { 
            selectedDate = new Date(year, month, day); 
            updateUI(); 
            renderCalendar(); 
        };
        grid.appendChild(dayEl);
    }
    updateUI();
}

function updateUI() {
    const monthIndex = selectedDate.getMonth();
    const dayIndex = selectedDate.getDay();
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    // 1. Polish Grammar: Genitive Case Month
    const rawPlMonth = culturalData.months[monthIndex].pl;
    const monthGen = rawPlMonth.replace(/ń$/, 'nia').replace(/ec$/, 'ca').replace(/y$/, 'ego').toLowerCase();
    
    // 2. Polish Day Name
    const dayNamePl = culturalData.days[dayKeys[dayIndex]].split(' ')[0];
    
    // 3. Update Text with English-Friendly Phonetics from phonetics.js
    document.getElementById('plPhrase').innerText = `${dayNamePl}, ${selectedDate.getDate()} ${monthGen}`;
    
    const pMonth = phonetics.months[monthGen] || "Pronunciation missing";
    const pDay = phonetics.days[dayNamePl.toLowerCase()] || "";
    document.getElementById('phoneticPhrase').innerText = `${pDay}, ${selectedDate.getDate()} ${pMonth}`;

    // English Translation
    document.getElementById('enPhrase').innerText = selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
    });
}

// ... Navigation and Event Listeners (playBtn, repeatYearBtn, etc.) ...
window.onload = () => { initRollers(); renderCalendar(); };
