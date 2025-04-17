import express from "express"
import {
  getLinks,
  getLink,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  registerLinkClick,
} from "../controllers/linkController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

// Rotas protegidas (requerem autenticação)
router.route("/").get(protect, getLinks).post(protect, createLink)

router.route("/reorder").put(protect, reorderLinks)

router.route("/:id").get(protect, getLink).put(protect, updateLink).delete(protect, deleteLink)

// Rota pública para registrar cliques
router.route("/click/:linkId").get(registerLinkClick)

export default router
