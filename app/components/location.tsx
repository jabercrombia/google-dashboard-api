import React from 'react';
import { Data, Row } from "./types";

interface CityViewsProps {
  data: Data;
  classes: string;
}

const CityViews: React.FC<CityViewsProps> = ({ data, classes }) => {
  const cityViews: { [key: string]: number } = {};

  // Process the data and filter out rows with "(not set)" city
  data?.rows?.forEach((row) => {
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



  
  type DataItem = Record<string, number>; // Define a type for data items

  const sortedData = cityViewsArray
    .map((item: DataItem): DataItem => {
      const key = Object.keys(item)[0];
      const value = item[key];
      return { [key]: value };
    })
    .sort((a: DataItem, b: DataItem) => {
      const keyA = Object.keys(a)[0];
      const keyB = Object.keys(b)[0];
      return (b[keyB] as number) - (a[keyA] as number); // Sort descending based on values
  });

  console.log(cityViewsArray);
  return (
    <div className={classes}>
      <h2>Location</h2>
      <table className='w-full'>
        <thead>
          <tr>
            <th>City</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((cityObj, index) => {
            const cityName = Object.keys(cityObj)[0];
            const views = cityObj[cityName];
            return (
              <tr key={index}>
                <td>{cityName}</td>
                <td>{views} </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CityViews;