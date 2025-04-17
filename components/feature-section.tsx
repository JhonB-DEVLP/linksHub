import { Layers, Palette, BarChart3, Globe, DropletsIcon as DragDropIcon, Clock, Smartphone, Moon } from "lucide-react"

const features = [
  {
    icon: <Layers className="h-10 w-10" />,
    title: "Organização por Categorias",
    description: "Agrupe seus links por categorias para melhor organização e visualização.",
  },
  {
    icon: <Palette className="h-10 w-10" />,
    title: "Personalização Completa",
    description: "Altere cores, fontes, imagens e estilos para combinar com sua identidade.",
  },
  {
    icon: <BarChart3 className="h-10 w-10" />,
    title: "Estatísticas Detalhadas",
    description: "Acompanhe cliques, visualizações e engajamento em tempo real.",
  },
  {
    icon: <Globe className="h-10 w-10" />,
    title: "Domínio Personalizado",
    description: "Use seu próprio domínio para uma experiência mais profissional.",
  },
  {
    icon: <DragDropIcon className="h-10 w-10" />,
    title: "Arraste e Solte",
    description: "Reorganize seus links facilmente com a funcionalidade de arrastar e soltar.",
  },
  {
    icon: <Clock className="h-10 w-10" />,
    title: "Links Temporários",
    description: "Crie links com data de expiração para promoções ou eventos.",
  },
  {
    icon: <Smartphone className="h-10 w-10" />,
    title: "Design Responsivo",
    description: "Experiência perfeita em qualquer dispositivo, do celular ao desktop.",
  },
  {
    icon: <Moon className="h-10 w-10" />,
    title: "Modo Escuro",
    description: "Suporte nativo a modo escuro para melhor experiência visual.",
  },
]

export function FeatureSection() {
  return (
    <section className="container py-24 sm:py-32">
      <div className="mx-auto mb-16 flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Recursos Principais</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          LinkHub oferece tudo que você precisa para criar e gerenciar sua página de links personalizada.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">{feature.icon}</div>
            <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
