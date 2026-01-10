
/* =========================================
   1. TRANSLATIONS & CONSTANTS
   ========================================= */
const TRANSLATIONS = {
    en: {
        app_title: "Tuition Manager",
        welcome: "Welcome!",
        tagline: "Manage your classes easily.",
        total_students: "Total Students",
        today_present: "Present Today",
        fees_collected: "Fees Collected",
        fees_pending: "Pending Fees",
        quick_actions: "Quick Actions",
        mark_attendance: "Attendance",
        add_fee: "Add Fee",
        reports: "Reports",
        search_placeholder: "Search Name...",
        add_student: "Add Student",
        date: "Date",
        present: "Present",
        absent: "Absent",
        mark_all_present: "Mark All Present",
        add_new_fee: "+ New Fee Entry",
        history: "History",
        pending_list: "Pending List",
        select_month: "Select Month",
        generate: "Generate Report",
        monthly_summary: "Monthly Summary",
        working_days: "Working Days",
        avg_attendance: "Avg Attendance",
        copy_summary: "Copy Summary for WhatsApp",
        app_language: "Language",
        settings: "Settings",
        home: "Home",
        students: "Students",
        attendance: "Attendance",
        fees: "Fees",
        backup_restore: "Backup & Restore",
        backup_desc: "Keep your data safe by backing up regularly.",
        download_backup: "Download Backup",
        restore_backup: "Restore Data",
        save: "Save",
        delete: "Delete",
        student_name: "Student Name",
        age: "Age",
        class: "Class",
        parent_mobile: "Parent Name & Mobile",
        parent_name: "Parent Name",
        subjects: "Subjects",
        fee_plan: "Fee Plan",
        amount: "Amount (₹)",
        student: "Student",
        month: "Month",
        amount_paid: "Amount Paid",
        payment_mode: "Payment Mode",
        notes: "Notes",
        save_payment: "Save Payment",
        confirm_delete: "Are you sure you want to delete this student?",
        data_restored: "Data restored successfully!",
        data_saved: "Saved successfully!",
        invalid_file: "Invalid backup file!",
        pending_due: "Due",
        paid: "Paid"
    },
    ta: {
        app_title: "ட்யூஷன் மேலாளர்",
        welcome: "வணக்கம்!",
        tagline: "உங்கள் வகுப்புகளை எளிதாக நிர்வகிக்கவும்.",
        total_students: "மொத்த மாணவர்கள்",
        today_present: "இன்று வருகை",
        fees_collected: "இம்மாத வசூல்",
        fees_pending: "நிலுவை தொகை",
        quick_actions: "விரைவான செயல்கள்",
        mark_attendance: "வருகை பதிவு",
        add_fee: "கட்டணம் சேர்",
        reports: "அறிக்கைகள்",
        search_placeholder: "பெயர் தேடுக...",
        add_student: "மாணவர் சேர்",
        date: "தேதி",
        present: "வருகை",
        absent: "வராது",
        mark_all_present: "அனைவரும் வருகை",
        add_new_fee: "+ புதிய கட்டணம்",
        history: "வரலாறு",
        pending_list: "நிலுவை பட்டியல்",
        select_month: "மாதம் தேர்வு செய்க",
        generate: "உருவாக்கு",
        monthly_summary: "மாதாந்திர சுருக்கம்",
        working_days: "வேலை நாட்கள்",
        avg_attendance: "சராசரி வருகை",
        copy_summary: "வாட்ஸ்அப் சுருக்கம் நகலெடு",
        app_language: "மொழி",
        settings: "அமைப்பு",
        home: "முகப்பு",
        students: "மாணவர்",
        attendance: "வருகை",
        fees: "கட்டணம்",
        backup_restore: "தேர்வு & மீட்பு",
        backup_desc: "உங்கள் தரவைப் பாதுகாப்பாக வைத்திருக்க, அவ்வெப்போது காப்புப் பிரதி எடுக்கவும்.",
        download_backup: "தரவிறக்கம் (Backup)",
        restore_backup: "தரவை மீட்டமை (Restore)",
        save: "சேமிக்க",
        delete: "நீக்குக",
        student_name: "பெயர்",
        age: "வயது",
        class: "வகுப்பு",
        parent_mobile: "பெற்றோர் & மொபைல்",
        parent_name: "பெற்றோர் பெயர்",
        subjects: "பாடங்கள்",
        fee_plan: "கட்டண முறை",
        amount: "தொகை (₹)",
        student: "மாணவர்",
        month: "மாதம்",
        amount_paid: "செலுத்திய தொகை",
        payment_mode: "முறை",
        notes: "குறிப்பு",
        save_payment: "பதிவு செய்",
        confirm_delete: "இந்த மாணவரை நிச்சயமாக நீக்க விரும்புகிறீர்களா?",
        data_restored: "தரவு வெற்றிகரமாக மீட்டமைக்கப்பட்டது!",
        data_saved: "வெற்றிகரமாக சேமிக்கப்பட்டது!",
        invalid_file: "தவறான கோப்பு!",
        pending_due: "நிலுவை",
        paid: "செலுத்தப்பட்டது"
    }
};

