// Google Apps Script Web App URL - REPLACE WITH YOUR DEPLOYED URL
const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/usercodeapp";

const statusKey = 'registrationStatus';

const applications = [
    'Google Drive',
    'Google Docs',
    'Google Sheets',
    'Google Slides',
    'Google Calendar',
    'Gmail',
    'Google Meet',
    'Notion',
    'Microsoft OneNote',
    'Trello',
    'Todoist',
    'Clockify',
    'LinkedIn',
    'LinkedIn Learning',
    'Coursera',
    'Udemy',
    'Khan Academy',
    'GitHub',
    'GitHub Desktop',
    'Visual Studio Code',
    'ChatGPT',
    'Replit',
    'Canva',
    'Figma',
    'Adobe Express',
    'Indeed',
    'Naukri',
    'Internshala',
    'Glassdoor',
    'Google Forms',
    'WhatsApp',
    'Instagram',
    'YouTube',
    'Telegram',
    'X (Twitter)'
];

// DOM Elements
const hamburgerBtn = document.getElementById('hamburgerBtn');
const menu = document.getElementById('menu');
const statusAlert = document.getElementById('statusAlert');
const statusText = document.getElementById('statusText');
const appSelect = document.getElementById('application');
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');

let isRegistrationOpen = false;

// Hamburger Menu Toggle
hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    menu.classList.toggle('hidden');
});

function closeMenu() {
    hamburgerBtn.classList.remove('active');
    menu.classList.add('hidden');
}

// Check Registration Status on Load
window.addEventListener('load', () => {
    checkRegistrationStatus();
    setInterval(checkRegistrationStatus, 5000); // Check every 5 seconds
});

function checkRegistrationStatus() {
    const status = localStorage.getItem(statusKey) || 'OFF';
    isRegistrationOpen = status === 'ON';
    
    if (isRegistrationOpen) {
        statusAlert.classList.add('hidden');
        enableForm();
    } else {
        statusAlert.classList.remove('hidden');
        disableForm();
    }
}

function disableForm() {
    const inputs = form.querySelectorAll('input, select, button');
    inputs.forEach(input => {
        if (input.id !== 'submitBtn') {
            input.disabled = true;
        }
    });
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrations Closed';
}

function enableForm() {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.disabled = false;
    });
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register';
}

function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
}

// Form Submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!isRegistrationOpen) {
        showMessage('Registrations are currently closed.', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    form.classList.add('loading');

    const formData = new FormData(form);
    formData.append('_subject', 'New Vibe Zone Registration');

    try {
        const response = await fetch('https://formspree.io/f/mbdkpjpb', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showMessage(`✅ Registration successful for ${appSelect.value}!`, 'success');
            form.reset();
        } else {
            showMessage('Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Registration failed. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
        form.classList.remove('loading');
    }
});