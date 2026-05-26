const CONFIG = {
  // Optional: paste an existing Google Sheet ID here. Leave blank to create one automatically.
  SPREADSHEET_ID: "",
  SPREADSHEET_NAME: "Colours & Patterns - Website Form Leads",
  SCRIPT_PROPERTY_SPREADSHEET_ID: "COLOURS_PATTERNS_LEADS_SPREADSHEET_ID",
  SHEET_NAME: "Website Leads",
  TEAM_EMAIL: "design@coloursandpatterns.in",
  AUTO_REPLY_FROM_NAME: "Colours & Patterns",
  SEND_TEAM_EMAIL: true,
  SEND_AUTO_REPLY: true
};

function doGet() {
  return jsonResponse_({
    ok: true,
    message: "Colours & Patterns website lead endpoint is live."
  });
}

function doPost(e) {
  try {
    const submission = parseSubmission_(e);
    const sheet = getLeadSheet_();
    ensureHeader_(sheet);
    sheet.appendRow(toLeadRow_(submission));

    if (CONFIG.SEND_TEAM_EMAIL) {
      sendTeamNotification_(submission);
    }

    if (CONFIG.SEND_AUTO_REPLY && submission.email) {
      sendAutoReply_(submission);
    }

    return jsonResponse_({
      ok: true,
      message: "Lead captured successfully."
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: error && error.message ? error.message : "Unknown error"
    });
  }
}

function parseSubmission_(e) {
  const params = e && e.parameter ? e.parameter : {};
  const multi = e && e.parameters ? e.parameters : {};
  const services = multi.services ? multi.services.join(", ") : (params.services || "");

  return {
    timestamp: new Date(),
    name: clean_(params.name),
    company: clean_(params.company),
    email: clean_(params.email),
    phone: clean_(params.phone),
    city: clean_(params.city),
    industry: clean_(params.industry),
    services: clean_(services),
    message: clean_(params.message),
    referral: clean_(params.referral),
    sourcePage: clean_(params.sourcePage),
    userAgent: clean_(params.userAgent)
  };
}

function getLeadSheet_() {
  const spreadsheet = getLeadSpreadsheet_();

  return spreadsheet.getSheetByName(CONFIG.SHEET_NAME) || spreadsheet.insertSheet(CONFIG.SHEET_NAME);
}

function getLeadSpreadsheet_() {
  const configuredId = clean_(CONFIG.SPREADSHEET_ID);

  if (configuredId) {
    return SpreadsheetApp.openById(configuredId);
  }

  const properties = PropertiesService.getScriptProperties();
  const savedId = properties.getProperty(CONFIG.SCRIPT_PROPERTY_SPREADSHEET_ID);

  if (savedId) {
    try {
      return SpreadsheetApp.openById(savedId);
    } catch (error) {
      properties.deleteProperty(CONFIG.SCRIPT_PROPERTY_SPREADSHEET_ID);
    }
  }

  const spreadsheet = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
  properties.setProperty(CONFIG.SCRIPT_PROPERTY_SPREADSHEET_ID, spreadsheet.getId());
  return spreadsheet;
}

function ensureHeader_(sheet) {
  const headers = [
    "Timestamp",
    "Full Name",
    "Business / Company",
    "Email",
    "Phone / WhatsApp",
    "City / Location",
    "Industry",
    "Services of Interest",
    "Project Brief",
    "How They Heard About Us",
    "Source Page",
    "User Agent"
  ];

  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeader = firstRow.some(Boolean);

  if (!hasHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function toLeadRow_(submission) {
  return [
    submission.timestamp,
    submission.name,
    submission.company,
    submission.email,
    submission.phone,
    submission.city,
    submission.industry,
    submission.services,
    submission.message,
    submission.referral,
    submission.sourcePage,
    submission.userAgent
  ];
}

function sendTeamNotification_(submission) {
  const subject = "New website inquiry - " + (submission.company || submission.name || "Colours & Patterns");
  const body = [
    "New inquiry from the Colours & Patterns website.",
    "",
    "Full Name: " + submission.name,
    "Business / Company: " + submission.company,
    "Email: " + submission.email,
    "Phone / WhatsApp: " + submission.phone,
    "City / Location: " + submission.city,
    "Industry: " + submission.industry,
    "Services of Interest: " + submission.services,
    "How They Heard About Us: " + submission.referral,
    "Source Page: " + submission.sourcePage,
    "",
    "Project Brief:",
    submission.message || "Not shared"
  ].join("\n");

  MailApp.sendEmail({
    to: CONFIG.TEAM_EMAIL,
    subject: subject,
    body: body,
    replyTo: submission.email || CONFIG.TEAM_EMAIL,
    name: CONFIG.AUTO_REPLY_FROM_NAME
  });
}

function sendAutoReply_(submission) {
  const subject = "We received your inquiry - Colours & Patterns";
  const body = [
    "Hi " + (submission.name || "there") + ",",
    "",
    "Thank you for reaching out to Colours & Patterns. We have received your inquiry and will respond within one business day.",
    "",
    "Summary:",
    "Business / Company: " + (submission.company || "Not shared"),
    "City / Location: " + (submission.city || "Not shared"),
    "Services of Interest: " + (submission.services || "Not selected"),
    "",
    "If this is urgent, you can WhatsApp us at +91 79804 36393.",
    "",
    "Regards,",
    "Colours & Patterns"
  ].join("\n");

  MailApp.sendEmail({
    to: submission.email,
    subject: subject,
    body: body,
    name: CONFIG.AUTO_REPLY_FROM_NAME
  });
}

function clean_(value) {
  return String(value || "").trim();
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
