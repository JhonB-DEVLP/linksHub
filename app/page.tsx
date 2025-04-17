import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <section className="container py-24 sm:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Projeto Open-Source</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              LinkHub é 100% open-source e gratuito. Contribua para o projeto no GitHub e ajude a construir uma
              plataforma melhor para todos.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-4 gap-2">
              <Link href="https://github.com/linkhub/linkhub" target="_blank">
                <Github className="h-5 w-5" />
                <span>Ver no GitHub</span>
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
