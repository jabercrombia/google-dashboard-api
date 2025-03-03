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
let filteredObjData = data?.rows.filter(row => {
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


  function compare( a, b ) {
    if ( a.metricValues[0] > b.metricValues[0] ){
      return -1;
    }
    if ( a.metricValues[0] < b.metricValues[0] ){
      return 1;
    }
    return 0;
  }
  
 
console.log('filter');
console.log( result.sort( compare ));
console.log('filter up');


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
let groupedPageData = data?.rows?.reduce((acc :any, row :any) => {
  const pagePath = row.dimensionValues[4].value; // pagePath is at index 4
  const screenPageViews = parseInt(row.metricValues[0].value, 10); // screenPageViews is the first metric

  if (!acc[pagePath]) {
      acc[pagePath] = 0; // Initialize if the pagePath doesn't exist
  }
  acc[pagePath] += screenPageViews; // Accumulate screenPageViews

  return acc;
}, {});

groupedPageData =  Object.entries(groupedPageData || {});

console.log(groupedPageData);

  return (
    <div className='container mx-auto'>
      <h1 className='text-4xl'>Analytics Data</h1>
      <div className='grid grid-cols-2'>
        <div className='drop-shadow-sm'>
        <h2>Total Users</h2>
          <p className='text-5xl'>{totalActiveUsers}</p>
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
        <div className='drop-shadow-sm'>
        <table className='table-auto container'>
            <thead className='text-left'>
              <tr>
                <th>Page Title</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
          {groupedPageData?.map((elem : any , index: any) => (
            <tr key={index}>
              <td>{elem[0]}</td>
              <td>{elem[1]}</td>
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