/* =========================================
   2. STATE MANAGEMENT
   ========================================= */
let appData = {
    settings: { language: 'ta' },
    students: [],
    attendance: {}, // Format: "YYYY-MM-DD": { studentId: "P"|"A"|"L" }
    fees: [] // Array of transaction objects
};

const STORAGE_KEY = 'tuition_manager_v1';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    applyLanguage(appData.settings.language);
    setupEventListeners();

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('att-date').value = today;
    document.getElementById('fee-date').value = today;

    // Set default report month
    const currentMonth = today.substring(0, 7);
    document.getElementById('report-month').value = currentMonth;

    renderDashboard();
});

function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            appData = JSON.parse(raw);
            // Default fallbacks for new schema updates
            if (!appData.fees) appData.fees = [];
            if (!appData.attendance) appData.attendance = {};
        } catch (e) {
            console.error("Data Parse Error", e);
        }
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    renderDashboard(); // Refresh dash on any save
}

/* =========================================
   3. LANGUAGE SYSTEM
   ========================================= */
function setLanguage(lang) {
    appData.settings.language = lang;
    saveData();
    applyLanguage(lang);
}

function applyLanguage(lang) {
    // Update active button state
    document.getElementById('btn-lang-ta').classList.toggle('active', lang === 'ta');
    document.getElementById('btn-lang-en').classList.toggle('active', lang === 'en');

    // Update Header Text Button
    const langBtnText = document.querySelector('.lang-text');
    if (langBtnText) langBtnText.innerText = lang === 'ta' ? 'தமிழ்' : 'English';

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang][key]) {
            el.innerText = TRANSLATIONS[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (TRANSLATIONS[lang][key]) {
            el.placeholder = TRANSLATIONS[lang][key];
        }
    });
}

function t(key) {
    return TRANSLATIONS[appData.settings.language][key] || key;
}

/* =========================================
   4. NAVIGATION & UI UTILS
   ========================================= */
