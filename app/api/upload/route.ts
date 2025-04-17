import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/jwt"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { mkdir } from "fs/promises"

// Tamanho máximo de arquivo em bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    // Processar o upload do arquivo
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, message: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Validar tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "O arquivo é muito grande. O tamanho máximo é 5MB.",
        },
        { status: 400 },
      )
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "O arquivo deve ser uma imagem.",
        },
        { status: 400 },
      )
    }

    // Criar diretório de uploads se não existir
    const uploadDir = join(process.cwd(), "public/uploads", currentUser.userId)
    await mkdir(uploadDir, { recursive: true })

    // Gerar nome de arquivo único
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadDir, fileName)

    // Converter o arquivo para um Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Salvar o arquivo
    await writeFile(filePath, buffer)

    // Gerar URL pública
    const publicUrl = `/uploads/${currentUser.userId}/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: "Arquivo enviado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao processar upload:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar o upload do arquivo",
      },
      { status: 500 },
    )
  }
}
