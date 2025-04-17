import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="container flex flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Compartilhe todos os seus links <br className="hidden sm:inline" />
          em um só lugar
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Crie uma página de links personalizada para compartilhar seu conteúdo, redes sociais, projetos e muito mais.
          Totalmente gratuito e open-source.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg" className="gap-2">
          <Link href="/register">
            <span>Começar agora</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/demo">Ver demonstração</Link>
        </Button>
      </div>
      <div className="mt-12 w-full max-w-4xl overflow-hidden rounded-lg border bg-background shadow-xl">
        <img src="/link-dashboard-modern.png" alt="Dashboard do LinkHub" className="w-full h-auto" />
      </div>
    </section>
  )
}
