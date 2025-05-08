'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


import Location from "./components/location";
import PageData from "./components/pagedata";
import GraphPageViews from "./components/graphpageviews";
import TotalActiveUsers from "./components/totalactiveusers";
import ModalPassword from './components/modalpassword';
import PieBrowser from './components/piebrowser';
import AreaChart from './components/areachart';
import Country from './components/country';

import Calendar from './components/calendar';
import {dateString}  from './utils/dateFormat';
import { start } from 'repl';

export default function AnalyticsData() {

  const [data, setData] = useState(null);
  const [date, setDate] = useState<{ startDate: string; endDate: string }>({ startDate: '', endDate: '' });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasRedirected, setHasRedirected] = useState(false);

  const handlePasswordSubmit = () => {
    setIsAuthenticated(true);
  };

  const handleDateUpdate = (name: string, newDate: Date | null) => {
    setSelectedDate(newDate);
    console.log('newDate', newDate);
    if (newDate) {
      console.log('Parent received date:', dateString(newDate));
    } else {
      console.log('Parent received date: null');
    }
  };

  useEffect(() => {
    const dateParamStartDate = searchParams.get('startDate');
    const dateParamEndDate = searchParams.get('endDate');

    const todaysDate = new Date();

    // get previous 90 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    const params = new URLSearchParams(searchParams.toString());

    params.set('startDate', dateString(startDate));
    params.set('endDate', dateString(todaysDate));

    // This pushes the new URL with updated params
    router.push(`?${params.toString()}`);
    if (dateParamStartDate && dateParamEndDate) {
      setDate({
        startDate: dateParamStartDate,
        endDate: dateParamEndDate,
      });

    }

   
      fetch(`/api/?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((error) => console.error(error));
    
  }, [searchParams]);

  return (
    
    <>

      <div className='container mx-auto dashboard'>
        {data &&
        <div className='flex gap-4 mt-[10px] justify-between'>
          <div>
            <Calendar label="Start Date" name="startDate" value={date.startDate} onDateChange={handleDateUpdate} />
          </div>
          <div>
            <Calendar label="End Date" name="endDate"  value={date.endDate} onDateChange={handleDateUpdate} />
          </div>
        </div>
        }
        <div className='grid md:grid-cols-1 gap-4 mt-[10px]'>
          {data && <TotalActiveUsers data={data}/>}
        </div>
        <div className='grid md:grid-cols-3 gap-4 mt-[10px]'>
            {data && <PieBrowser data={data}/>}
            {data && <Location data={data}/>}
            {data && <Country data={data}/>}
        </div>
        <div className='grid md:grid-cols-2 gap-4 mt-[10px]'>
            {data && <PageData data={data}/>}
            {data && <AreaChart data={data}/>}    
        </div>
        <div className='mt-[10px]'>
          {data && <GraphPageViews data={data}/>}  
        </div>
    </div>
    
    </>
  );
}