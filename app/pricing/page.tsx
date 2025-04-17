import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container py-24 sm:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              Preços Simples e Transparentes
            </h1>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 md:text-xl">
              LinkHub é 100% gratuito e open-source. Sem custos ocultos, sem limitações artificiais.
            </p>
          </div>
        </section>

        <section className="container py-8 md:py-12 lg:py-16">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-12">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Gratuito</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">R$0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <CardDescription>Tudo que você precisa para começar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Links ilimitados</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Personalização básica</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Estatísticas de cliques</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Categorização de links</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Modo escuro</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">URL personalizada (username.linkhub.com)</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/register">Começar Grátis</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Apoiador</CardTitle>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Popular</div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">R$10</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <CardDescription>Apoie o projeto e ganhe recursos extras</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Tudo do plano Gratuito</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Domínio personalizado</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Estatísticas avançadas</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Temas premium</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Sem marca d'água</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Suporte prioritário</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Acesso antecipado a novos recursos</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/register?plan=supporter">Tornar-se Apoiador</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="container py-16 md:py-20">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-center text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
              Perguntas Frequentes
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">O LinkHub é realmente gratuito?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sim! O LinkHub é 100% gratuito e open-source. Você pode usar todas as funcionalidades principais sem
                    pagar nada. O plano Apoiador é opcional para quem deseja contribuir com o projeto e obter alguns
                    recursos extras.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Existe limite de links?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Não há limite para a quantidade de links que você pode adicionar à sua página, mesmo no plano
                    gratuito. Acreditamos que você deve ter liberdade para compartilhar todo o seu conteúdo.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Posso usar meu próprio domínio?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sim! No plano Apoiador, você pode conectar seu próprio domínio à sua página de links. No plano
                    gratuito, você recebe uma URL personalizada no formato username.linkhub.com.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Como posso contribuir com o projeto?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Você pode contribuir de várias formas: tornando-se um Apoiador, contribuindo com código no GitHub,
                    reportando bugs, sugerindo melhorias ou ajudando na documentação. Toda contribuição é bem-vinda!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-muted py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-[58rem] space-y-6 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                Pronto para centralizar seus links?
              </h2>
              <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Junte-se a milhares de criadores que já estão usando o LinkHub para compartilhar seu conteúdo.
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
