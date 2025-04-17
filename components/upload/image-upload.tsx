"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
  maxSizeMB?: number
  className?: string
}

export function ImageUpload({ value, onChange, label = "Imagem", maxSizeMB = 5, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho do arquivo
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`O arquivo é muito grande. O tamanho máximo é ${maxSizeMB}MB.`)
      return
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      setError("O arquivo deve ser uma imagem.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Criar um FormData para enviar o arquivo
      const formData = new FormData()
      formData.append("file", file)

      // Enviar para o endpoint de upload
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Erro ao fazer upload da imagem")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (err) {
      console.error("Erro ao fazer upload:", err)
      setError(err instanceof Error ? err.message : "Erro ao fazer upload da imagem")
    } finally {
      setIsUploading(false)
      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    onChange("")
    setError(null)
  }

  const triggerFileInput = () => {
    inputRef.current?.click()
  }

  return (
    <div className={className}>
      <Label htmlFor="image-upload">{label}</Label>

      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={inputRef}
        className="hidden"
      />

      {value ? (
        <div className="mt-2 relative rounded-md overflow-hidden border">
          <div className="relative aspect-square w-full max-w-[200px]">
            <Image src={value || "/placeholder.svg"} alt={label} fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            disabled={isUploading}
            className="w-full h-32 border-dashed flex flex-col gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6" />
                <span>Clique para fazer upload</span>
              </>
            )}
          </Button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      <p className="mt-1 text-xs text-muted-foreground">
        Formatos suportados: JPG, PNG, GIF. Tamanho máximo: {maxSizeMB}MB.
      </p>
    </div>
  )
}
