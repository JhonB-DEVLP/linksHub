"use client"

import { useUserStats } from "@/hooks/use-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Link, Eye, MousePointerClick } from "lucide-react"
import { format, parseISO, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function StatsOverview() {
  const { stats, loading } = useUserStats()

  // Função para formatar dados para o gráfico de barras
  const formatChartData = (data: any[] = []) => {
    const today = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i)
      return format(date, "yyyy-MM-dd")
    })

    // Criar um mapa com os dados existentes
    const dataMap = new Map()
    data.forEach((item) => {
      dataMap.set(item.date, item.count)
    })

    // Preencher os dias faltantes com zero
    return last7Days.map((date) => ({
      date,
      count: dataMap.get(date) || 0,
      formattedDate: format(parseISO(date), "dd/MM", { locale: ptBR }),
    }))
  }

  // Formatar dados para os gráficos
  const clicksData = stats ? formatChartData(stats.clicksByDay) : []
  const viewsData = stats ? formatChartData(stats.viewsByDay) : []

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-80" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Estatísticas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Link className="h-5 w-5 mr-2 text-primary" />
              <span className="text-2xl font-bold">{stats?.totalLinks || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Cliques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MousePointerClick className="h-5 w-5 mr-2 text-primary" />
              <span className="text-2xl font-bold">{stats?.totalClicks || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Visualizações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-primary" />
              <span className="text-2xl font-bold">{stats?.profileViews || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clicks">
        <TabsList>
          <TabsTrigger value="clicks">Cliques</TabsTrigger>
          <TabsTrigger value="views">Visualizações</TabsTrigger>
          <TabsTrigger value="topLinks">Links Populares</TabsTrigger>
        </TabsList>

        <TabsContent value="clicks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cliques nos últimos 7 dias</CardTitle>
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
        </TabsContent>

        <TabsContent value="views" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Visualizações nos últimos 7 dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="formattedDate" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [`${value} visualizações`, "Visualizações"]}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Bar dataKey="count" fill="#00C49F" name="Visualizações" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topLinks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Links Mais Clicados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {stats?.topLinks && stats.topLinks.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.topLinks}
                        dataKey="clicks"
                        nameKey="title"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={({ title, clicks }) => `${title}: ${clicks}`}
                      >
                        {stats.topLinks.map((entry, index) => (
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
