'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Location from "./components/location";
import PageData from "./components/pagedata";
import GraphPageViews from "./components/graphpageviews";
import TotalActiveUsers from "./components/totalactiveusers";
import PieBrowser from './components/piebrowser';
import AreaChart from './components/areachart';
import Country from './components/country';
import Calendar from './components/calendar';
import { dateString } from './utils/dateFormat';

export default function AnalyticsData() {
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState<{ [key: string]: string | null }>({
    startDate: null,
    endDate: null,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateUpdate = (name: string, newDate: string | null) => {
    const updatedDates = { ...selectedDate, [name]: newDate };
    setSelectedDate(updatedDates);

    const params = new URLSearchParams(searchParams.toString());
    if (updatedDates.startDate) {
      params.set('startDate', updatedDates.startDate);
    }
    if (updatedDates.endDate) {
      params.set('endDate', updatedDates.endDate);
    }
    router.push(`?${params.toString()}`);
  };

  const fetchData = async (params: URLSearchParams) => {
    try {
      const res = await fetch(`/api/?${params.toString()}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const dateParamStart = searchParams.get('startDate');
  const dateParamEnd = searchParams.get('endDate');

  useEffect(() => {


    const params = new URLSearchParams();

    if (dateParamStart) {
      params.set('startDate', dateParamStart);
    } else {
      const defaultStart = new Date();
      defaultStart.setDate(defaultStart.getDate() - 90);
      params.set('startDate', dateString(defaultStart));
    }

    if (dateParamEnd) {
      params.set('endDate', dateParamEnd);
    } else {
      const today = new Date();
      params.set('endDate', dateString(today));
    }

    router.push(`?${params.toString()}`);
    fetchData(params);
  }, [searchParams]);


  //get start date and end date values
  const date90DaysAgo = new Date();
  date90DaysAgo.setDate(date90DaysAgo.getDate() - 90);

  const today = dateString(new Date());

  return (
    <div className='container mx-auto dashboard'>
      <div className='flex gap-4 mt-[10px] justify-between'>
        <div>
          <Calendar
            label="Start Date"
            name="startDate"
            value={dateParamStart ? dateParamStart : date90DaysAgo }
            onDateChange={handleDateUpdate}
          />
        </div>
        <div>
          <Calendar
            label="End Date"
            name="endDate"
            value={dateParamEnd ? dateParamEnd : today }
            onDateChange={handleDateUpdate}
          />
        </div>
      </div>

      {data && (
        <>
          <div className='grid md:grid-cols-1 gap-4 mt-[10px]'>
            <TotalActiveUsers data={data} />
          </div>
          <div className='grid md:grid-cols-3 gap-4 mt-[10px]'>
            <PieBrowser data={data} />
            <Location data={data} />
            <Country data={data} />
          </div>
          <div className='grid md:grid-cols-2 gap-4 mt-[10px]'>
            <PageData data={data} />
            <AreaChart data={data} />
          </div>
          <div className='mt-[10px]'>
            <GraphPageViews data={data} />
          </div>
        </>
      )}
    </div>
  );
}
