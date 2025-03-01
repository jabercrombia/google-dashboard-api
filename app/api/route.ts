import { google } from 'googleapis';

export async function GET() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process?.env?.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const analytics = google.analyticsdata({
    version: 'v1beta',
    auth: auth,
  });

  try {
    const response = await analytics.properties.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`, // Replace with your GA4 property ID
      requestBody: {
        dateRanges: [
          {
            startDate: '30daysAgo',
            endDate: 'today',
          },
        ],
        dimensions: [{ "name": "city" }],
        metrics: [{ name: 'activeUsers' }],
      },
    });

    return new Response(JSON.stringify(response.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}