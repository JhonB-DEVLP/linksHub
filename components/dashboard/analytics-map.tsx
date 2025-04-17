"use client"

import { useState } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Tooltip } from "react-tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Dados de exemplo
const countryData = [
  { country: "Brazil", value: 42, percentage: 42 },
  { country: "United States", value: 28, percentage: 28 },
  { country: "Portugal", value: 8, percentage: 8 },
  { country: "Spain", value: 6, percentage: 6 },
  { country: "France", value: 4, percentage: 4 },
  { country: "Germany", value: 3, percentage: 3 },
  { country: "United Kingdom", value: 3, percentage: 3 },
  { country: "Other", value: 6, percentage: 6 },
]

// Mapeamento de países para códigos ISO
const countryToISO: Record<string, string> = {
  Brazil: "BRA",
  "United States": "USA",
  Portugal: "PRT",
  Spain: "ESP",
  France: "FRA",
  Germany: "DEU",
  "United Kingdom": "GBR",
}

export function AnalyticsMap() {
  const [tooltipContent, setTooltipContent] = useState("")

  const getCountryColor = (geo: any) => {
    const country = Object.keys(countryToISO).find((c) => countryToISO[c] === geo.id)
    if (!country) return "#F5F5F5"

    const data = countryData.find((d) => d.country === country)
    if (!data) return "#F5F5F5"

    // Escala de cores baseada na porcentagem
    if (data.percentage > 30) return "hsl(var(--primary))"
    if (data.percentage > 20) return "hsl(var(--primary) / 0.8)"
    if (data.percentage > 10) return "hsl(var(--primary) / 0.6)"
    if (data.percentage > 5) return "hsl(var(--primary) / 0.4)"
    return "hsl(var(--primary) / 0.2)"
  }

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <div className="h-full">
        <ComposableMap data-tooltip-id="map-tooltip" projection="geoMercator" projectionConfig={{ scale: 150 }}>
          <ZoomableGroup center={[0, 20]} zoom={1}>
            <Geographies geography="/world-countries.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      const country = Object.keys(countryToISO).find((c) => countryToISO[c] === geo.id)
                      if (country) {
                        const data = countryData.find((d) => d.country === country)
                        if (data) {
                          setTooltipContent(`${country}: ${data.percentage}%`)
                        }
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("")
                    }}
                    style={{
                      default: {
                        fill: getCountryColor(geo),
                        stroke: "hsl(var(--border))",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: "hsl(var(--primary) / 0.9)",
                        stroke: "hsl(var(--border))",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      pressed: {
                        fill: "hsl(var(--primary))",
                        stroke: "hsl(var(--border))",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip id="map-tooltip" content={tooltipContent} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-medium">Distribuição por País</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>País</TableHead>
              <TableHead className="text-right">Visitantes</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countryData.map((item) => (
              <TableRow key={item.country}>
                <TableCell>{item.country}</TableCell>
                <TableCell className="text-right">{item.value}%</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span>{item.percentage}%</span>
                    <div className="h-2 w-16 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
