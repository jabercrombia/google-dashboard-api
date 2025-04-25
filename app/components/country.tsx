
"use client"
import { Bar, BarChart, XAxis } from "recharts"
import dateFormat from "../utils/dateFormat"
import { getColorByIndex } from "../utils/colors"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  running: {
    label: "Running",
    color: "hsl(var(--chart-1))",
  },
  swimming: {
    label: "Swimming",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface DimensionValue {
    value: string;
  }
  
  interface MetricValue {
    value: string;
  }
  
  interface Row {
    dimensionValues: DimensionValue[];
    metricValues: MetricValue[];
  }
  
  interface DimensionHeader {
    name: string;
  }

  interface Data {
    rows?: Row[];
    dimensionHeaders?: DimensionHeader[];
  }
  
  interface GroupedPageDataProps {
    data: Data;
  }

export default function Component({data}: GroupedPageDataProps) {

    const reformat = (data.rows ?? [])
    .filter(elem=>{return elem.dimensionValues[0].value !== '(not set)'})
    .map(elem => {
        const date = dateFormat(elem.dimensionValues[5].value);
        const country = elem.dimensionValues[0].value;
        const views = parseInt(elem.metricValues[0].value);

        if (country !== '(not set)') {
           
            const obj = {
                'date': date,
                'country' : country,
                'views' : views
            }

            return obj;
        }

    });

    const groupedByDate = Object.entries(
        reformat.reduce((acc, item) => {
          if (!item) return acc;
      
          const { date, country, views = 0 } = item;
      
          if (!date || !country) return acc;
      
          if (!acc[date]) {
            acc[date] = { date };
          }
      
          const numericViews = typeof views === 'string' ? parseInt(views, 10) : views;
          acc[date][country] = (typeof acc[date][country] === 'number' ? acc[date][country] : 0) + numericViews;
      
          return acc;
        }, {} as Record<string, Record<string, number | string>>)
      )
      .map(([, data]) => data)
      .sort((a, b) => (b.date as string).localeCompare(a.date as string)); // descending by date
      
      

    // remove date key and value from array
    const countryList = groupedByDate.map(elem=> {
        const { ...rest } = elem;

        return rest;
    });

    // create an array of countries reguardless of doubles
    const arr = [];
    for (let x = 0; x < countryList.length; x++){
        for (let y = 0; y < Object.keys(countryList[x]).length; y++){
            arr.push(Object.keys(countryList[x])[y]);
        }
       
    }
    // create a unique list of countries
    const listOfCountry: string[] = [];
    for (let r = 0; r < arr.length;r++){
        
        if (!listOfCountry.includes(arr[r])){
            listOfCountry.push(arr[r])
        }
       
    }

    return (
        <Card>
          <CardHeader>
            <CardTitle>Views by Country by Day</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={groupedByDate}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    })
                  }}
                />
                {
                    listOfCountry.map((elem,index)=> {
                        return(
                            <Bar key={index}
                                dataKey={elem}
                                stackId="a"
                                fill={getColorByIndex(index)}
                            />
                        )
                    })
                }
    
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                  cursor={false}
                  defaultIndex={1}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )
}
