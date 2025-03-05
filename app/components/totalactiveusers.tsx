import React from 'react';
import { Data, Row } from "./types";

// Define the types
interface TotalActiveUsersProps {
  data: Data;
  classes: string;
}

const TotalActiveUsers: React.FC<TotalActiveUsersProps> = ({ data, classes }) => {

  const totalActiveUsers = data?.rows?.reduce((sum: number, row: Row) => {
    return sum + parseInt(row.metricValues[0].value, 10);
  }, 0);

  return (
    <div className={classes}>
      <h2>Total Active Users</h2>
      <p className='text-5xl'>{totalActiveUsers}</p>
    </div>
  );
};

export default TotalActiveUsers;