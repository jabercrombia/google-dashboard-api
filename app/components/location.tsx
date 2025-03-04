import React from 'react';

// Define the types
interface DimensionValue {
  value: string;
}

interface MetricValue {
  value: string;
}

interface Row {
  dimensionValues: DimensionValue[];
  metricValues: MetricValue[];
}

interface AnalyticsData {
  rows: Row[];
}

interface CityViewsProps {
  data: AnalyticsData;
}

const CityViews: React.FC<CityViewsProps> = ({ data }) => {
  const cityViews: { [key: string]: number } = {};

  // Process the data and filter out rows with "(not set)" city
  data?.rows.forEach((row) => {
    const city = row.dimensionValues[2].value; // City is at index 2

    // Skip rows where the city is "(not set)"
    if (city === '(not set)') {
      return;
    }

    const views = parseInt(row.metricValues[1].value, 10); // screenPageViews is at index 1

    // If the city already exists in the object, add the views
    if (cityViews[city]) {
      cityViews[city] += views;
    } else {
      // Otherwise, initialize the city with the views
      cityViews[city] = views;
    }
  });

  // Convert to an array of objects
  const cityViewsArray: { [key: string]: number }[] = Object.keys(cityViews).map((city) => ({
    [city]: cityViews[city],
  }));

  return (
    <div>
      <h1>City Views</h1>
      <ul>
        {cityViewsArray.map((cityObj, index) => {
          const cityName = Object.keys(cityObj)[0];
          const views = cityObj[cityName];
          return (
            <li key={index}>
              <strong>{cityName}</strong>: {views} views
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CityViews;