import express from "express"
import { getOverview, getLinkStats, getGeographyStats, getDeviceStats } from "../controllers/analytics.controller"
import { authenticate } from "../middleware/auth.middleware"

const router = express.Router()

router.get("/overview", authenticate, getOverview)
router.get("/links", authenticate, getLinkStats)
router.get("/geography", authenticate, getGeographyStats)
router.get("/devices", authenticate, getDeviceStats)

export default router
