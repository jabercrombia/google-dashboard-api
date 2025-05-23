'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Location from "./location";
import PageData from "./pagedata";
import GraphPageViews from "./graphpageviews";
import TotalActiveUsers from "./totalactiveusers";
import PieBrowser from './piebrowser';
import AreaChart from './areachart';
import Country from './country';
import Calendar from './calendar';
import { dateString } from '../utils/dateFormat';
import dayjs from 'dayjs';

export default function AnalyticsData() {
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState<{ [key: string]: Date | null }>({
    startDate: null,
    endDate: null,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateUpdate = (name: string, newDate: Date | null) => {
    const updatedDates = { ...selectedDate, [name]: newDate };
    setSelectedDate(updatedDates);
    const params = new URLSearchParams(searchParams.toString());
    if (updatedDates.startDate) {
      params.set('startDate', dayjs(updatedDates.startDate).format('YYYY-MM-DD'));
    }
    if (updatedDates.endDate) {
      params.set('endDate', dayjs(updatedDates.endDate).format('YYYY-MM-DD'));
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

  const date90DaysAgo = new Date();
  date90DaysAgo.setDate(date90DaysAgo.getDate() - 90);
  const format90days = date90DaysAgo;
  const today = new Date();

  return (
    <div className='container mx-auto dashboard'>
      <div className='flex gap-4 mt-[10px] justify-between'>
        <div>
          <Calendar
            label="Start Date"
            name="startDate"
            value={dateParamStart ? dayjs(dateParamStart).toDate() : dayjs(format90days).toDate()}
            onChange={(value) => handleDateUpdate("startDate", value?.toDate() || null)}
          />
        </div>
        <div>
          <Calendar
            label="End Date"
            name="endDate"
            value={dateParamEnd ? dayjs(dateParamEnd).toDate() : dayjs(today).toDate()}
            onChange={(value) => handleDateUpdate("endDate", value?.toDate() || null)}
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