function navigateTo(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    // Show target view
    document.getElementById(viewId).classList.add('active');

    // Update Bottom Nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[onclick*="${viewId}"]`)?.classList.add('active');

    // Trigger specific renders
    if (viewId === 'view-students') renderStudents();
    if (viewId === 'view-attendance') renderAttendance();
    if (viewId === 'view-fees') renderFees();
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

/* =========================================
   5. DASHBOARD MODULE
   ========================================= */
function renderDashboard() {
    // Total Students
    document.getElementById('dash-total-students').innerText = appData.students.length;

    // Attendance Today
    const today = new Date().toISOString().split('T')[0];
    const todayData = appData.attendance[today] || {};
    const presentCount = Object.values(todayData).filter(s => s === 'P').length;
    document.getElementById('dash-present-count').innerText = presentCount;
    document.getElementById('dash-active-count').innerText = appData.students.length;

    // Fees Stats
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

    let collectedParams = appData.fees.filter(f => f.month === currentMonth).reduce((acc, curr) => acc + parseInt(curr.paidAmount || 0), 0);
    document.getElementById('dash-fees-collected').innerText = collectedParams;

    // Calculate pending (Simple: Total Expected - Total Collected)
    // Note: This is an estimation. Real due tracking is complex.
    let totalExpected = appData.students.reduce((acc, stu) => acc + parseInt(stu.feeAmount || 0), 0);
    let pending = Math.max(0, totalExpected - collectedParams);
    document.getElementById('dash-fees-pending').innerText = pending;
}

/* =========================================
   6. STUDENTS MODULE
   ========================================= */
function openStudentModal(id = null) {
    const modal = document.getElementById('modal-student');
    const form = document.getElementById('form-student');
    form.reset();

    if (id) {
        const student = appData.students.find(s => s.id === id);
        document.getElementById('st-id').value = student.id;
        document.getElementById('st-name').value = student.name;
        document.getElementById('st-age').value = student.age;
        document.getElementById('st-class').value = student.class;
        document.getElementById('st-parent').value = student.parent;
        document.getElementById('st-mobile').value = student.mobile;
        document.getElementById('st-fee-amount').value = student.feeAmount;
        document.getElementById('st-fee-plan').value = student.feePlan || 'Monthly';

        // Subjects check
        if (student.subjects) {
            document.querySelectorAll('input[name="subject"]').forEach(cb => {
                cb.checked = student.subjects.includes(cb.value);
            });
        }

        document.getElementById('modal-student-title').innerText = t('student_name'); // Or Edit
        document.getElementById('btn-delete-student').classList.remove('hidden');
        document.getElementById('btn-delete-student').onclick = () => deleteStudent(id);
    } else {
        document.getElementById('st-id').value = '';
        document.getElementById('modal-student-title').innerText = t('add_student');
        document.getElementById('btn-delete-student').classList.add('hidden');
    }

    modal.classList.remove('hidden');
}

document.getElementById('form-student').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('st-id').value || Date.now().toString();

    const subjects = [];
    document.querySelectorAll('input[name="subject"]:checked').forEach(cb => subjects.push(cb.value));

    const newStudent = {
        id: id,
        name: document.getElementById('st-name').value,
        age: document.getElementById('st-age').value,
        class: document.getElementById('st-class').value,
        parent: document.getElementById('st-parent').value,
        mobile: document.getElementById('st-mobile').value,
        feeAmount: document.getElementById('st-fee-amount').value,
        feePlan: document.getElementById('st-fee-plan').value,
        subjects: subjects
    };

    const index = appData.students.findIndex(s => s.id === id);
    if (index >= 0) {
        appData.students[index] = newStudent;
    } else {
        appData.students.push(newStudent);
    }

    saveData();
    closeModal('modal-student');
    renderStudents();
    showToast(t('data_saved'));
});

function deleteStudent(id) {
    if (confirm(t('confirm_delete'))) {
        appData.students = appData.students.filter(s => s.id !== id);
        saveData();
        closeModal('modal-student');
        renderStudents();
    }
}

function renderStudents() {
    const list = document.getElementById('students-list');
    const query = document.getElementById('student-search').value.toLowerCase();

    list.innerHTML = '';

    appData.students
        .filter(s => s.name.toLowerCase().includes(query))
        .forEach(s => {
            const div = document.createElement('div');
            div.className = 'card-item';
            div.innerHTML = `
                <div class="card-content">
                    <h4>${s.name}</h4>
                    <p>${s.class} Std | ₹${s.feeAmount}</p>
                    <div class="meta">
                        <span class="badge">${s.subjects.join(', ')}</span>
                    </div>
                </div>
                <button class="btn-sm" onclick="openStudentModal('${s.id}')">✏️</button>
            `;
            list.appendChild(div);
        });
}

// Search Listener
document.getElementById('student-search').addEventListener('input', renderStudents);


