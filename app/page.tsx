'use client';

import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';

import Location from "./components/location";
import PageData from "./components/pagedata";
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

  interface DimensionValue {
    value: string;
  }
  
  interface MetricValue {
    value: number;
  }
  
  interface DataItem {
    dimensionValues: DimensionValue[];
    metricValues: MetricValue[];
  }
  
  const update_data: DataItem[] = data;
  const dateFormatString = (a:string) => a.substring(6, 8);
  const accumulateActiveUsersByDate = (data:DataItem[]): { date: string; activeUsers: number }[] => {
    const result: { [date: string]: number } = {};
  
    data?.rows.forEach((item : any) => {
      let date = item.dimensionValues[item.dimensionValues.length - 1].value; // Extract date
      date = dateFormatString(date);
      const activeUsers = parseInt(item.metricValues[0].value); // Extract activeUsers
  
      if (result[date]) {
        result[date] += activeUsers; // Accumulate activeUsers for the date
      } else {
        result[date] = activeUsers; // Initialize activeUsers for the date
      }
    });
  
    // Convert the result object into an array of objects
    console.log(result);
    return Object.keys(result).map((date) => ({
      date,
      activeUsers: result[date],
    }));
  };
  
  const accumulatedData = accumulateActiveUsersByDate(update_data);
  
  console.log(accumulatedData);

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

interface DataItem {
  dimensionValues: { value: string }[];
  metricValues: number[];
}

  return (
    <div className='container mx-auto'>
      <div className='mx-[10px] bg-white rounded-sm mt-[20px] p-[10px]'>
        <h1 className='text-4xl'>Analytics Data</h1>
        <p>I integrated the Google Analytics 4 (GA4) Data API into a Next.js application to dynamically fetch and display analytics data, such as active users and sessions, filtered by dimensions like date and country. Using client-side rendering with React hooks, the data was processed and presented in a user-friendly format, enabling real-time insights without the need for server-side rendering.

        </p>
      </div>
      <div className='grid md:grid-cols-2'>
        <div className='drop-shadow-sm rounded-sm p-[10px] m-[10px] bg-white'>
        <h2>Total Users</h2>
          <p className='text-5xl'>{totalActiveUsers}</p>
        </div>
        <div className='drop-shadow-sm rounded-sm p-[10px] m-[10px] bg-white'>
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
      <div className='grid grid-cols-1'>
        <div className='bg-white m-[10px] p-[10px] drop-shadow-sm rounded-sm'>
          <h2>Page Views</h2>
          <Box sx={{ width: '100%' }}>
            <BarChart className='mx-auto'
              xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
              series={[
                {
                  dataKey: 'activeUsers'
                },
              ]}
              dataset={accumulatedData}
              width={1000}
              height={300}
            />
          </Box>
        
        </div>
       
      </div>
      <div className='grid md:grid-cols-2'>
            <Location data={result} classes="bg-white p-[10px] m-[10px] rounded-sm dropshadow-sm"/>
            <PageData data={data} classes="bg-white p-[10px] m-[10px] rounded-sm dropshadow-sm"/>
      </div>
    </div>
  );
}