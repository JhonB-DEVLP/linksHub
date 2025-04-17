"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "01/05", views: 400, clicks: 240 },
  { name: "05/05", views: 300, clicks: 139 },
  { name: "10/05", views: 200, clicks: 980 },
  { name: "15/05", views: 278, clicks: 390 },
  { name: "20/05", views: 189, clicks: 480 },
  { name: "25/05", views: 239, clicks: 380 },
  { name: "30/05", views: 349, clicks: 430 },
]

export function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
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
        <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} strokeWidth={2} />
        <Line type="monotone" dataKey="clicks" stroke="hsl(var(--secondary))" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
