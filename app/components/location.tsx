import React from 'react';

interface DataItem {
  dimensionValues: { value: string }[];
  metricValues: number[];
}

interface MyComponentProps {
  data?: DataItem[]; 
  classes?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ data, classes }) => {
  return (
    <div className={classes}>
        <h2>Location</h2>
        <table className='w-full'>
            <thead className='text-left'>
              <tr>
                <th>Country</th>
                <th>Region</th>
                <th>City</th>
                <th>Users</th>
              </tr>
            </thead>
            <tbody>

                {data?.map((elem: DataItem, index: number) => (
                <tr key={index}>
                    <td>{elem.dimensionValues[0].value}</td>
                    <td>{elem.dimensionValues[1].value}</td>
                    <td>{elem.dimensionValues[2].value}</td>
                    <td>{elem.metricValues[0]}</td>
                </tr>
                )) ?? []}
            </tbody>
        </table>
    </div>
  );
};

export default MyComponent;