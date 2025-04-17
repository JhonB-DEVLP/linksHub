"use client"

import { useLinkStats } from "@/hooks/use-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { format, parseISO, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

interface LinkStatsProps {
  linkId: string
}

export function LinkStats({ linkId }: LinkStatsProps) {
  const { stats, loading } = useLinkStats(linkId)

  // Função para formatar dados para o gráfico de barras
  const formatChartData = (data: any[] = []) => {
    const today = new Date()
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(today, 29 - i)
      return format(date, "yyyy-MM-dd")
    })

    // Criar um mapa com os dados existentes
    const dataMap = new Map()
    data.forEach((item) => {
      dataMap.set(item.date, item.count)
    })

    // Preencher os dias faltantes com zero
    return last30Days.map((date) => ({
      date,
      count: dataMap.get(date) || 0,
      formattedDate: format(parseISO(date), "dd/MM", { locale: ptBR }),
    }))
  }

  // Formatar dados para os gráficos
  const clicksData = stats ? formatChartData(stats.clicksByDay) : []

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32" />
        <Skeleton className="h-80" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma estatística disponível para este link</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Estatísticas do Link</h2>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{stats.linkInfo.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground truncate mb-2">{stats.linkInfo.url}</span>
            <span className="text-2xl font-bold">{stats.totalClicks} cliques</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cliques nos últimos 30 dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clicksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [`${value} cliques`, "Cliques"]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Bar dataKey="count" fill="#0088FE" name="Cliques" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Cliques por Referenciador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {stats.clicksByReferrer && stats.clicksByReferrer.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.clicksByReferrer}
                      dataKey="count"
                      nameKey="referrer"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ referrer, count }) => `${referrer}: ${count}`}
                    >
                      {stats.clicksByReferrer.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} cliques`, "Cliques"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">Nenhum dado disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cliques por Dispositivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {stats.clicksByDevice && stats.clicksByDevice.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.clicksByDevice}
                      dataKey="count"
                      nameKey="device"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ device, count }) => `${device}: ${count}`}
                    >
                      {stats.clicksByDevice.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} cliques`, "Cliques"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">Nenhum dado disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
