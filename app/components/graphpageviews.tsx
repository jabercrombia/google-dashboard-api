"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { getRandomColor } from "../utils/colors"
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
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function PageViews(data: { data: { rows: any[] } }) {

  function convertDate(yyyymmdd : string) {
    const year = yyyymmdd.slice(0, 4);
    const month = yyyymmdd.slice(4, 6);
    const day = yyyymmdd.slice(6, 8);
    
    return `${year}-${month}-${day}`;
  }

  const chartData = data.data.rows.map((item: { dimensionValues: { value: string }[], metricValues: { value: number }[]  }, index: number) => {
    return { 
      date: convertDate(item.dimensionValues[5]?.value),
      views: parseInt(item.metricValues[1]?.value.toString(), 10),
    };
  });

  const sortedData = chartData.sort((a: { date: string; views: number }, b: { date: string; views: number }) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const aggregatedData = Object.values(
    sortedData.reduce((acc : { [key: string]: { date: string; views: number } } , curr : { date: string; views: number }) => {
      if (!acc[curr.date]) {
        acc[curr.date] = { date: curr.date, views: 0 }
      }
      acc[curr.date].views += curr.views
      return acc
    }, {} as Record<string, { date: string; views: number }>)
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Page Views</CardTitle>
          <CardDescription>
            Showing page views for the last 60 days
          </CardDescription>
        </div>

      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={aggregatedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey="views" fill={getRandomColor()} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
