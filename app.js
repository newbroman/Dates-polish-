import holidayData from './holiday.js';
import culturalData from './cultural.js';
import yearData from './year.js';
import phonetics from './phonetics.js';
import { getWrittenDay } from './numbers.js';

// --- State Management ---
let viewDate = new Date(); 
let selectedDate = new Date(); 
let interfaceLang = 'EN'; 
let repeatYear = false;

// --- DOM Elements ---
const body = document.body;
const grid = document.getElementById('calendarGrid');
const plPhraseEl = document.getElementById('plPhrase');
const phoneticPhraseEl = document.getElementById('phoneticPhrase');
const enPhraseEl = document.getElementById('enPhrase');
const culturalHub = document.getElementById('culturalHub');
const calendarSection = document.getElementById('calendarSection');
const infoPanel = document.querySelector('.info-panel');
const mRoller = document.getElementById('monthRoller');
const yRoller = document.getElementById('yearRoller');

/**
 * Renders the Monthly Calendar Grid and handles holiday highlighting.
 */
function renderCalendar() {
    grid.innerHTML = '';
    
    // Sync Rollers with current view
    mRoller.value = viewDate.getMonth();
    yRoller.value = viewDate.getFullYear();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Update Theme based on season
    body.className = culturalData.months[month].season;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const yearHolidays = holidayData.getHolidaysForYear(year);

    // Empty spacers for calendar alignment
    for (let i = 0; i < firstDayIndex; i++) {
        grid.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.innerText = day;

        const dateObj = new Date(year, month, day);
        const holidayKey = `${month}-${day}`;
        
        if (yearHolidays[holidayKey]) dayEl.classList.add('holiday');
        if (dateObj.toDateString() === selectedDate.toDateString()) dayEl.classList.add('selected');

        dayEl.onclick = () => {
            selectedDate = dateObj;
            updateUI();
            renderCalendar();
        };
        grid.appendChild(dayEl);
    }
    updateUI();
}

/**
 * Updates UI with Written Numbers and Phonetics
 */
function updateUI() {
    const mIdx = selectedDate.getMonth();
    const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][selectedDate.getDay()];
    const dayNamePl = culturalData.days[dayKey].split(' ')[0];
    
    // Apply Genitive Case (The Whose Rule)
    const rawMonth = culturalData.months[mIdx].pl; 
    const monthGen = rawMonth.replace(/ń$/, 'nia').replace(/ec$/, 'ca').replace(/y$/, 'ego').toLowerCase(); 
    
    // Convert numeral to written word (e.g., 4 -> czwartego)
    const dayNumWritten = getWrittenDay(selectedDate.getDate());
    const yearPl = yearData.getYearInPolish(selectedDate.getFullYear());

    // Polish phrase with written numerals
    const fullPlDate = `${dayNamePl}, ${dayNumWritten} ${monthGen}`;
    plPhraseEl.innerText = repeatYear ? `${fullPlDate} ${yearPl}` : fullPlDate;
    
    // English Phonetics (Penultimate Stress)
    const pDay = phonetics.days[dayNamePl.toLowerCase()] || "";
    const pMonth = phonetics.months[monthGen] || "";
    const pYear = yearData.getYearPhonetic ? yearData.getYearPhonetic(selectedDate.getFullYear()) : "";
    
    phoneticPhraseEl.innerText = repeatYear ? `${pDay}, ${pMonth} ${pYear}` : `${pDay}, ${pMonth}`;

    // Language Toggle for translated display
    enPhraseEl.innerText = selectedDate.toLocaleDateString(interfaceLang === 'EN' ? 'en-US' : 'pl-PL', { 
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
    });
}

// --- Navigation Logic (Fixes Culture Button) ---
document.getElementById('navCulture').onclick = () => {
    calendarSection.style.display = 'none';
    infoPanel.style.display = 'none';
    culturalHub.style.display = 'block';
    document.getElementById('navCulture').classList.add('active');
    document.getElementById('navCalendar').classList.remove('active');
    
    // Inject Grammar Guide
    culturalHub.innerHTML = `
        <div class="grammar-guide-card">
            <h3>${culturalData.grammarGuide.title}</h3>
            ${culturalData.grammarGuide.sections.map(s => `
                <div class="guide-section">
                    <h4>${s.heading}</h4>
                    <p>${s.content}</p>
                </div>
            `).join('')}
        </div>`;
};

document.getElementById('navCalendar').onclick = () => {
    calendarSection.style.display = 'block';
    infoPanel.style.display = 'block';
    culturalHub.style.display = 'none';
    document.getElementById('navCalendar').classList.add('active');
    document.getElementById('navCulture').classList.remove('active');
};

// --- Controller Logic ---
document.getElementById('langToggle').onclick = () => {
    interfaceLang = (interfaceLang === 'EN') ? 'PL' : 'EN';
    document.getElementById('langToggle').innerText = interfaceLang === 'EN' ? 'EN | PL' : 'PL | EN';
    updateUI();
};

document.getElementById('playBtn').onclick = () => {
    const utterance = new SpeechSynthesisUtterance(plPhraseEl.innerText);
    utterance.lang = 'pl-PL';
    window.speechSynthesis.speak(utterance);
};

document.getElementById('repeatYearBtn').onclick = () => {
    repeatYear = !repeatYear;
    document.getElementById('repeatYearBtn').innerText = `Repeat Year: ${repeatYear ? 'ON' : 'OFF'}`;
    updateUI();
};

// Roller Initialization
mRoller.onchange = (e) => { viewDate.setMonth(e.target.value); renderCalendar(); };
yRoller.onchange = (e) => { viewDate.setFullYear(e.target.value); renderCalendar(); };

window.onload = () => {
    // Populate rollers
    for (let i = 0; i < 12; i++) {
        mRoller.add(new Option(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2020, i)), i));
    }
    for (let i = 2024; i <= 2030; i++) {
        yRoller.add(new Option(i, i));
    }
    renderCalendar();
};
