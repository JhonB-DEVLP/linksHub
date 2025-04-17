import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes"
import linkRoutes from "./routes/linkRoutes"
import profileRoutes from "./routes/profileRoutes"
import statsRoutes from "./routes/statsRoutes"
import { errorHandler } from "./middleware/errorMiddleware"

// Carregar variáveis de ambiente
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Rotas
app.use("/api/auth", authRoutes)
app.use("/api/links", linkRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/stats", statsRoutes)

// Rota de teste
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API funcionando!" })
})

// Middleware de tratamento de erros
app.use(errorHandler)

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

export default app
