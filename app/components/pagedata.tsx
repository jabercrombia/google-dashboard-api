"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"
import { getRandomColor } from "../utils/colors"
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
  views: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  pageName: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig


// Define the types
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

interface Data {
  rows?: Row[];
}

interface GroupedPageDataProps {
  data: Data;
}


export default function Component({ data }: GroupedPageDataProps) {

  const groupedPageData = data?.rows?.reduce((acc: Record<string, number>, row: Row) => {
    //const pageName = row.dimensionValues[4]?.value || "unknown"; // pageName is at index 4
    let pageName = '';
    if (row.dimensionValues[4]?.value == 'jabercrombia') {

      pageName = 'Home';
    }
    else if (row.dimensionValues[4]?.value.includes('404')) {
      pageName = '404';
    }
    else {
      pageName = row.dimensionValues[4]?.value.replace('jabercrombia | ', ''); 
    }
    const screenPageViews = parseInt(row.metricValues[0]?.value || "0", 10); // screenPageViews is the first metric

    if (!acc[pageName]) {
      acc[pageName] = 0; // Initialize if the pageName doesn't exist
    }
    acc[pageName] += screenPageViews; // Accumulate screenPageViews

    return acc;
  }, {} as Record<string, number>);


  const pageNameData = Object.entries(groupedPageData || {}).map(([key, value], index: number) => ({
    title: key,
    views: value,
    fill: getColorByIndex(index),
  }));
  return (
    <>
    {pageNameData &&
    <Card>
    <CardHeader>
      <CardTitle>Page Views</CardTitle>
      <CardDescription>Visitors</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={pageNameData}
          layout="vertical"
          margin={{
            left: 0,
            right:20
          }}
        >
          <XAxis type="number" dataKey="views" hide />
          <YAxis
            dataKey="title"
            type="category"
            tickLine={false}
            tickMargin={0}
            axisLine={false}
            tickFormatter={(value) => value.replace('jabercrombia ','')}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Bar dataKey="views" fill={getRandomColor()} radius={5}>
          <LabelList
                dataKey="views"
                position="right"
                offset={3}
                className="fill-foreground"
                fontSize={12}
              />
          </Bar>
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
}
    </>
    
  )
}
