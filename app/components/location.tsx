import React from 'react';

interface DataItem {
  dimensionValues: { value: string }[];
  metricValues: number[];
}

interface MyComponentProps {
  data?: DataItem[]; 
}

const MyComponent: React.FC<MyComponentProps> = ({ data }) => {
  return (
    <div>
        <h2>Location</h2>
        <table>
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