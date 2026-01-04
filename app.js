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
const grid = document.getElementById('calendarGrid');
const plPhraseEl = document.getElementById('plPhrase');
const phoneticPhraseEl = document.getElementById('phoneticPhrase');
const enPhraseEl = document.getElementById('enPhrase');
const culturalHub = document.getElementById('culturalHub');
const calendarSection = document.getElementById('calendarSection');
const infoPanel = document.querySelector('.info-panel');
const monthRoller = document.getElementById('monthRoller');
const yearRoller = document.getElementById('yearRoller');
const playBtn = document.getElementById('playBtn');
const repeatBtn = document.getElementById('repeatYearBtn');
const langToggle = document.getElementById('langToggle');

/**
 * Renders the Calendar Grid and handles high-level UI states
 */
function renderCalendar() {
    grid.innerHTML = '';
    
    // Sync Rollers
    monthRoller.value = viewDate.getMonth();
    yearRoller.value = viewDate.getFullYear();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Seasonal Theme
    document.body.className = culturalData.months[month].season;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const yearHolidays = holidayData.getHolidaysForYear(year);

    // Empty spacers
    for (let i = 0; i < firstDayIndex; i++) {
        grid.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.innerText = day;

        const holidayKey = `${month}-${day}`;
        if (yearHolidays[holidayKey]) dayEl.classList.add('holiday');
        if (new Date(year, month, day).toDateString() === selectedDate.toDateString()) {
            dayEl.classList.add('selected');
        }

        dayEl.onclick = () => {
            selectedDate = new Date(year, month, day);
            updateUI();
            renderCalendar();
        };
        grid.appendChild(dayEl);
    }
    updateUI();
}

/**
 * Updates UI text, translations, and full date phonetics
 */
function updateUI() {
    const mIdx = selectedDate.getMonth();
    const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][selectedDate.getDay()];
    const dayNamePl = culturalData.days[dayKey].split(' ')[0];
    
    // 1. Polish Date String (Written Numbers + Genitive Month)
    const monthGen = culturalData.months[mIdx].pl.replace(/ń$/, 'nia').replace(/ec$/, 'ca').replace(/y$/, 'ego').toLowerCase();
    const dayNumWritten = getWrittenDay(selectedDate.getDate());
    const yearPl = yearData.getYearInPolish(selectedDate.getFullYear());
    
    const fullPlDate = `${dayNamePl}, ${dayNumWritten} ${monthGen}`;
    plPhraseEl.innerText = repeatYear ? `${fullPlDate} ${yearPl}` : fullPlDate;

    // 2. Full Phonetics (Day + Month + Year)
    const pDay = phonetics.days[dayNamePl.toLowerCase()] || "";
    const pMonth = phonetics.months[monthGen] || "";
    const pYear = yearData.getYearPhonetic ? yearData.getYearPhonetic(selectedDate.getFullYear()) : "";
    
    phoneticPhraseEl.innerText = repeatYear 
        ? `${pDay}, ${selectedDate.getDate()} ${pMonth} ${pYear}` 
        : `${pDay}, ${selectedDate.getDate()} ${pMonth}`;

    // 3. Language Toggle Logic (UI Labels & Buttons)
    if (interfaceLang === 'PL') {
        playBtn.innerText = "🔊 Słuchaj";
        repeatBtn.innerText = `Powtórz rok: ${repeatYear ? 'TAK' : 'NIE'}`;
        enPhraseEl.innerText = selectedDate.toLocaleDateString('pl-PL', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } else {
        playBtn.innerText = "🔊 Listen";
        repeatBtn.innerText = `Repeat Year: ${repeatYear ? 'ON' : 'OFF'}`;
        enPhraseEl.innerText = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
}

// --- Navigation Arrows ---
document.getElementById('prevMonth').onclick = () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById('nextMonth').onclick = () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderCalendar();
};

// --- Language Toggle (EN|PL) ---
langToggle.onclick = () => {
    interfaceLang = (interfaceLang === 'EN') ? 'PL' : 'EN';
    langToggle.innerText = (interfaceLang === 'EN') ? 'EN | PL' : 'PL | EN';
    
    // Translate Roller Labels
    const currentM = monthRoller.value;
    monthRoller.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const label = interfaceLang === 'EN' 
            ? new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2020, i))
            : culturalData.months[i].pl;
        monthRoller.add(new Option(label, i));
    }
    monthRoller.value = currentM;
    updateUI();
};

// --- View Switching (Culture Hub) ---
document.getElementById('navCulture').onclick = () => {
    calendarSection.style.display = 'none';
    infoPanel.style.display = 'none';
    culturalHub.style.display = 'block';
    document.getElementById('navCulture').classList.add('active');
    document.getElementById('navCalendar').classList.remove('active');
    
    // Combine Grammar & Etymology
    culturalHub.innerHTML = `
        <div class="grammar-guide-card">
            <h3>${culturalData.grammarGuide.title}</h3>
            ${culturalData.grammarGuide.sections.map(s => `<div><h4>${s.heading}</h4><p>${s.content}</p></div>`).join('')}
        </div>
        <div class="etymology-section" style="padding: 15px; color: white;">
            <h3>Month Origins & Etymology</h3>
            ${Object.values(culturalData.months).map(m => `
                <div style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 5px;">
                    <strong>${m.pl}</strong>: ${m.derivation}
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

// --- Interaction Events ---
playBtn.onclick = () => {
    const utterance = new SpeechSynthesisUtterance(plPhraseEl.innerText);
    utterance.lang = 'pl-PL';
    window.speechSynthesis.speak(utterance);
};

repeatBtn.onclick = () => {
    repeatYear = !repeatYear;
    updateUI();
};

monthRoller.onchange = (e) => { viewDate.setMonth(e.target.value); renderCalendar(); };
yearRoller.onchange = (e) => { viewDate.setFullYear(e.target.value); renderCalendar(); };

/**
 * Speech Synthesis Logic
 * Handles long year strings for learning (0-3000 AD)
 */
document.getElementById('playBtn').onclick = () => {
    // 1. Cancel any current speech to prevent overlapping
    window.speechSynthesis.cancel();

    // 2. Capture the full phrase (including year if toggled ON)
    const fullPhrase = document.getElementById('plPhrase').innerText;
    
    const utterance = new SpeechSynthesisUtterance(fullPhrase);
    
    // 3. Force Polish locale for correct pronunciation of genitive endings
    utterance.lang = 'pl-PL';
    
    // 4. Adjust rate slightly slower for better learning of long years
    utterance.rate = 0.9; 
    utterance.pitch = 1.0;

    // 5. Speak the phrase
    window.speechSynthesis.speak(utterance);
};


// --- Initialization ---
window.onload = () => {
    // Initial Roller Population
    for (let i = 0; i < 12; i++) {
        monthRoller.add(new Option(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2020, i)), i));
    }
    for (let i = 2024; i <= 2030; i++) {
        yearRoller.add(new Option(i, i));
    }
    renderCalendar();
};
