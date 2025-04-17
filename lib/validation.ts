import { z } from "zod"

// Esquema de validação para registro de usuário
export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  username: z
    .string()
    .min(3, "Nome de usuário deve ter pelo menos 3 caracteres")
    .max(30, "Nome de usuário deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Nome de usuário deve conter apenas letras, números e underscore"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
})

// Esquema de validação para login
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

// Esquema de validação para redefinição de senha
export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
})

// Esquema de validação para nova senha
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token é obrigatório"),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

// Esquema de validação para criação/edição de link
export const linkSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título deve ter no máximo 100 caracteres"),
  url: z.string().url("URL inválida"),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  icon: z.string().optional(),
  active: z.boolean().optional(),
})

// Esquema de validação para atualização de perfil
export const profileSchema = z.object({
  title: z.string().max(100, "Título deve ter no máximo 100 caracteres").optional(),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  avatar: z.string().optional(),
  theme: z.string().optional(),
  background: z.string().optional(),
  showAvatar: z.boolean().optional(),
  roundedCorners: z.boolean().optional(),
  darkMode: z.boolean().optional(),
})

// Função para validar dados com um esquema Zod
export function validateData<T>(schema: z.ZodType<T>, data: unknown): { success: boolean; data?: T; error?: string } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Extrair a primeira mensagem de erro
      const errorMessage = error.errors[0]?.message || "Dados inválidos"
      return { success: false, error: errorMessage }
    }
    return { success: false, error: "Erro de validação" }
  }
}
