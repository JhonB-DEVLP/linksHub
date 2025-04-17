import express from "express"
import { getUserStats, getLinkStats } from "../controllers/statsController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

// Todas as rotas de estatísticas requerem autenticação
router.use(protect)

router.route("/").get(getUserStats)

router.route("/link/:linkId").get(getLinkStats)

export default router
