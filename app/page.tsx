'use client';

import { useEffect, useState } from 'react';


import Location from "./components/location";
import PageData from "./components/pagedata";
import BrowserMetrics from "./components/browsermetrics";
import Graph from "./components/graph";
import TotalActiveUsers from "./components/totalactiveusers";

export default function AnalyticsData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className='container mx-auto dashboard'>
      <div className='mx-[10px] bg-white rounded-sm mt-[20px] p-[10px]'>
        <h1 className='text-4xl'>Analytics Data</h1>
        <p>I integrated the Google Analytics 4 (GA4) Data API into a Next.js application to dynamically fetch and display analytics data, such as active users and sessions, filtered by dimensions like date and country. Using client-side rendering with React hooks, the data was processed and presented in a user-friendly format, enabling real-time insights without the need for server-side rendering.

        </p>
      </div>
      <div className='grid md:grid-cols-2'>
          {data && <TotalActiveUsers data={data}/>}
          {data && <BrowserMetrics data={data} />}
      </div>
      <div className='grid grid-cols-1'>
          {data && <Graph data={data}/>}    
      </div>
      <div className='grid md:grid-cols-2'>
            {data && <Location data={data}/>}
            {data && <PageData data={data}/>}
      </div>
    </div>
  );
}