import holidayData from './holiday.js';
import culturalData from './cultural.js';
import yearData from './year.js';
import phonetics from './phonetics.js';

// --- State Management ---
let viewDate = new Date(); 
let selectedDate = new Date(); 
let interfaceLang = 'EN'; 
let repeatYear = false;
let lastSpeechTime = 0; // To track double-taps for slow-mo

// --- DOM Elements ---
const grid = document.getElementById('calendarGrid');
const monthDisplay = document.getElementById('currentMonthYearDisplay');
const plPhraseEl = document.getElementById('plPhrase');
const phoneticPhraseEl = document.getElementById('phoneticPhrase');
const enPhraseEl = document.getElementById('enPhrase');
const culturalNoteEl = document.getElementById('culturalNote');
const culturalHub = document.getElementById('culturalHub');

/**
 * Renders the Monthly Calendar Grid (Sunday Start)
 */
function renderCalendar() {
    const dayNames = grid.querySelectorAll('.day-name');
    grid.innerHTML = '';
    dayNames.forEach(dn => grid.appendChild(dn));

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Update Theme based on season
    updateSeasonalTheme(month);

    monthDisplay.innerText = `${culturalData.months[month].pl} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const yearHolidays = holidayData.getHolidaysForYear(year);

    for (let i = 0; i < firstDayIndex; i++) {
        grid.appendChild(Object.assign(document.createElement('div'), { className: 'calendar-day empty' }));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.innerText = day;

        const dateObj = new Date(year, month, day);
        if (yearHolidays[`${month}-${day}`]) dayEl.classList.add('holiday');
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
 * Updates UI and applies Polish Grammar rules
 */
function updateUI() {
    const monthIndex = selectedDate.getMonth();
    const dayIndex = selectedDate.getDay();
    const dayKey = Object.keys(culturalData.days)[dayIndex];
    
    // Grammar logic: Genitive endings for months
    const dayNamePl = culturalData.days[dayKey].split(' ')[0];
    const rawMonth = culturalData.months[monthIndex].pl;
    const monthNameGen = rawMonth.replace(/ń$/, 'nia').replace(/ec$/, 'ca').replace(/y$/, 'ego');
    
    const yearString = yearData.getYearInPolish(selectedDate.getFullYear());
    const fullPolishDate = `${dayNamePl}, ${selectedDate.getDate()} ${monthNameGen}`;
    
    plPhraseEl.innerText = repeatYear ? `${fullPolishDate} ${yearString}` : fullPolishDate;
    enPhraseEl.innerText = selectedDate.toLocaleDateString(interfaceLang === 'EN' ? 'en-US' : 'pl-PL', 
                           { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    // Phonetics
    const phoneticDay = phonetics.convertToPhonetic(dayNamePl);
    const phoneticMonth = phonetics.overrides[monthNameGen.toLowerCase()] || phonetics.convertToPhonetic(monthNameGen);
    phoneticPhraseEl.innerText = `${phoneticDay}, ${selectedDate.getDate()} ${phoneticMonth}`;

    // Holiday Display
    const holidayKey = `${monthIndex}-${selectedDate.getDate()}`;
    const yearHolidays = holidayData.getHolidaysForYear(selectedDate.getFullYear());
    if (yearHolidays[holidayKey]) {
        culturalNoteEl.innerText = culturalData.holidayDescriptions[holidayKey] || "Święto";
        culturalNoteEl.style.display = "block";
    } else {
        culturalNoteEl.style.display = "none";
    }
}

/**
 * Dynamic Seasonal Theme Switcher
 */
function updateSeasonalTheme(month) {
    const season = culturalData.months[month].season;
    document.body.className = season; // Applies 'winter', 'spring', etc. to body
}

/**
 * TTS with Double-Tap Slow Motion
 */
function speak() {
    const now = Date.now();
    const isDoubleTap = (now - lastSpeechTime < 2000); // 2 second window
    lastSpeechTime = now;

    const utterance = new SpeechSynthesisUtterance(plPhraseEl.innerText);
    utterance.lang = 'pl-PL';
    utterance.rate = isDoubleTap ? 0.55 : 0.85; // Slower if tapped twice
    window.speechSynthesis.speak(utterance);
}

/**
 * Populates the Cultural Hub with Guide and Etymology
 */
function populateCulturalHub() {
    culturalHub.innerHTML = `
        <div class="grammar-guide-card">
            <h3>${culturalData.grammarGuide.title}</h3>
            ${culturalData.grammarGuide.sections.map(s => `
                <div class="guide-section">
                    <h4>${s.heading}</h4>
                    <p>${s.content}</p>
                </div>
            `).join('')}
        </div>
        <div class="cultural-list">
            <h3>Months / Miesiące</h3>
            ${Object.values(culturalData.months).map(m => `
                <div class="cultural-item"><strong>${m.pl}</strong>: ${m.derivation}</div>
            `).join('')}
        </div>
    `;
}

// --- Navigation & Events ---
document.getElementById('playBtn').onclick = speak;
document.getElementById('prevMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); };
document.getElementById('repeatYearBtn').onclick = (e) => { repeatYear = !repeatYear; e.target.innerText = `Repeat Year: ${repeatYear ? 'ON' : 'OFF'}`; updateUI(); };

document.getElementById('navCalendar').onclick = () => {
    document.getElementById('calendarSection').style.display = 'block';
    document.querySelector('.info-panel').style.display = 'block';
    culturalHub.style.display = 'none';
};

document.getElementById('navCulture').onclick = () => {
    document.getElementById('calendarSection').style.display = 'none';
    document.querySelector('.info-panel').style.display = 'none';
    culturalHub.style.display = 'block';
    populateCulturalHub();
};

// Initialize
window.onload = renderCalendar;
