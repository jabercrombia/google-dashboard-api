'use client';

import { useEffect, useState } from 'react';
import { UsersRound } from 'lucide-react';
export default function AnalyticsData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  console.log(data);

// Filter out rows with (not set) and invalid rows
const filteredObjData = data?.rows.filter(row => {
  // Check if dimensionValues and metricValues exist and are arrays
  if (!Array.isArray(row.dimensionValues) || !Array.isArray(row.metricValues)) {
      return false; // Skip this row
  }
  // Check if any dimension value is (not set)
  return !row.dimensionValues.some(dim => dim.value === "(not set)");
});

    // Consolidate data by city
    const consolidatedData = filteredObjData?.reduce((acc, row) => {
      const city = row.dimensionValues[2]?.value;
      if (!city) {
          return acc; // Skip if city is missing
      }

      if (!acc[city]) {
          acc[city] = {
              dimensionValues: row.dimensionValues,
              metricValues: row.metricValues.map(metric => parseInt(metric.value, 10))
          };
      } else {
          acc[city].metricValues = acc[city].metricValues.map((metric, index) => 
              metric + parseInt(row.metricValues[index]?.value || 0, 10)
          );
      }
      return acc;
  }, {});

  const result = Object.values(consolidatedData || {});

console.log('filter');
console.log(result);
console.log('filter up');


// // Consolidate data by city
// const consolidatedData = filteredObjData?.rows.reduce((acc, row) => {
//   const city = row.dimensionValues[2].value; // Assuming city is the 3rd dimension
//   if (!acc[city]) {
//       acc[city] = {
//           dimensionValues: row.dimensionValues,
//           metricValues: row.metricValues.map(metric => parseInt(metric.value, 10))
//       };
//   } else {
//       acc[city].metricValues = acc[city].metricValues.map((metric, index) => 
//           metric + parseInt(row.metricValues[index].value, 10)
//       );
//   }
//   return acc;
// }, {});

// const result = Object.values(consolidatedData);

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
      <div className='grid grid-cols-2'>
        <div className='drop-shadow-sm'>
        <UsersRound />
          <p className='text-5xl'>{totalActiveUsers}</p>
          <p>Users</p>
        </div>
        <div className='drop-shadow-sm'>
        <h2 className='capitalize'>Most used browsers</h2>
          <ul>
            {Object.entries(browserMetrics).map(([browser, activeUsers]) => (
                <li key={browser}>
                    <strong>{browser}:</strong> {activeUsers}
                </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='grid grid-cols-2'>
        <div className='drop-shadow-sm'>
          <h2>Location</h2>
          <table className='table-auto container'>
            <thead className='text-left'>
              <tr>
                <th>Country</th>
                <th>Region</th>
                <th>City</th>
                <th>Users</th>
              </tr>
            </thead>
            <tbody>
          {result?.map((elem : any , index: any) => (
            <tr key={index}>
              <td>{elem.dimensionValues[0].value}</td>
              <td>{elem.dimensionValues[1].value}</td>
              <td>{elem.dimensionValues[2].value}</td>
              <td>{elem.metricValues[0]}</td>
            </tr>
            )
          )}
          </tbody>
          </table>
        </div>
      </div>
 
      
    </div>
  );
}