/* =========================================
   7. ATTENDANCE MODULE
   ========================================= */
function renderAttendance() {
    const date = document.getElementById('att-date').value;
    const list = document.getElementById('attendance-list');
    const records = appData.attendance[date] || {};

    list.innerHTML = '';

    let p = 0, a = 0;

    appData.students.forEach(s => {
        const status = records[s.id] || 'A'; // Default Absent if not marked? Or 'P'? Let's default A until marked.
        if (status === 'P') p++; else a++; // Simple logic

        const isPresent = status === 'P';

        const div = document.createElement('div');
        div.className = 'att-row';
        div.innerHTML = `
            <span>${s.name} <small>(${s.class})</small></span>
            <div class="toggle-btn ${isPresent ? 'present' : ''}" onclick="toggleAttendance('${s.id}', this)">
                <div class="toggle-thumb"></div>
            </div>
        `;
        list.appendChild(div);
    });

    document.getElementById('att-count-present').innerText = p;
    document.getElementById('att-count-absent').innerText = a;
}

function toggleAttendance(studentId, el) {
    el.classList.toggle('present');
    updateTempStats();
}

function updateTempStats() {
    const total = appData.students.length;
    const p = document.querySelectorAll('.toggle-btn.present').length;
    document.getElementById('att-count-present').innerText = p;
    document.getElementById('att-count-absent').innerText = total - p;
}

function markAllPresent() {
    document.querySelectorAll('.toggle-btn').forEach(el => el.classList.add('present'));
    updateTempStats();
}

function saveAttendance() {
    const date = document.getElementById('att-date').value;
    const records = {};

    const rows = document.getElementById('attendance-list').children;
    appData.students.forEach((s, idx) => {
        const row = rows[idx];
        const isPresent = row.querySelector('.toggle-btn').classList.contains('present');
        records[s.id] = isPresent ? 'P' : 'A';
    });

    appData.attendance[date] = records;
    saveData();
    showToast(t('data_saved'));
}

document.getElementById('att-date').addEventListener('change', renderAttendance);


/* =========================================
   8. FEES MODULE
   ========================================= */
function openFeeModal() {
    const select = document.getElementById('fee-student');
    select.innerHTML = `<option value="">-- Select Student --</option>`;
    appData.students.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });

    // Default to current month
    const today = new Date().toISOString().substring(0, 7);
    document.getElementById('fee-month').value = today;
    document.getElementById('form-fee').reset();
    document.getElementById('fee-month').value = today; // Reset clears it

    document.getElementById('modal-fee').classList.remove('hidden');
}

function autoFillFeeData() {
    const stdId = document.getElementById('fee-student').value;
    const student = appData.students.find(s => s.id === stdId);
    if (student) {
        document.getElementById('fee-amount').value = student.feeAmount;
    }
}

document.getElementById('form-fee').addEventListener('submit', (e) => {
    e.preventDefault();
    const newFee = {
        id: Date.now().toString(),
        studentId: document.getElementById('fee-student').value,
        month: document.getElementById('fee-month').value,
        paidAmount: document.getElementById('fee-amount').value,
        mode: document.getElementById('fee-mode').value,
        notes: document.getElementById('fee-notes').value,
        date: new Date().toISOString()
    };

    appData.fees.push(newFee);
    saveData();
    closeModal('modal-fee');
    renderFees();
    showToast('Payment Saved!');
});

function switchFeeTab(tab) {
    document.getElementById('fee-history-view').classList.toggle('hidden', tab !== 'history');
    document.getElementById('fee-pending-view').classList.toggle('hidden', tab !== 'pending');

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    // Simplistic active toggle
    event.target.classList.add('active');

    if (tab === 'history') renderFees();
    else renderPendingFees();
}

