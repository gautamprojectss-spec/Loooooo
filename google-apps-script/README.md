# Colours & Patterns Form Apps Script

This script receives the Let's Talk form, creates or reuses a Google Sheet in your Drive, saves every inquiry there, emails the team, and sends an auto-reply to the visitor.

## Setup

1. Go to https://script.google.com and click **New project**.
2. Delete any placeholder code and paste the entire contents of `colours-patterns-google-form-app-script.gs`.
3. Click **Deploy > New deployment > Web app**.
4. Set **Execute as** to your Google account.
5. Set **Who has access** to **Anyone**. Do not use "Anyone with Google Account" or an organization-only setting.
6. Click **Deploy** and authorize the requested permissions.
7. Copy the Web App URL into `lets-talk.html` in the `data-apps-script-url` value.

Use the public URL format:

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

If Google gives you a domain URL like this:

```text
https://script.google.com/a/macros/yourdomain.com/s/YOUR_DEPLOYMENT_ID/exec
```

use this format in the website instead:

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## Quick Check

Open the Web App URL in an incognito/private browser window. It must show a small JSON message with `ok: true`.

If it opens a Google sign-in page, the web app is still private and the website form will not save to Drive. Go to **Deploy > Manage deployments > Edit**, set access to **Anyone**, select **New version**, and deploy again.

## What Happens On First Submission

- If `SPREADSHEET_ID` is blank, the script creates a Google Sheet called **Colours & Patterns - Website Form Leads** in your Drive.
- The script stores the created Sheet ID in Script Properties, so future leads keep going to the same Sheet.
- If you want to use an existing Sheet, paste that Sheet ID into `SPREADSHEET_ID`.
- Each lead is added to the `Website Leads` sheet and an email is sent to the team.

## Re-Deploying After Edits

If you update the script, go to **Deploy > Manage deployments**, select the existing deployment, click **Edit**, select **New version**, and deploy. The URL normally stays the same.
