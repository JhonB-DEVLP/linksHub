/**
 * Utilitário para otimizar imagens antes do upload
 */
export async function optimizeImage(file: File, maxWidth = 800, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      let width = img.width
      let height = img.height

      // Redimensionar se necessário
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Não foi possível obter o contexto 2D"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Falha ao converter canvas para blob"))
          }
        },
        "image/jpeg",
        quality,
      )
    }

    img.onerror = () => reject(new Error("Erro ao carregar a imagem"))
    img.src = URL.createObjectURL(file)
  })
}
