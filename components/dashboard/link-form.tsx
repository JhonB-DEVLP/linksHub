"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Título deve ter pelo menos 2 caracteres.",
  }),
  url: z.string().url({
    message: "URL inválida. Inclua http:// ou https://",
  }),
  description: z.string().optional(),
  category: z.string().min(1, {
    message: "Selecione uma categoria.",
  }),
})

interface LinkFormProps {
  onCancel: () => void
  editLink?: any
}

export function LinkForm({ onCancel, editLink }: LinkFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editLink?.title || "",
      url: editLink?.url || "",
      description: editLink?.description || "",
      category: editLink?.category || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Simulação de envio
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: editLink ? "Link atualizado com sucesso!" : "Link adicionado com sucesso!",
        description: "Seu link foi salvo.",
      })
      onCancel()
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Meu Website" {...field} />
                </FormControl>
                <FormDescription>Nome que será exibido para o link.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://meusite.com" {...field} />
                </FormControl>
                <FormDescription>Endereço completo do link.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Uma breve descrição do link" {...field} />
              </FormControl>
              <FormDescription>Descrição que será exibida abaixo do título.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="social">Redes Sociais</SelectItem>
                  <SelectItem value="projects">Projetos</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Categoria para organizar seus links.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : editLink ? "Atualizar Link" : "Adicionar Link"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
