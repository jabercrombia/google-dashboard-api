import React from 'react';

import { Data, Row } from "./types";


interface BrowserDataProps {
  data?: Data;
}

const BrowserData: React.FC<BrowserDataProps> = ({ data }) => {
  // Group browsers and aggregate active users
  const groupedBrowserData = data?.rows?.reduce((acc: Record<string, number>, row: Row) => {
    const browser = row.dimensionValues[3]?.value || "Unknown"; // Browser is at index 3
    const activeUsers = parseInt(row.metricValues[0]?.value || "0", 10); // Active users is the first metric

    if (!acc[browser]) {
      acc[browser] = 0;
    }
    acc[browser] += activeUsers;

    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h2>Browser Data</h2>
      <ul>
        {Object.entries(groupedBrowserData || {}).map(([browser, activeUsers]) => (
          <li key={browser}>
            <strong>{browser}:</strong> {activeUsers} active users
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrowserData;