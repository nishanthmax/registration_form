const SHEET_NAME = 'Registrations';
const STATUS_SHEET = 'Status';
const MAX_PER_APP = 2;
const ADMIN_PASSWORD = 'vibezone123'; // Change this!

const APPS = [
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

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'getStatus';
  
  try {
    if (action === 'getStatus') {
      return json(getRegistrationStatus());
    } else if (action === 'getSlots') {
      return json(getSlots());
    }
  } catch (err) {
    return json({ success: false, message: 'Server error: ' + err.message });
  }
  
  return json({ success: false, message: 'Invalid action' });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const action = payload.action;
    const password = payload.password;
    const data = payload.data || {};

    // Handle setStatus (Admin only)
    if (action === 'setStatus') {
      if (password !== ADMIN_PASSWORD) {
        return json({ success: false, message: 'Unauthorized' });
      }
      return json(setRegistrationStatus(payload.isOpen));
    }

    // Handle registration
    if (action === 'register') {
      // Check if registrations are open
      const status = getRegistrationStatus();
      if (!status.isOpen) {
        return json({ success: false, message: 'Registrations are currently closed.' });
      }

      if (!data.name || !data.email || !data.department || !data.year || !data.phone || !data.application) {
        return json({ success: false, message: 'All fields are required.' });
      }

      if (APPS.indexOf(data.application) === -1) {
        return json({ success: false, message: 'Invalid application.' });
      }

      const sheet = getSheet(SHEET_NAME);
      const values = sheet.getDataRange().getValues();

      // Check email uniqueness
      const emailExists = values.some((row, i) => i > 0 && String(row[2]).toLowerCase() === String(data.email).toLowerCase());
      if (emailExists) {
        return json({ success: false, message: 'This email has already been used for registration.' });
      }

      // Count app registrations
      const appCount = values.reduce((count, row, i) => {
        if (i === 0) return count;
        return row[6] === data.application ? count + 1 : count;
      }, 0);

      if (appCount >= MAX_PER_APP) {
        return json({ success: false, message: 'Maximum registrations reached for this app.' });
      }

      sheet.appendRow([
        new Date(),
        data.name,
        data.email,
        data.department,
        data.year,
        data.phone,
        data.application
      ]);

      return json({ success: true, message: 'Registration successful.' });
    }

    return json({ success: false, message: 'Invalid action.' });
  } catch (err) {
    return json({ success: false, message: 'Server error: ' + err.message });
  }
}

function getRegistrationStatus() {
  try {
    const sheet = getSheet(STATUS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    // Assume row 2 has the status (row 1 is header)
    if (data.length > 1) {
      return {
        success: true,
        isOpen: data[1][0] === 'ON' || data[1][0] === true,
        message: 'Status retrieved'
      };
    }
    
    return { success: true, isOpen: false, message: 'Default OFF' };
  } catch (err) {
    Logger.log('Error getting status: ' + err);
    return { success: true, isOpen: false, message: 'Error getting status' };
  }
}

function setRegistrationStatus(isOpen) {
  try {
    const sheet = getSheet(STATUS_SHEET);
    const newValue = isOpen ? 'ON' : 'OFF';
    sheet.getRange(2, 1).setValue(newValue);
    
    return {
      success: true,
      isOpen: isOpen,
      message: 'Status updated to ' + newValue
    };
  } catch (err) {
    return { success: false, message: 'Error updating status: ' + err.message };
  }
}

function getSlots() {
  const sheet = getSheet(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const counts = {};

  APPS.forEach(app => counts[app] = 0);

  values.forEach((row, i) => {
    if (i === 0) return;
    const app = row[6];
    if (counts.hasOwnProperty(app)) counts[app]++;
  });

  const slots = {};
  APPS.forEach(app => {
    const count = counts[app] || 0;
    slots[app] = {
      count: count,
      remaining: Math.max(0, MAX_PER_APP - count),
      full: count >= MAX_PER_APP
    };
  });

  return { success: true, slots: slots };
}

function getSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    if (sheetName === STATUS_SHEET) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(['Status']);
      sheet.appendRow(['OFF']);
    } else if (sheetName === SHEET_NAME) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Department', 'Year', 'Phone', 'Application']);
    }
  }
  
  return sheet;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
