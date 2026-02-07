// Google Apps Script Web App URL
// Example: https://script.google.com/macros/s/AKfycbx.../exec
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTrX5J193PW0fsbmIW9MhE9PPSOjR3k0_sQbfozp8Dz21ADBXucsL-_laZaZZPnHZKGQ/exec";

const appSelect = document.getElementById('application');
const registrationForm = document.getElementById('registrationForm');
const messageDiv = document.getElementById('message');
const submitButton = registrationForm.querySelector('button[type="submit"]');
const customApplicationInput = document.getElementById('customApplication');
const customApplicationLabel = document.getElementById('customApplicationLabel');

// Handle "Other" option visibility
appSelect.addEventListener('change', function() {
    if (this.value === 'Other') {
        customApplicationInput.style.display = 'block';
        customApplicationLabel.style.display = 'block';
        customApplicationInput.required = true;
    } else {
        customApplicationInput.style.display = 'none';
        customApplicationLabel.style.display = 'none';
        customApplicationInput.required = false;
        customApplicationInput.value = '';
    }
});

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
    'X (Twitter)',
    'Other'
];

// Function to show messages
function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
}

// Function to load application counts from Google Sheets via Apps Script
async function loadApplicationCounts() {
    appSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Application';
    appSelect.appendChild(defaultOption);

    try {
        const response = await fetch(`${SCRIPT_URL}?action=slots`, { method: 'GET' });
        const data = await response.json();

        if (!data || !data.slots) {
            throw new Error('Invalid slots data');
        }

        applications.forEach(app => {
            const option = document.createElement('option');
            option.value = app;
            
            if (app === 'Other') {
                option.textContent = 'Other';
            } else {
                const slotInfo = data.slots[app] || { count: 0, remaining: 2, full: false };
                option.textContent = `${app} (${slotInfo.count}/2 registered)`;

                if (slotInfo.full) {
                    option.disabled = true;
                    option.textContent += ' - FULL';
                }
            }

            appSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading slots:', error);
        applications.forEach(app => {
            const option = document.createElement('option');
            option.value = app;
            option.textContent = app;
            appSelect.appendChild(option);
        });
        showMessage('Unable to load real-time slots. Please refresh.', 'error');
    }
}

// Load application counts on page load and refresh periodically
loadApplicationCounts();
setInterval(loadApplicationCounts, 15000);

// Form submission handler
registrationForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Disable form during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    registrationForm.classList.add('loading');
    
    const formData = {
        name: document.getElementById('fullName').value.trim(),
        department: document.getElementById('department').value.trim(),
        year: document.getElementById('year').value,
        email: document.getElementById('email').value.trim().toLowerCase(),
        phone: document.getElementById('mobile').value.trim(),
        application: appSelect.value === 'Other' ? customApplicationInput.value.trim() : appSelect.value
    };
    
    try {
        if (!SCRIPT_URL || SCRIPT_URL === "YOUR_APPS_SCRIPT_WEB_APP_URL") {
            throw new Error('Apps Script URL not configured');
        }

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'register', data: formData })
        });

        const result = await response.json();

        if (!result.success) {
            showMessage(result.message || 'Registration failed.', 'error');
            return;
        }

        showMessage(`Registration successful for ${formData.application}!`, 'success');
        registrationForm.reset();
        await loadApplicationCounts();
    } catch (error) {
        console.error('Error during registration:', error);
        showMessage('Registration failed. Please try again. Error: ' + error.message, 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
        registrationForm.classList.remove('loading');
    }
});