function renderFees() {
    const list = document.getElementById('fee-list');
    list.innerHTML = '';

    // In a real app we would filter by month, here just show last 20
    const sorted = [...appData.fees].reverse().slice(0, 20);

    sorted.forEach(f => {
        const s = appData.students.find(st => st.id === f.studentId);
        if (!s) return;

        const div = document.createElement('div');
        div.className = 'card-item success';
        div.innerHTML = `
            <div class="card-content">
                <h4>${s.name}</h4>
                <p>${f.month} | ${f.mode}</p>
            </div>
            <div class="right" style="text-align:right">
                <div class="bold green-text">+ ₹${f.paidAmount}</div>
                <small>${new Date(f.date).toLocaleDateString()}</small>
            </div>
        `;
        list.appendChild(div);
    });
}

function renderPendingFees() {
    const list = document.getElementById('pending-list');
    list.innerHTML = '';

    const currentMonth = new Date().toISOString().substring(0, 7);

    appData.students.forEach(s => {
        // Check if student paid for current month
        const paidEntry = appData.fees.find(f => f.studentId === s.id && f.month === currentMonth);

        if (!paidEntry) {
            const div = document.createElement('div');
            div.className = 'card-item warning';
            div.innerHTML = `
                <div class="card-content">
                    <h4>${s.name}</h4>
                    <p>${currentMonth}</p>
                </div>
                <div class="bold red-text">${t('pending_due')}: ₹${s.feeAmount}</div>
            `;
            list.appendChild(div);
        }
    });
}


/* =========================================
   9. REPORTS & BACKUP
   ========================================= */
function generateReport() {
    const month = document.getElementById('report-month').value;
    if (!month) return;

    // 1. Working Days
    const days = Object.keys(appData.attendance).filter(d => d.startsWith(month));
    document.getElementById('rep-working-days').innerText = days.length;

    // 2. Fees
    const feesInMonth = appData.fees.filter(f => f.month === month);
    const totalCollected = feesInMonth.reduce((acc, f) => acc + parseInt(f.paidAmount), 0);
    document.getElementById('rep-collected').innerText = totalCollected;

    // Pending
    let totalExpected = appData.students.length > 0 ? appData.students.reduce((acc, s) => acc + parseInt(s.feeAmount || 0), 0) : 0;
    // NOTE: This logic assumes all students active all months. Good for simple MVP.
    document.getElementById('rep-pending').innerText = Math.max(0, totalExpected - totalCollected);

    // 3. Avg Attendance
    let totalPresent = 0;
    let totalEntries = 0;
    days.forEach(d => {
        const records = appData.attendance[d];
        Object.values(records).forEach(status => {
            if (status === 'P') totalPresent++;
            totalEntries++;
        });
    });

    const avg = totalEntries > 0 ? Math.round((totalPresent / totalEntries) * 100) : 0;
    document.getElementById('rep-avg-att').innerText = avg + '%';

    document.getElementById('report-output').classList.remove('hidden');
}

function exportReportText() {
    const month = document.getElementById('report-month').value;
    const workingDays = document.getElementById('rep-working-days').innerText;
    const col = document.getElementById('rep-collected').innerText;
    const pen = document.getElementById('rep-pending').innerText;
    const att = document.getElementById('rep-avg-att').innerText;

    const title = appData.settings.language === 'ta' ? `📊 *மாதாந்திர அறிக்கை - ${month}*` : `📊 *Monthly Report - ${month}*`;

    const text = `${title}\n\n` +
        `📅 Days: ${workingDays}\n` +
        `💰 Collected: ₹${col}\n` +
        `⚠️ Pending: ₹${pen}\n` +
        `✅ Avg Attendance: ${att}`;

    navigator.clipboard.writeText(text).then(() => showToast('Copied to Clipboard!'));
}

function backupData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tuition_backup_" + new Date().toISOString().split('T')[0] + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function restoreData(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const restored = JSON.parse(e.target.result);
            if (restored.students && restored.settings) {
                appData = restored;
                saveData();
                showToast(t('data_restored'));
                setTimeout(() => location.reload(), 1000);
            } else {
                showToast(t('invalid_file'));
            }
        } catch (err) {
            showToast('Error reading file');
        }
    };
    reader.readAsText(file);
}
