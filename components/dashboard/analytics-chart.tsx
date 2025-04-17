"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"

// Dados de exemplo
const data7 = [
  { name: "10/05", views: 120, clicks: 80 },
  { name: "11/05", views: 150, clicks: 100 },
  { name: "12/05", views: 180, clicks: 120 },
  { name: "13/05", views: 220, clicks: 150 },
  { name: "14/05", views: 280, clicks: 180 },
  { name: "15/05", views: 320, clicks: 220 },
  { name: "16/05", views: 400, clicks: 250 },
]

const data30 = [
  { name: "17/04", views: 100, clicks: 60 },
  { name: "20/04", views: 150, clicks: 90 },
  { name: "23/04", views: 200, clicks: 120 },
  { name: "26/04", views: 250, clicks: 150 },
  { name: "29/04", views: 300, clicks: 180 },
  { name: "02/05", views: 350, clicks: 210 },
  { name: "05/05", views: 400, clicks: 240 },
  { name: "08/05", views: 450, clicks: 270 },
  { name: "11/05", views: 500, clicks: 300 },
  { name: "14/05", views: 550, clicks: 330 },
  { name: "16/05", views: 600, clicks: 360 },
]

const data90 = [
  { name: "Fev", views: 1200, clicks: 720 },
  { name: "Mar", views: 1800, clicks: 1080 },
  { name: "Abr", views: 2400, clicks: 1440 },
  { name: "Mai", views: 3000, clicks: 1800 },
]

const data365 = [
  { name: "Jun", views: 1200, clicks: 720 },
  { name: "Jul", views: 1400, clicks: 840 },
  { name: "Ago", views: 1600, clicks: 960 },
  { name: "Set", views: 1800, clicks: 1080 },
  { name: "Out", views: 2000, clicks: 1200 },
  { name: "Nov", views: 2200, clicks: 1320 },
  { name: "Dez", views: 2400, clicks: 1440 },
  { name: "Jan", views: 2600, clicks: 1560 },
  { name: "Fev", views: 2800, clicks: 1680 },
  { name: "Mar", views: 3000, clicks: 1800 },
  { name: "Abr", views: 3200, clicks: 1920 },
  { name: "Mai", views: 3400, clicks: 2040 },
]

interface AnalyticsChartProps {
  dateRange: string
}

export function AnalyticsChart({ dateRange }: AnalyticsChartProps) {
  const getChartData = () => {
    switch (dateRange) {
      case "7":
        return data7
      case "30":
        return data30
      case "90":
        return data90
      case "365":
        return data365
      default:
        return data30
    }
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={getChartData()}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="views"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.1}
        />
        <Area
          type="monotone"
          dataKey="clicks"
          stroke="hsl(var(--secondary))"
          fill="hsl(var(--secondary))"
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
