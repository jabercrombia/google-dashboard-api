import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
// Define the types
interface DimensionValue {
  value: string;
}

interface MetricValue {
  value: string; // Assuming metric values are strings (e.g., "123")
}

interface Row {
  dimensionValues: DimensionValue[];
  metricValues: MetricValue[];
}

interface DateViewsDataProps {
  rows?: Row[];
  classes?: string;
}

const DateViewsData: React.FC<DateViewsDataProps> = ({ rows, classes }) => {
  // Group dates and aggregate views
  const groupedDateViewsData = rows?.reduce((acc, row) => {
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

  function convertDate(yyyymmdd : string) {
    const year = yyyymmdd.slice(0, 4);
    const month = yyyymmdd.slice(4, 6);
    const day = yyyymmdd.slice(6, 8);

    const date = new Date(`${year}-${month}-${day}`);
    
    const shortMonth = date.toLocaleString('en-US', { month: 'short' });

    return shortMonth;
  }



  return (
    <div className={classes}>
      <h2>Page Views</h2>
      <ul>
        {Object.entries(groupedDateViewsData || {}).map(([date, views]) => (
          <li key={date}>
            <strong>{date}:</strong> {views} views
          </li>
        ))}
      </ul>
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