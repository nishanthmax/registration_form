// Formspree Configuration
const FORMSPREE_ID = "mbdkpjpb";

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

// Function to get registration counts from localStorage
function getRegistrationCounts() {
    const stored = localStorage.getItem('appRegistrations');
    if (!stored) {
        const initial = {};
        applications.forEach(app => {
            if (app !== 'Other') initial[app] = 0;
        });
        localStorage.setItem('appRegistrations', JSON.stringify(initial));
        return initial;
    }
    return JSON.parse(stored);
}

// Function to update registration count
function incrementAppCount(appName) {
    if (appName === 'Other') return;
    const counts = getRegistrationCounts();
    counts[appName] = (counts[appName] || 0) + 1;
    localStorage.setItem('appRegistrations', JSON.stringify(counts));
}

// Function to load application options with slot counts
function loadApplicationCounts() {
    const counts = getRegistrationCounts();
    appSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Application';
    appSelect.appendChild(defaultOption);

    applications.forEach(app => {
        const option = document.createElement('option');
        option.value = app;
        
        if (app === 'Other') {
            option.textContent = 'Other';
        } else {
            const count = counts[app] || 0;
            option.textContent = `${app} (${count}/2 registered)`;

            if (count >= 2) {
                option.disabled = true;
                option.textContent += ' - FULL';
            }
        }

        appSelect.appendChild(option);
    });
}

// Load application counts on page load
loadApplicationCounts();

// Form submission handler with Formspree and localStorage tracking
registrationForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const selectedApp = appSelect.value === 'Other' ? customApplicationInput.value.trim() : appSelect.value;
    
    // Check if app is full (client-side validation)
    if (appSelect.value !== 'Other') {
        const counts = getRegistrationCounts();
        if ((counts[selectedApp] || 0) >= 2) {
            showMessage('This application is full. Please select another.', 'error');
            return;
        }
    }
    
    // Disable form during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    registrationForm.classList.add('loading');
    
    // Handle "Other" application case
    if (appSelect.value === 'Other' && customApplicationInput.value.trim()) {
        const tempInput = document.createElement('input');
        tempInput.type = 'hidden';
        tempInput.name = 'application';
        tempInput.value = customApplicationInput.value.trim();
        registrationForm.appendChild(tempInput);
    }
    
    const formData = new FormData(registrationForm);
    
    try {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Increment the count in localStorage
            incrementAppCount(selectedApp);
            
            showMessage(`Registration successful for ${selectedApp}!`, 'success');
            registrationForm.reset();
            customApplicationInput.style.display = 'none';
            customApplicationLabel.style.display = 'none';
            
            // Refresh the dropdown to show updated counts
            loadApplicationCounts();
        } else {
            const data = await response.json();
            if (data.errors) {
                showMessage('Registration failed: ' + data.errors.map(e => e.message).join(', '), 'error');
            } else {
                showMessage('Registration failed. Please try again.', 'error');
            }
        }
    } catch (error) {
        console.error('Error during registration:', error);
        showMessage('Registration failed. Please check your internet connection.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
        registrationForm.classList.remove('loading');
        // Remove any temporary inputs
        const tempInputs = registrationForm.querySelectorAll('input[type="hidden"][name="application"]');
        tempInputs.forEach(input => input.remove());
    }
});