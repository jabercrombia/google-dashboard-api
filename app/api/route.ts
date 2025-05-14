import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);

  console.log(searchParams.get('startDate'));
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Return a response (must be NextResponse in App Router)
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
            startDate: startDate ?? '7daysAgo',  // fallback just in case
            endDate: endDate ?? 'today',
          },
        ],
        "dimensions": [
      {
        "name": "country"
      },
      {
        "name": "region"
      },
      {
        "name": "city"
      },
      {
        "name": "browser"
      },
      {
        "name": "pageTitle"
      },
      {
        "name": "date"
      },
      {
        "name": "eventName"
      },
    ],
        metrics: [
          { name: 'activeUsers' },
          {name: 'screenPageViews'},
          {name: 'eventCount'}
        ],
        // excluding specific city till its excluded in ga4 reports
        "dimensionFilter": {
          "notExpression": {
            "filter": {
              "fieldName": "city",
              "stringFilter": {
                "value": process.env.GA4_EXCLUDE_CITY
              }
            }
          }
        }
      },
    });

    return new Response(JSON.stringify(response.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}