import React from 'react';
import { Data, Row } from "./types";


import {
  Card,
  CardContent,

  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
      <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Active Users</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
      <p className='text-5xl'>{totalActiveUsers}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalActiveUsers;