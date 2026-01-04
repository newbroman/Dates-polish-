import holidayData from './holiday.js';
import culturalData from './cultural.js';
import yearData from './year.js';
import phonetics from './phonetics.js';

// --- State Management ---
let viewDate = new Date(); 
let selectedDate = new Date(); 
let repeatYear = false;
let interfaceLang = 'EN'; // Tracks EN|PL Toggle state
let lastSpeechTime = 0;

// --- DOM Elements ---
const body = document.body;
const grid = document.getElementById('calendarGrid');
const monthDisplay = document.getElementById('currentMonthYearDisplay');
const plPhraseEl = document.getElementById('plPhrase');
const phoneticPhraseEl = document.getElementById('phoneticPhrase');
const enPhraseEl = document.getElementById('enPhrase');
const culturalNoteEl = document.getElementById('culturalNote');
const culturalHub = document.getElementById('culturalHub');
const calendarSection = document.getElementById('calendarSection');
const infoPanel = document.querySelector('.info-panel');
const langToggle = document.getElementById('langToggle');

/**
 * Renders the Monthly Calendar Grid
 */
function renderCalendar() {
    const dayNames = interfaceLang === 'EN' 
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : ['Nie', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];
    
    grid.innerHTML = '';
    dayNames.forEach(name => {
        const el = document.createElement('div');
        el.className = 'day-name';
        el.innerText = name;
        grid.appendChild(el);
    });

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Update Theme based on season
    const season = culturalData.months[month].season; 
    body.className = season;

    // Display Month Name
    const monthName = interfaceLang === 'EN' 
        ? new Intl.DateTimeFormat('en-US', { month: 'long' }).format(viewDate)
        : culturalData.months[month].pl;
    monthDisplay.innerText = `${monthName} ${year}`;

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
 * Updates UI with Polish Grammar (Genitive Case)
 */
function updateUI() {
    const monthIndex = selectedDate.getMonth();
    const dayIndex = selectedDate.getDay();
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = dayKeys[dayIndex];
    
    // Extract Polish day name
    const dayNamePl = culturalData.days[dayKey].split(' ')[0]; 
    
    // Apply Genitive Case logic (The "Whose" Rule)
    const rawMonth = culturalData.months[monthIndex].pl; 
    const monthNameGen = rawMonth.replace(/ń$/, 'nia').replace(/ec$/, 'ca').replace(/y$/, 'ego'); 
    
    const yearString = yearData.getYearInPolish(selectedDate.getFullYear());
    const fullPolishDate = `${dayNamePl}, ${selectedDate.getDate()} ${monthNameGen}`;
    
    plPhraseEl.innerText = repeatYear ? `${fullPolishDate} ${yearString}` : fullPolishDate;
    
    // Toggle English/Polish date format
    enPhraseEl.innerText = selectedDate.toLocaleDateString(interfaceLang === 'EN' ? 'en-US' : 'pl-PL', { 
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
    });

    // Phonetics
    const phoneticDay = phonetics.convertToPhonetic(dayNamePl);
    const phoneticMonth = phonetics.overrides[monthNameGen.toLowerCase()] || phonetics.convertToPhonetic(monthNameGen);
    phoneticPhraseEl.innerText = `${phoneticDay}, ${selectedDate.getDate()} ${phoneticMonth}`;

    // Holiday Check
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
 * Navigation & View Switching
 */
document.getElementById('navCalendar').onclick = () => {
    calendarSection.style.display = 'block';
    infoPanel.style.display = 'block';
    culturalHub.style.display = 'none';
    document.getElementById('navCalendar').classList.add('active');
    document.getElementById('navCulture').classList.remove('active');
};

document.getElementById('navCulture').onclick = () => {
    calendarSection.style.display = 'none';
    infoPanel.style.display = 'none';
    culturalHub.style.display = 'block';
    document.getElementById('navCulture').classList.add('active');
    document.getElementById('navCalendar').classList.remove('active');
    populateHub();
};

function populateHub() {
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
            <h3>Month Origins</h3>
            ${Object.values(culturalData.months).map(m => `
                <div class="cultural-item"><strong>${m.pl}</strong>: ${m.derivation}</div>
            `).join('')}
        </div>
    `;
}

// --- Interaction Events ---
langToggle.onclick = () => {
    interfaceLang = (interfaceLang === 'EN') ? 'PL' : 'EN';
    langToggle.innerText = (interfaceLang === 'EN') ? 'EN | PL' : 'PL | EN';
    renderCalendar();
};

document.getElementById('playBtn').onclick = () => {
    const now = Date.now();
    const isSlow = (now - lastSpeechTime < 2000);
    lastSpeechTime = now;
    const utterance = new SpeechSynthesisUtterance(plPhraseEl.innerText);
    utterance.lang = 'pl-PL';
    utterance.rate = isSlow ? 0.55 : 0.85;
    window.speechSynthesis.speak(utterance);
};

document.getElementById('prevMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); };
document.getElementById('repeatYearBtn').onclick = (e) => { 
    repeatYear = !repeatYear; 
    e.target.innerText = `Repeat Year: ${repeatYear ? 'ON' : 'OFF'}`; 
    updateUI(); 
};

window.onload = renderCalendar;
