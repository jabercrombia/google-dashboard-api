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

interface Data {
  rows?: Row[];
}

interface GroupedPageDataProps {
  data: Data;
  classes: string;
}

const GroupedPageData: React.FC<GroupedPageDataProps> = ({ data , classes }) => {
  // Process the data
  const groupedPageData = data?.rows?.reduce((acc: Record<string, number>, row: Row) => {
    const pagePath = row.dimensionValues[4]?.value || "unknown"; // pagePath is at index 4
    const screenPageViews = parseInt(row.metricValues[0]?.value || "0", 10); // screenPageViews is the first metric

    if (!acc[pagePath]) {
      acc[pagePath] = 0; // Initialize if the pagePath doesn't exist
    }
    acc[pagePath] += screenPageViews; // Accumulate screenPageViews

    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={classes}>
      <h2>Page Data</h2>
      <table className='w-full'>
        <thead>
          <tr>
            <th>Page Path</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedPageData || {}).map(([pagePath, views]) => (
            <tr key={pagePath}>
              <td>{pagePath}</td>
              <td>{views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupedPageData;