// Gmail integration via Replit connector (google-mail)
import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (
    connectionSettings &&
    connectionSettings.settings.expires_at &&
    new Date(connectionSettings.settings.expires_at).getTime() > Date.now()
  ) {
    return connectionSettings.settings.access_token;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) throw new Error('X-Replit-Token not found');

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-mail',
    {
      headers: {
        Accept: 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    }
  )
    .then(res => res.json())
    .then(data => data.items?.[0]);

  const accessToken =
    connectionSettings?.settings?.access_token ||
    connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) throw new Error('Gmail not connected');
  return accessToken;
}

// WARNING: Never cache this client — tokens expire.
export async function getUncachableGmailClient() {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

function makeEmailRaw(to: string, from: string, subject: string, html: string) {
  const lines = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ];
  return Buffer.from(lines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function sendLeadNotification(lead: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  description: string;
  serviceName: string;
}) {
  try {
    const gmail = await getUncachableGmailClient();
    const to = 'Aaronc7240@gmail.com';

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
        <div style="background:#1e293b;padding:20px 24px;border-radius:10px 10px 0 0;">
          <h1 style="color:#ffffff;margin:0;font-size:20px;">&#128276; New Lead — ServiceConnect</h1>
        </div>
        <div style="background:#ffffff;padding:24px;border-radius:0 0 10px 10px;border:1px solid #e2e8f0;">
          <p style="margin:0 0 16px;color:#64748b;font-size:14px;">A new quote request just came in:</p>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;color:#94a3b8;width:140px;">Service</td><td style="padding:8px 0;font-weight:600;color:#0f172a;">${lead.serviceName}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Name</td><td style="padding:8px 0;color:#0f172a;">${lead.customerName}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Phone</td><td style="padding:8px 0;color:#0f172a;">${lead.customerPhone}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Email</td><td style="padding:8px 0;color:#0f172a;">${lead.customerEmail}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Address</td><td style="padding:8px 0;color:#0f172a;">${lead.address}</td></tr>
          </table>

          <div style="margin-top:16px;padding:14px;background:#f1f5f9;border-radius:8px;">
            <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:.05em;">Description</p>
            <p style="margin:0;color:#0f172a;font-size:14px;">${lead.description}</p>
          </div>

          <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;text-align:center;">ServiceConnect · Lead notification</p>
        </div>
      </div>
    `;

    const raw = makeEmailRaw(
      to,
      'serviceconnectlead@gmail.com',
      `New Lead: ${lead.serviceName} — ${lead.customerName}`,
      html
    );

    await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
    console.log(`Lead notification sent to ${to}`);
  } catch (err) {
    // Log but don't crash the request if email fails
    console.error('Failed to send lead notification email:', err);
  }
}
