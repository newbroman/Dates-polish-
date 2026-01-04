import holidayData from './holiday.js';
import culturalData from './cultural.js';
import yearData from './year.js';
import phonetics from './phonetics.js';
import grammarRules from './rules.js'; // Ensure rules.js is created!
import { getWrittenDay } from './numbers.js';

// --- 1. STATE ---
let viewDate = new Date(); 
let selectedDate = new Date(); 
let interfaceLang = 'PL'; 
let includeYear = true; // Renamed from repeatYear

// --- 2. NAVIGATION HELPER ---
function hideAllSections() {
    document.getElementById('calendarSection').style.display = 'none';
    document.getElementById('culturalHub').style.display = 'none';
    document.getElementById('rulesPage').style.display = 'none';
    document.querySelector('.info-panel').style.display = 'none';
    
    // Reset active states on buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
}

// --- 3. UI RENDERING ---
function updateUI() {
    const mIdx = selectedDate.getMonth();
    const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][selectedDate.getDay()];
    const dayNamePl = culturalData.days[dayKey].split(' ')[0];
    
    const monthGen = culturalData.months[mIdx].pl.replace(/ń$/, 'nia').replace(/ec$/, 'ca').replace(/y$/, 'ego').toLowerCase();
    const dayNumWritten = getWrittenDay(selectedDate.getDate());
    const yearPl = yearData.getYearInPolish(selectedDate.getFullYear());

    // Phonetics
    const pDayName = phonetics.days[dayNamePl.toLowerCase()] || dayNamePl;
    const pMonth = phonetics.months[monthGen] || monthGen;
    const pYear = yearData.getYearPhonetic(selectedDate.getFullYear());
    const pDayNum = phonetics.numbers[selectedDate.getDate()] || selectedDate.getDate();

    // Phrases
    const fullPlDate = `${dayNamePl}, ${dayNumWritten} ${monthGen}`;
    document.getElementById('plPhrase').innerText = includeYear ? `${fullPlDate} ${yearPl}` : fullPlDate;
    
    document.getElementById('phoneticPhrase').innerText = includeYear 
        ? `${pDayName}, ${pDayNum} ${pMonth} ${pYear}` 
        : `${pDayName}, ${pDayNum} ${pMonth}`;

    // Update Buttons
    const includeBtn = document.getElementById('repeatYearBtn');
    includeBtn.innerText = `Include Year: ${includeYear ? 'ON' : 'OFF'}`;
}

// --- 4. EVENT LISTENERS ---

// Today Button Logic
document.getElementById('todayBtn').onclick = () => {
    selectedDate = new Date();
    viewDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    hideAllSections();
    document.getElementById('calendarSection').style.display = 'block';
    document.querySelector('.info-panel').style.display = 'block';
    document.getElementById('navCalendar').classList.add('active');
    renderCalendar();
};

// Calendar Nav
document.getElementById('navCalendar').onclick = () => {
    hideAllSections();
    document.getElementById('calendarSection').style.display = 'block';
    document.querySelector('.info-panel').style.display = 'block';
    document.getElementById('navCalendar').classList.add('active');
};

// REORDERED Culture Hub (Days -> Months -> Holidays)
document.getElementById('navCulture').onclick = () => {
    hideAllSections();
    const hub = document.getElementById('culturalHub');
    hub.style.display = 'block';
    document.getElementById('navCulture').classList.add('active');

    hub.innerHTML = `
        <div class="culture-wrap">
            <h2>📅 Days of the Week</h2>
            <div class="culture-grid">
                ${Object.entries(culturalData.days).map(([en, pl]) => `<div class="culture-item"><strong>${pl}</strong> (${en})</div>`).join('')}
            </div>
            
            <h2>🌙 Months & Etymology</h2>
            <div class="culture-list">
                ${Object.values(culturalData.months).map(m => `<p><strong>${m.pl}</strong>: ${m.derivation}</p>`).join('')}
            </div>

            <h2>🎈 Holidays (${selectedDate.getFullYear()})</h2>
            <div class="holiday-section">
                ${Object.entries(holidayData.getHolidaysForYear(selectedDate.getFullYear())).map(([key, name]) => {
                    const desc = culturalData.holidayExplanations[key] || "National holiday.";
                    return `<div class="holiday-card"><strong>${name}</strong><br><small>${desc}</small></div>`;
                }).join('')}
            </div>
        </div>
    `;
};

// Grammar Rules Page Logic
document.getElementById('navRules').onclick = () => {
    hideAllSections();
    const rulesDiv = document.getElementById('rulesPage');
    rulesDiv.style.display = 'block';
    document.getElementById('navRules').classList.add('active');

    rulesDiv.innerHTML = `
        <div class="culture-wrap">
            <h2>📖 Grammar Rules</h2>
            <div class="rules-card">
                <h3>${grammarRules.genitive.title}</h3>
                <p>${grammarRules.genitive.explanation}</p>
                <p><em>${grammarRules.genitive.rule}</em></p>
            </div>
            <div class="rules-card">
                <h3>${grammarRules.years.title}</h3>
                <p>${grammarRules.years.explanation}</p>
                <p><strong>Example:</strong> ${grammarRules.years.example}</p>
            </div>
        </div>
    `;
};

// Settings
document.getElementById('repeatYearBtn').onclick = () => {
    includeYear = !includeYear;
    updateUI();
};

// ... include renderCalendar() and window.onload as previously defined ...
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const mRoller = document.getElementById('monthRoller');
    const yRoller = document.getElementById('yearRoller');
    
    grid.innerHTML = '';
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        grid.appendChild(document.createElement('div'));
    }

    // Render days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.innerText = day;
        
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

window.onload = () => {
    // Populate month/year selectors
    const mR = document.getElementById('monthRoller');
    for (let i = 0; i < 12; i++) {
        mR.add(new Option(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2020, i)), i));
    }
    const yR = document.getElementById('yearRoller');
    for (let i = 2020; i <= 2030; i++) {
        yR.add(new Option(i, i));
    }
    renderCalendar();
};
