import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { Navbar } from "@/components/navbar"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container flex-1 flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Criar Conta</h1>
            <p className="text-muted-foreground">Preencha os campos abaixo para criar sua conta</p>
          </div>
          <RegisterForm />
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium text-primary underline underline-offset-4">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
