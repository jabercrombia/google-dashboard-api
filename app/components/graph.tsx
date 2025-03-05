import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
import { Data } from "./types";

interface DateViewsDataProps {
  data: Data;
}


const DateViewsData: React.FC<DateViewsDataProps> = ({ data }) => {
  // Group dates and aggregate views
  const groupedDateViewsData = data?.rows?.reduce((acc: Record<string, number>, row: Row) => {
    const date = row.dimensionValues[5]?.value || "Unknown"; // Date is at index 5
    const views = parseInt(row.metricValues[1]?.value || "0", 10); // Screen page views is the second metric

    if (!acc[date]) {
      acc[date] = 0; // Initialize if the date doesn't exist
    }
    acc[date] += views; // Accumulate views

    return acc;
  }, {} as Record<string, number>);

  const formattedData = Object.entries(groupedDateViewsData || {}).map(([date, views]) => ({
    date,
    views,
  }));
console.log('formattedData');
  console.log(formattedData);

  function convertDate(yyyymmdd : string) {
    const year = yyyymmdd.slice(0, 4);
    const month = yyyymmdd.slice(4, 6);
    const day = yyyymmdd.slice(6, 8);

    const date = new Date(`${year}-${month}-${day}`);
    
    const shortMonth = date.toLocaleString('en-US', { month: 'short' });

    return shortMonth;
  }



  return (
    <div>
      <h2>Page Views</h2>
      <Box sx={{ width: '100%' }}>
        <BarChart className='mx-auto'
          xAxis={[{ scaleType: 'band', dataKey: 'date', valueFormatter: (date, context) =>
            context.location === 'tick'
              ? `${convertDate(date)} \n  ${date.slice(-2)}` : ''
            }]}
          series={[
            {
              dataKey: 'views'
            },
          ]}
          dataset={formattedData}
          width={1000}
          height={300}
        />
      </Box>
    </div>
  );
};

export default DateViewsData;