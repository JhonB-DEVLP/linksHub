import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container py-24 sm:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              Recursos Completos
            </h1>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 md:text-xl">
              LinkHub oferece tudo que você precisa para criar e gerenciar sua página de links personalizada, sem
              limitações ou custos ocultos.
            </p>
          </div>
        </section>

        <section className="container py-8 md:py-12 lg:py-16">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Personalização Completa</CardTitle>
                <CardDescription>Crie uma página que reflita sua identidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Temas Personalizáveis</h4>
                    <p className="text-sm text-muted-foreground">
                      Escolha entre vários temas ou crie o seu próprio com cores e estilos personalizados.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Planos de Fundo</h4>
                    <p className="text-sm text-muted-foreground">
                      Utilize cores sólidas, gradientes, padrões ou imagens como plano de fundo.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Fontes e Tipografia</h4>
                    <p className="text-sm text-muted-foreground">
                      Escolha entre diversas fontes para títulos e textos para criar seu estilo único.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Modo Escuro</h4>
                    <p className="text-sm text-muted-foreground">
                      Suporte nativo a modo escuro para melhorar a experiência visual dos seus visitantes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Gerenciamento de Links</CardTitle>
                <CardDescription>Organize seus links de forma eficiente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Arrastar e Soltar</h4>
                    <p className="text-sm text-muted-foreground">
                      Reorganize seus links facilmente com a funcionalidade de arrastar e soltar.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Categorização</h4>
                    <p className="text-sm text-muted-foreground">
                      Agrupe seus links por categorias para melhor organização e visualização.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Links Temporários</h4>
                    <p className="text-sm text-muted-foreground">
                      Crie links com data de expiração para promoções ou eventos temporários.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Previews Automáticos</h4>
                    <p className="text-sm text-muted-foreground">
                      Visualização prévia automática de links para redes sociais, vídeos e sites.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Estatísticas e Analytics</CardTitle>
                <CardDescription>Acompanhe o desempenho dos seus links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Estatísticas Detalhadas</h4>
                    <p className="text-sm text-muted-foreground">
                      Acompanhe cliques, visualizações e engajamento em tempo real.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Gráficos e Relatórios</h4>
                    <p className="text-sm text-muted-foreground">
                      Visualize dados de desempenho com gráficos e relatórios detalhados.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Exportação de Dados</h4>
                    <p className="text-sm text-muted-foreground">
                      Exporte seus dados de analytics para CSV ou PDF para análise externa.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Insights de Audiência</h4>
                    <p className="text-sm text-muted-foreground">
                      Entenda melhor seu público com dados demográficos e de localização.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Integrações e Extensibilidade</CardTitle>
                <CardDescription>Conecte-se com outras plataformas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Integrações com Redes Sociais</h4>
                    <p className="text-sm text-muted-foreground">
                      Conecte-se facilmente com Facebook, Twitter, Instagram e outras redes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Widgets Personalizados</h4>
                    <p className="text-sm text-muted-foreground">
                      Adicione widgets do Spotify, YouTube, e outras plataformas à sua página.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">API Aberta</h4>
                    <p className="text-sm text-muted-foreground">
                      Utilize nossa API para criar integrações personalizadas com outras ferramentas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Extensibilidade</h4>
                    <p className="text-sm text-muted-foreground">
                      Crie e compartilhe plugins e extensões com a comunidade.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container py-16 md:py-20">
          <div className="mx-auto max-w-[58rem] space-y-6 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Pronto para começar?</h2>
            <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Crie sua página de links personalizada gratuitamente e comece a compartilhar seu conteúdo de forma
              organizada.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/register">Criar Conta Grátis</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/demo">Ver Demonstração</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
