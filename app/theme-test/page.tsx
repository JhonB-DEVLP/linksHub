import { ThemeTest } from "@/components/theme-test"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ThemeTestPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-6">Teste de Tema</h1>
        <p className="mb-4">Esta página é usada para testar se o modo escuro está funcionando corretamente.</p>
        <ThemeTest />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg bg-background text-foreground">
            <h2 className="text-xl font-semibold mb-2">Elemento com cores padrão</h2>
            <p className="text-muted-foreground">Este elemento usa as cores padrão de fundo e texto.</p>
          </div>

          <div className="p-4 border rounded-lg bg-card text-card-foreground">
            <h2 className="text-xl font-semibold mb-2">Elemento de cartão</h2>
            <p className="text-muted-foreground">Este elemento usa as cores de cartão.</p>
          </div>

          <div className="p-4 border rounded-lg bg-primary text-primary-foreground">
            <h2 className="text-xl font-semibold mb-2">Elemento primário</h2>
            <p>Este elemento usa as cores primárias.</p>
          </div>

          <div className="p-4 border rounded-lg bg-secondary text-secondary-foreground">
            <h2 className="text-xl font-semibold mb-2">Elemento secundário</h2>
            <p>Este elemento usa as cores secundárias.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
