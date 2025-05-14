"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
  page_view: {
    label: "Page View",
  },
  first_visit: {
    label: "First Visit",
  },
  session_start: {
    label: "Session Start",
  },
  scroll: {
    label: "Scroll",
  },
  user_engagement: {
    label: "User Engagement",
  },
  visit_btn: {
    label: "Visit Btn",
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

export default function Component({ data }: GroupedPageDataProps) {

    const rows = data.rows || [];

    const dataFilter = (rows).map((elem) => {
        const obj: { [key: string]: string | number } = {
            date: dateFormat(elem.dimensionValues[5].value),
        };
        obj[elem.dimensionValues[6].value] = parseInt(elem.metricValues[2].value);
        return obj as Event; // Ensure the object conforms to the Event type
    });


    type Event = {
        date: string;
        [eventType: string]: string | number;
      };
      
      const rawEvents: Event[] = dataFilter;
      
      // Step 1: Identify all unique event types
      const eventTypes = new Set<string>();
      rawEvents.forEach(entry => {
        Object.keys(entry).forEach(key => {
          if (key !== "date") eventTypes.add(key);
        });
      });
      
      // Step 2: Group by date and sum values
      const groupedMap = new Map<string, Event>();
      
      rawEvents.forEach(({ date, ...events }) => {
        if (!groupedMap.has(date)) {
          groupedMap.set(date, { date });
        }
      
        const group = groupedMap.get(date)!;
      
        for (const key of eventTypes) {
          const value = (events[key] as number) || 0;
          group[key] = ((group[key] as number) || 0) + value;
        }
      });
      
      // Step 3: Convert map to array and fill missing event types with 0
      const grouped = Array.from(groupedMap.values()).map(entry => {
        for (const key of eventTypes) {
          if (!(key in entry)) entry[key] = 0;
        }
        return entry;
      }).sort((a, b) => a.date.localeCompare(b.date)); // ascending by month;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Page Events</CardTitle>
          <CardDescription>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={grouped}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="first_visit"
              type="natural"
              fill={getColorByIndex(0)}
              stroke={getColorByIndex(0)}
              fillOpacity={0.4}
              stackId="a"
            />
            <Area
              dataKey="page_view"
              type="natural"
              fill={getColorByIndex(1)}
              stroke={getColorByIndex(1)}
              fillOpacity={0.4}
              stackId="a"
            />
            <Area
              dataKey="session_start"
              type="natural"
              fill={getColorByIndex(2)}
              stroke={getColorByIndex(2)}
              fillOpacity={0.4}
              stackId="a"
            />
            <Area
              dataKey="user_engagement"
              type="natural"
              fill={getColorByIndex(3)}
              stroke={getColorByIndex(3)}
              fillOpacity={0.4}
              stackId="a"
            />
            <Area
              dataKey="scroll"
              type="natural"
              fill={getColorByIndex(4)}
              stroke={getColorByIndex(4)}
              fillOpacity={0.4}
              stackId="a"
            />
            <Area
              dataKey="visit_btn"
              type="natural"
              fill={getColorByIndex(5)}
              stroke={getColorByIndex(5)}
              fillOpacity={0.4}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
