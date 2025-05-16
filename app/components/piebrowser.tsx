"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { getColorByIndex } from "../utils/colors"
import { Data } from "./types";
import BrowserData from "./browsermetrics";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {} satisfies ChartConfig

interface BrowserProps {
  data: Data;
}

const PieBrowser: React.FC<BrowserProps> = ({ data }) => {

    const totalVisitors = React.useMemo(() => {
        return (data?.rows ?? []).reduce((acc, row) => acc + Number(row.metricValues[0].value), 0)
    }, [data]) // need to add data to dependency so when there is an update the value changes

    const browserData = (data?.rows ?? []).map((row) => {
        const browser = row.dimensionValues[3].value // Browser is at index 3
        const visitors = parseInt(row.metricValues[0].value, 10) // Active users is the first metric
        return { browser, visitors }
    })

  
    const aggregatedBrowserData = browserData.reduce((acc : { [key: string]: number } , curr) => {
        if (!acc[curr.browser]) {
        acc[curr.browser] = 0;
        }
        acc[curr.browser] += curr.visitors;
        return acc;
    }, {});

    // map key value pair to browser and visitor
    const browserVisitors = Object.entries(aggregatedBrowserData).map(([browser, visitors],index) => ({
        browser,
        visitors,
        fill: getColorByIndex(index),
    }));


  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Browser Data</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={browserVisitors}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
      <BrowserData data={data}/>
      </CardFooter>
    </Card>
  )
}

export default PieBrowser;