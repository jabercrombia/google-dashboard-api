'use client';

import { useEffect, useState } from 'react';


import Location from "./components/location";
import PageData from "./components/pagedata";
import BrowserMetrics from "./components/browsermetrics";
import DateViewsMetrics from "./components/dateviewmetrics";

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


// const totalActiveUsers = data?.rows?.reduce((sum: number, row : any) => {
//     return sum + parseInt(row.metricValues[0].value, 10);
// }, 0);


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
          {/* <p className='text-5xl'>{totalActiveUsers}</p> */}
        </div>
        <div className='drop-shadow-sm rounded-sm p-[10px] m-[10px] bg-white'>
          <BrowserMetrics rows={data?.rows} />
        </div>
      </div>
      <div className='grid grid-cols-1'>
    
         
          <DateViewsMetrics rows={data?.rows} classes="bg-white m-[10px] p-[10px] drop-shadow-sm rounded-sm" />
          {/* <Box sx={{ width: '100%' }}>
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
          </Box> */}
        
       
       
      </div>
      <div className='grid md:grid-cols-2'>
            <Location data={result} classes="bg-white p-[10px] m-[10px] rounded-sm dropshadow-sm"/>
            <PageData data={data} classes="bg-white p-[10px] m-[10px] rounded-sm dropshadow-sm"/>
      </div>
    </div>
  );
}