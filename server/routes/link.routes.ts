import express from "express"
import {
  getLinks,
  getLink,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  registerClick,
} from "../controllers/link.controller"
import { authenticate } from "../middleware/auth.middleware"

const router = express.Router()

router.get("/", authenticate, getLinks)
router.get("/:id", authenticate, getLink)
router.post("/", authenticate, createLink)
router.put("/:id", authenticate, updateLink)
router.delete("/:id", authenticate, deleteLink)
router.post("/reorder", authenticate, reorderLinks)
router.post("/:id/click", registerClick)

export default router
