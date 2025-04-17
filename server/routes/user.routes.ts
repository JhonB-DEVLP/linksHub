import express from "express"
import { updateProfile, updatePassword, updateAppearance, getPublicProfile } from "../controllers/user.controller"
import { authenticate } from "../middleware/auth.middleware"

const router = express.Router()

router.put("/profile", authenticate, updateProfile)
router.put("/password", authenticate, updatePassword)
router.put("/appearance", authenticate, updateAppearance)
router.get("/public/:username", getPublicProfile)

export default router
