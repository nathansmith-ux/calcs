"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
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
  value: {
    label: "Amount",
  },
  "principle-paid": {
    label: "Principle Paid",
    color: "var(--color-brand-primary)",
  },
  "interest-paid": {
    label: "Interest Paid",
    color: "var(--color-brand-third)",
  },
  "remaining-principle": {
    label: "Remaining Principle",
    color: "var(--color-brand-fourth)",
  },
} satisfies ChartConfig

interface ChartPieLabelProps {
    title: string;
    data: Array<{ label: string; value: number; fill: string }>;
}

export function ChartPieLabel({ title, data }: ChartPieLabelProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="min-w-[13rem]"/>} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              stroke="0"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
