import holidayData from './holiday.js';
import culturalData from './cultural.js';
import yearData from './year.js';
import phonetics from './phonetics.js';
import { getWrittenDay } from './numbers.js';

// --- 1. STATE MANAGEMENT ---
let viewDate = new Date(); 
let selectedDate = new Date(); 
let interfaceLang = 'PL'; 
let repeatYear = true;

// --- 2. CORE RENDERING ---
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const mRoller = document.getElementById('monthRoller');
    const yRoller = document.getElementById('yearRoller');
    
    grid.innerHTML = '';
    
    // Sync Rollers
    mRoller.value = viewDate.getMonth();
    yRoller.value = viewDate.getFullYear();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Apply Seasonal Theme 
    document.body.className = culturalData.months[month].season;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const yearHolidays = holidayData.getHolidaysForYear(year);

    // Grid Spacers
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

// --- 3. UI & PHONETICS LOGIC ---
function updateUI() {
    const mIdx = selectedDate.getMonth();
    const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][selectedDate.getDay()];
    const dayNamePl = culturalData.days[dayKey].split(' ')[0];
    
    // Written Words (Genitive Case)
    const monthGen = culturalData.months[mIdx].pl.replace(/ń$/, 'nia').replace(/ec$/, 'ca').replace(/y$/, 'ego').toLowerCase();
    const dayNumWritten = getWrittenDay(selectedDate.getDate());
    const yearPl = yearData.getYearInPolish(selectedDate.getFullYear());

    // Phonetics 
    const pDayName = phonetics.days[dayNamePl.toLowerCase()] || dayNamePl;
    const pMonth = phonetics.months[monthGen] || monthGen;
    const pYear = yearData.getYearPhonetic(selectedDate.getFullYear());
    
    // Dynamic phonetic lookup for the day number (fixes the "4" vs "chvar-TAY-goh" issue)
    const pDayNum = phonetics.numbers[selectedDate.getDate()] || selectedDate.getDate();

    // Update Phrase Display
    const fullPlDate = `${dayNamePl}, ${dayNumWritten} ${monthGen}`;
    document.getElementById('plPhrase').innerText = repeatYear ? `${fullPlDate} ${yearPl}` : fullPlDate;
    
    document.getElementById('phoneticPhrase').innerText = repeatYear 
        ? `${pDayName}, ${pDayNum} ${pMonth} ${pYear}` 
        : `${pDayName}, ${pDayNum} ${pMonth}`;

    // Translate Buttons & Bottom Text
    const playBtn = document.getElementById('playBtn');
    const repeatBtn = document.getElementById('repeatYearBtn');
    const enPhrase = document.getElementById('enPhrase');

    if (interfaceLang === 'PL') {
        playBtn.innerText = "🔊 Słuchaj";
        repeatBtn.innerText = `Powtórz rok: ${repeatYear ? 'TAK' : 'NIE'}`;
        enPhrase.innerText = selectedDate.toLocaleDateString('pl-PL', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } else {
        playBtn.innerText = "🔊 Listen";
        repeatBtn.innerText = `Repeat Year: ${repeatYear ? 'ON' : 'OFF'}`;
        enPhrase.innerText = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
}

// --- 4. EVENT LISTENERS (TOP NAV & CONTROLS) ---
document.getElementById('navCulture').onclick = () => {
    document.getElementById('calendarSection').style.display = 'none';
    document.querySelector('.info-panel').style.display = 'none';
    const hub = document.getElementById('culturalHub');
    hub.style.display = 'block';
    
    document.getElementById('navCulture').classList.add('active');
    document.getElementById('navCalendar').classList.remove('active');

    // Build Content with Etymology & Holiday Descriptions
    hub.innerHTML = `
        <div class="culture-wrap">
            <h2>📜 Grammar Guide</h2>
            <p>${culturalData.grammarGuide.sections[0].content}</p>
            
            <h2>📅 Days of the Week</h2>
            <div class="culture-grid">
                ${Object.entries(culturalData.days).map(([en, pl]) => `<div><strong>${pl}</strong> (${en})</div>`).join('')}
            </div>
            
            <h2>🎈 Holidays in ${selectedDate.getFullYear()}</h2>
            ${Object.entries(holidayData.getHolidaysForYear(selectedDate.getFullYear())).map(([key, name]) => {
                const desc = culturalData.holidayExplanations[key] || "A significant national or religious day.";
                return `<div class="holiday-card"><strong>${name}</strong><br><small>${desc}</small></div>`;
            }).join('')}

            <h2>🌙 Month Etymology</h2>
            ${Object.values(culturalData.months).map(m => `<p><strong>${m.pl}</strong>: ${m.derivation}</p>`).join('')}
        </div>
    `;
};

document.getElementById('navCalendar').onclick = () => {
    document.getElementById('calendarSection').style.display = 'block';
    document.querySelector('.info-panel').style.display = 'block';
    document.getElementById('culturalHub').style.display = 'none';
    document.getElementById('navCalendar').classList.add('active');
    document.getElementById('navCulture').classList.remove('active');
};

document.getElementById('langToggle').onclick = () => {
    interfaceLang = (interfaceLang === 'EN') ? 'PL' : 'EN';
    document.getElementById('langToggle').innerText = (interfaceLang === 'EN') ? 'EN | PL' : 'PL | EN';
    
    // Refresh the Month Roller Labels
    const mRoller = document.getElementById('monthRoller');
    const currentM = mRoller.value;
