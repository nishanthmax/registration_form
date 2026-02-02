// Admin Password (Change this!)
const ADMIN_PASSWORD = "vibezone123";

// DOM Elements
const loginForm = document.getElementById('loginForm');
const adminPanel = document.getElementById('adminPanel');
const adminPassword = document.getElementById('adminPassword');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const toggleSwitch = document.getElementById('toggleSwitch');
const currentStatus = document.getElementById('currentStatus');
const lastUpdated = document.getElementById('lastUpdated');
const logoutBtn = document.getElementById('logoutBtn');

const sessionKey = 'adminLoggedIn';
const statusKey = 'registrationStatus';

// Check if already logged in
window.addEventListener('load', () => {
    if (sessionStorage.getItem(sessionKey) === 'true') {
        showAdminPanel();
        loadStatus();
    }
});

// Login Handler
loginBtn.addEventListener('click', () => {
    const password = adminPassword.value.trim();
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(sessionKey, 'true');
        showAdminPanel();
        loadStatus();
    } else {
        loginError.textContent = 'Invalid password. Try again.';
    }
});

adminPassword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        loginBtn.click();
    }
});

// Toggle Switch Handler
toggleSwitch.addEventListener('click', () => {
    const isCurrentlyOn = toggleSwitch.classList.contains('on');
    const newState = !isCurrentlyOn;
    
    // Save to localStorage
    localStorage.setItem(statusKey, newState ? 'ON' : 'OFF');
    loadStatus();
});

// Load Current Status
function loadStatus() {
    const status = localStorage.getItem(statusKey) || 'OFF';
    const isOpen = status === 'ON';
    
    if (isOpen) {
        toggleSwitch.classList.add('on');
        currentStatus.textContent = '✅ OPEN - Registrations Allowed';
        currentStatus.style.color = '#28a745';
    } else {
        toggleSwitch.classList.remove('on');
        currentStatus.textContent = '❌ CLOSED - Registrations Blocked';
        currentStatus.style.color = '#dc3545';
    }
    
    lastUpdated.textContent = new Date().toLocaleString();
}

// Logout Handler
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(sessionKey);
    showLoginForm();
    adminPassword.value = '';
    loginError.textContent = '';
});

function showLoginForm() {
    loginForm.classList.add('active');
    adminPanel.classList.remove('active');
}

function showAdminPanel() {
    loginForm.classList.remove('active');
    adminPanel.classList.add('active');
}
