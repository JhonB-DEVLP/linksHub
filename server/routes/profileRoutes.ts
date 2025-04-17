import express from "express"
import { getMyProfile, updateProfile, getPublicProfile } from "../controllers/profileController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

// Rotas protegidas (requerem autenticação)
router.route("/me").get(protect, getMyProfile).put(protect, updateProfile)

// Rota pública para obter perfil por nome de usuário
router.route("/u/:username").get(getPublicProfile)

export default router
