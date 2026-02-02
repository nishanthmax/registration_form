# Registration Form Project

## Overview
This project is a registration form for a college event, built using HTML, CSS, and JavaScript, with Formspree email submission.

## Folder Structure
```
registration-form/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Formspree Setup (Step-by-Step)
1. Go to [Formspree](https://formspree.io) and sign up
2. Create a new form and copy the endpoint URL (looks like: `https://formspree.io/f/abcd1234`)
3. Open [index.html](registration-form/index.html)
4. Replace this value:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   with your Formspree endpoint URL
5. Save the file

## Features
- Name, Email, Department, Year, Phone Number, and App selection fields
- Mobile number validation (10 digits)
- Email validation (browser level)
- Automatic disabling of full apps
- User-friendly success/error messages
- Form validation and loading states
- Data delivered directly to your email via Formspree
- Responsive and clean UI suitable for a college event

## How to Run
1. Complete the Formspree setup above
2. Update the Formspree endpoint URL in [index.html](registration-form/index.html)
3. Open [index.html](registration-form/index.html) in a browser
4. Ensure you have an internet connection

## Technical Details
- Formspree email delivery