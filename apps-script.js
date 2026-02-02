const SHEET_NAME = 'Registrations';
const MAX_PER_APP = 2;
const APPS = ['WhatsApp', 'Canva', 'Google Pay', 'Instagram', 'ChatGPT'];

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'slots';
  if (action === 'slots') {
    return ContentService
      .createTextOutput(JSON.stringify(getSlots()))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ success: false, message: 'Invalid action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const data = payload.data || {};

    if (!data.name || !data.email || !data.department || !data.year || !data.phone || !data.application) {
      return json({ success: false, message: 'All fields are required.' });
    }

    if (APPS.indexOf(data.application) === -1) {
      return json({ success: false, message: 'Invalid application.' });
    }

    const sheet = getSheet();
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
  } catch (err) {
    return json({ success: false, message: 'Server error: ' + err.message });
  }
}

function getSlots() {
  const sheet = getSheet();
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

  return { slots };
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet not found: ' + SHEET_NAME);
  return sheet;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
