import React from 'react';

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

interface BrowserDataProps {
  rows?: Row[];
}

const BrowserData: React.FC<BrowserDataProps> = ({ rows }) => {
  // Group browsers and aggregate active users
  const groupedBrowserData = rows?.reduce((acc, row) => {
    const browser = row.dimensionValues[3]?.value || "Unknown"; // Browser is at index 3
    const activeUsers = parseInt(row.metricValues[0]?.value || "0", 10); // Active users is the first metric

    if (!acc[browser]) {
      acc[browser] = 0; // Initialize if the browser doesn't exist
    }
    acc[browser] += activeUsers; // Accumulate active users

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