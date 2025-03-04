import React from 'react';

// Define the types
interface TotalActiveUsersProps {
  data: AnalyticsData;
}

const TotalActiveUsers: React.FC<TotalActiveUsersProps> = ({ data }) => {
  // Calculate the total active users
  const totalActiveUsers = data?.rows?.reduce((sum: number, row: Row) => {
    return sum + parseInt(row.metricValues[0].value, 10);
  }, 0);

  return (
    <div>
      <h2>Total Active Users</h2>
      <p>{totalActiveUsers}</p>
    </div>
  );
};

export default TotalActiveUsers;