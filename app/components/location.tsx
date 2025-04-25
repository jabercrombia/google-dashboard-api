import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Data } from "./types";

interface CityViewsProps {
  data: Data;
}

const CityViews: React.FC<CityViewsProps> = ({ data }) => {
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
  }).slice(0, 10); // Get top 10 cities

  return (
    <div>
      <Card className="h-full flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle><h2>Top 10 Visited Cities</h2></CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">City</TableHead>
                <TableHead>Visitors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {sortedData.map((cityObj, index) => {
                  const cityName = Object.keys(cityObj)[0];
                  const views = cityObj[cityName];
                  return (
                    <TableRow key={index}>
                      <TableCell className='w-1/2'>{cityName}</TableCell>
                      <TableCell>{views} </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CityViews;