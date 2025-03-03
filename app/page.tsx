'use client';

import { useEffect, useState } from 'react';
import { UsersRound, Earth } from 'lucide-react';
export default function AnalyticsData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  console.log(data);

// group cities and countries
  const groupedDatalol = data?.rows.reduce((acc: any, row: any) => {
    const country = row.dimensionValues[0]?.value || "Unknown";
    const region = row.dimensionValues[1]?.value || "Unknown";
    const city = row.dimensionValues[2]?.value || "Unknown";

    // Initialize the nested structure if it doesn't exist
    if (!acc[country]) {
        acc[country] = {};
    }
    if (!acc[country][region]) {
        acc[country][region] = {};
    }
    if (!acc[country][region][city]) {
        acc[country][region][city] = {
            screenPageViews: 0,
            activeUsers: 0,
        };
    }

    // Sum up the metrics
    const screenPageViews = parseInt(row.metricValues[0]?.value, 10) || 0;
    const activeUsers = parseInt(row.metricValues[1]?.value, 10) || 0;

    acc[country][region][city].screenPageViews += screenPageViews;
    acc[country][region][city].activeUsers += activeUsers;

    return acc;
}, {});

console.log(groupedDatalol);


const totalActiveUsers = data?.rows?.reduce((sum: number, row : any) => {
    return sum + parseInt(row.metricValues[0].value, 10);
}, 0);

// browser data
const browserMetrics: { [key: string]: number } = {};

data?.rows?.forEach((row: any) => {
    const browser = row.dimensionValues[3].value; // Browser is at index 3
    const activeUsers = parseInt(row.metricValues[0].value, 10);

    if (browserMetrics[browser]) {
        browserMetrics[browser] += activeUsers;
    } else {
        browserMetrics[browser] = activeUsers;
    }
});

const filteredData = data?.rows.filter((row : any) => {
  // Check if any dimensionValue is "(not set)"
  const hasNotSetDimension = row.dimensionValues.some(
      (dimension : string) => dimension?.value === "(not set)"
  );

  // Check if any metricValue is "(not set)"
  const hasNotSetMetric = row.metricValues.some(
      (metric : number) => metric?.value === "(not set)"
  );

  // Keep the row only if neither condition is true
  return !hasNotSetDimension && !hasNotSetMetric;
});

console.log(filteredData);

// group pagepath and pageviews
const groupedData = data?.rows?.reduce((acc :any, row :any) => {
  const pagePath = row.dimensionValues[4].value; // pagePath is at index 4
  const screenPageViews = parseInt(row.metricValues[0].value, 10); // screenPageViews is the first metric

  if (!acc[pagePath]) {
      acc[pagePath] = 0; // Initialize if the pagePath doesn't exist
  }
  acc[pagePath] += screenPageViews; // Accumulate screenPageViews

  return acc;
}, {});

  return (
    <div className='container mx-auto'>
      <h1 className='text-4xl'>Analytics Data</h1>
      <div className='grid grid-cols-3'>
        <div>
        <UsersRound />
          <p className='text-5xl'>{totalActiveUsers}</p>
          <p>Users</p>
        </div>
        <div>
        <Earth />
          <ul>
            {Object.entries(browserMetrics).map(([browser, activeUsers]) => (
                <li key={browser}>
                    <strong>{browser}:</strong> {activeUsers}
                </li>
            ))}
          </ul>
        </div>
        <div>
          {totalActiveUsers}
        </div>
      </div>
      <table className='table-auto container'>
        <thead className='text-left'>
          <tr>
            <th>Country</th>
            <th>Region</th>
            <th>City</th>
            <th>Active Users</th>
          </tr>
        </thead>
        <tbody>
      {data?.rows.map((elem : any , index: any) => (
      <tr key={index}>
      <td>{elem.dimensionValues[0].value}</td>
      <td>{elem.dimensionValues[1].value}</td>
      <td>{elem.dimensionValues[2].value}</td>
      <td>{elem.metricValues[0].value}</td>
      </tr>
        )
      )}
      </tbody>
      </table>
      
    </div>
  );
}