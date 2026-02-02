# 🔐 Admin Control System - Vibe Zone Registration

## Overview
Complete registration system with admin control that allows turning registrations ON/OFF. When OFF, users cannot access or submit the form.

---

## 📁 Files Included

1. **index.html** - Main registration form with hamburger menu
2. **admin.html** - Admin login & control panel
3. **script.js** - Main page logic & registration handling
4. **admin-script.js** - Admin panel logic
5. **apps-script.js** - Google Apps Script backend
6. **styles.css** - All styling

---

## 🚀 Deployment Steps

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named **"Vibe Zone Registrations"**
3. Create **2 sheets**:
   - **Registrations** - Headers: `Timestamp | Name | Email | Department | Year | Phone | Application`
   - **Status** - Headers: `Status` with value `OFF` in row 2

### Step 2: Deploy Google Apps Script
1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. Delete all existing code
4. Paste the code from **apps-script.js**
5. Click **Deploy → New Deployment**
   - Type: Web app
   - Execute as: Your email
   - Who has access: Anyone
6. Copy the deployment URL (looks like: `https://script.google.com/macros/s/...../usercodeapp`)

### Step 3: Update Configuration Files
1. Open **script.js** - Replace `YOUR_APPS_SCRIPT_ID` with your deployment URL
2. Open **admin-script.js** - Replace `YOUR_APPS_SCRIPT_ID` with your deployment URL
3. Change **ADMIN_PASSWORD** in both files to a secure password:
   - **admin-script.js** (line 7)
   - **apps-script.js** (line 7)

### Step 4: Deploy Website
- Upload all files to:
  - GitHub Pages
  - Netlify
  - Vercel
  - Or any static hosting

---

## 🔐 How It Works

### For Users:
1. Visit the registration website
2. Click hamburger menu (top-right) to see "Admin Login"
3. Fill registration form (only works when admin enables access)
4. If registrations are OFF:
   - Red alert shows "Registrations are currently closed"
   - All form fields are disabled
   - Submit button is disabled

### For Admin:
1. Click hamburger menu → "Admin Login"
2. Enter admin password
3. Toggle ON/OFF switch to control access
4. Status updates in real-time across all user browsers

---

## 🔑 Default Credentials
- **Admin Password:** `admin123`
- **Change this immediately in production!**

---

## 📊 Data Structure

### Registrations Sheet
| Timestamp | Name | Email | Department | Year | Phone | Application |
|-----------|------|-------|------------|------|-------|-------------|
| Auto | User Input | User Input | User Input | User Input | User Input | User Input |

### Status Sheet
| Status |
|--------|
| ON/OFF |

---

## 🎨 Features

✅ Hamburger menu navigation
✅ Admin-only control panel
✅ Real-time ON/OFF toggle
✅ Form auto-disabled when OFF
✅ Red alert for closed registrations
✅ 2 registrations per app limit
✅ Email uniqueness check
✅ Responsive design
✅ Session-based admin login
✅ Auto-refresh status (30 seconds)

---

## 🧪 Testing

### Test 1: Turn OFF & Try Registration
1. Admin: Toggle OFF
2. User: Try to type in form - should be disabled ❌

### Test 2: Turn ON & Register
1. Admin: Toggle ON
2. User: Form becomes active ✅
3. User: Submit registration

### Test 3: Duplicate Email
1. Register once with email
2. Try registering again with same email - should reject ❌

### Test 4: 2 Registration Limit
1. Register 2 users for same app
2. Try 3rd registration for same app - should show "FULL" ❌

---

## 🔄 Auto-Refresh Behavior

- **Main site checks status every 30 seconds** - No manual refresh needed
- **Admin panel refreshes every 10 seconds** - Real-time updates
- Users see immediate changes when admin toggles access

---

## ⚠️ Important Security Notes

1. **Google Apps Script is PUBLIC** - Don't store sensitive data
2. **Admin password sent in requests** - Use HTTPS only (most hosts do)
3. **Change default password immediately**
4. **In production:** Consider replacing Apps Script with a real backend (Node.js, Python, etc.)

---

## 🐛 Troubleshooting

**Problem:** "Registrations are currently closed" always shows
- **Solution:** Check if admin has turned ON access. Default is OFF.

**Problem:** Admin login not working
- **Solution:** Check if password matches in admin-script.js and apps-script.js

**Problem:** Form still allows input when OFF
- **Solution:** Clear browser cache, hard refresh (Ctrl+Shift+R)

**Problem:** Apps Script URL errors
- **Solution:** Ensure you copied the full URL and replaced it in both script.js and admin-script.js

---

## 📝 Customization

### Change Admin Password:
1. Open **admin-script.js** line 7
2. Change `ADMIN_PASSWORD = "admin123"`

### Change App Limit:
1. Open **apps-script.js** line 6
2. Change `MAX_PER_APP = 2` to desired number

### Change Status Check Interval:
1. Open **script.js** line 64
2. Change `setInterval(checkRegistrationStatus, 30000)` (in milliseconds)

---

## 📞 Support
For issues, verify:
1. Apps Script is deployed and accessible
2. Google Sheet has both "Registrations" and "Status" sheets
3. URLs are correctly pasted in all files
4. Admin password is consistent across files

---

**Built for:** Vibe Zone - YUVA Club of Jeppiaar Engineering College 🎉
