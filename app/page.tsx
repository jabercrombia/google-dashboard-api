'use client';

import { useEffect, useState } from 'react';


import Location from "./components/location";
import PageData from "./components/pagedata";
import GraphPageViews from "./components/graphpageviews";
import TotalActiveUsers from "./components/totalactiveusers";
import ModalPassword from './components/modalpassword';
import PieBrowser from './components/piebrowser';
import AreaChart from './components/areachart';

export default function AnalyticsData() {
  const [data, setData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordSubmit = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    fetch('/api/')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
    {!isAuthenticated ? (
      <div className='container mx-auto dashboard'>
       
      <div className='grid md:grid-cols-1 gap-4 mt-[10px]'>
        {data && <TotalActiveUsers data={data}/>}
      </div>
      <div className='grid md:grid-cols-2 gap-4 mt-[10px]'>
          {data && <PieBrowser data={data}/>}
          {data && <Location data={data}/>}
      </div>
      <div className='grid md:grid-cols-2 gap-4 mt-[10px]'>
          {data && <PageData data={data}/>}
          {data && <AreaChart data={data}/>}    
      </div>
      <div className='mt-[10px]'>
        {data && <GraphPageViews data={data}/>}  
      </div>
    </div>
    ) : (
      <ModalPassword onPasswordSubmit={handlePasswordSubmit} />
    )}
    </>
  );
}