import React from 'react';
import { Data, Row } from "./types";

// Define the types
interface TotalActiveUsersProps {
  data: Data;
}

const TotalActiveUsers: React.FC<TotalActiveUsersProps> = ({ data }) => {

  const totalActiveUsers = data?.rows?.reduce((sum: number, row: Row) => {
    return sum + parseInt(row.metricValues[0].value, 10);
  }, 0);

  return (
    <div>
      <h2>Total Active Users</h2>
      <p className='text-5xl'>{totalActiveUsers}</p>
    </div>
  );
};

export default TotalActiveUsers;