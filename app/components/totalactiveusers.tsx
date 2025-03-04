import React from 'react';

// Define the types
interface TotalActiveUsersProps {
  data: AnalyticsData;
  classes: string;
}

const TotalActiveUsers: React.FC<TotalActiveUsersProps> = ({ data, classes }) => {
  // Calculate the total active users
  const totalActiveUsers = data?.rows?.reduce((sum: number, row: Row) => {
    return sum + parseInt(row.metricValues[0].value, 10);
  }, 0);

  return (
    <div className={classes}>
      <h2>Total Active Users</h2>
      <p>{totalActiveUsers}</p>
    </div>
  );
};

export default TotalActiveUsers;