import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Navbar } from "@/components/navbar"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container flex-1 flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Entrar</h1>
            <p className="text-muted-foreground">Entre com sua conta para acessar o dashboard</p>
          </div>
          <LoginForm />
          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="font-medium text-primary underline underline-offset-4">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
