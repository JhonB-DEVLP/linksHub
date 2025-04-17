import type { Request, Response } from "express"
import { prisma } from "../index"

// Obter estatísticas gerais
export const getOverview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { days = 30 } = req.query
    const daysNum = Number.parseInt(days as string) || 30

    // Data de início para o período solicitado
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysNum)

    // Total de visualizações
    const totalViews = await prisma.profileView.count({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
    })

    // Total de cliques
    const totalClicks = await prisma.linkClick.count({
      where: {
        link: { userId },
        createdAt: { gte: startDate },
      },
    })

    // Links ativos
    const activeLinks = await prisma.link.count({
      where: {
        userId,
        active: true,
      },
    })

    // Taxa de cliques (CTR)
    const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

    // Dados para o gráfico
    const viewsData = await getTimeSeriesData(userId, "views", daysNum)
    const clicksData = await getTimeSeriesData(userId, "clicks", daysNum)

    res.status(200).json({
      success: true,
      data: {
        totalViews,
        totalClicks,
        activeLinks,
        ctr: ctr.toFixed(1),
        chartData: {
          views: viewsData,
          clicks: clicksData,
        },
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter estatísticas" })
  }
}

// Obter estatísticas por link
export const getLinkStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { days = 30 } = req.query
    const daysNum = Number.parseInt(days as string) || 30

    // Data de início para o período solicitado
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysNum)

    // Buscar links com contagem de cliques
    const links = await prisma.link.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        url: true,
        category: true,
        clicks: true,
        createdAt: true,
        _count: {
          select: {
            clickEvents: {
              where: {
                createdAt: { gte: startDate },
              },
            },
          },
        },
      },
      orderBy: { clicks: "desc" },
    })

    // Formatar os dados
    const linkStats = links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      category: link.category,
      totalClicks: link.clicks,
      recentClicks: link._count.clickEvents,
      createdAt: link.createdAt,
    }))

    res.status(200).json({
      success: true,
      data: linkStats,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter estatísticas por link" })
  }
}

// Obter estatísticas geográficas
export const getGeographyStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { days = 30 } = req.query
    const daysNum = Number.parseInt(days as string) || 30

    // Data de início para o período solicitado
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysNum)

    // Esta é uma implementação simplificada
    // Em um ambiente real, você precisaria de uma tabela com informações geográficas
    // ou integrar com um serviço de geolocalização por IP

    // Dados de exemplo para demonstração
    const geoData = [
      { country: "Brazil", value: 42, percentage: 42 },
      { country: "United States", value: 28, percentage: 28 },
      { country: "Portugal", value: 8, percentage: 8 },
      { country: "Spain", value: 6, percentage: 6 },
      { country: "France", value: 4, percentage: 4 },
      { country: "Germany", value: 3, percentage: 3 },
      { country: "United Kingdom", value: 3, percentage: 3 },
      { country: "Other", value: 6, percentage: 6 },
    ]

    res.status(200).json({
      success: true,
      data: geoData,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter estatísticas geográficas" })
  }
}

// Obter estatísticas de dispositivos
export const getDeviceStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { days = 30 } = req.query
    const daysNum = Number.parseInt(days as string) || 30

    // Data de início para o período solicitado
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysNum)

    // Esta é uma implementação simplificada
    // Em um ambiente real, você analisaria o user-agent para determinar o dispositivo

    // Dados de exemplo para demonstração
    const deviceData = {
      devices: [
        { name: "Mobile", value: 68, percentage: 68 },
        { name: "Desktop", value: 27, percentage: 27 },
        { name: "Tablet", value: 5, percentage: 5 },
      ],
      browsers: [
        { name: "Chrome", value: 64, percentage: 64 },
        { name: "Safari", value: 22, percentage: 22 },
        { name: "Firefox", value: 8, percentage: 8 },
        { name: "Other", value: 6, percentage: 6 },
      ],
    }

    res.status(200).json({
      success: true,
      data: deviceData,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter estatísticas de dispositivos" })
  }
}

// Função auxiliar para obter dados de série temporal
const getTimeSeriesData = async (userId: string, type: "views" | "clicks", days: number) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Criar um array de datas para o período
  const dates = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    dates.push(date)
  }

  // Inverter para ordem cronológica
  dates.reverse()

  // Formatar as datas para exibição
  const formattedDates = dates.map((date) => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    return `${day}/${month}`
  })

  // Buscar dados reais do banco (implementação simplificada)
  // Em um ambiente real, você faria uma consulta agregada por data

  // Gerar dados de exemplo para demonstração
  const data = formattedDates.map((date, index) => {
    // Gerar valores aleatórios que aumentam com o tempo para simular crescimento
    const baseValue = 100 + index * 10
    const randomFactor = Math.random() * 50 - 25 // -25 a +25
    const value = Math.max(0, Math.round(baseValue + randomFactor))

    return {
      name: date,
      [type]: value,
    }
  })

  return data
}
