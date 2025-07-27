import { Router } from "express";
import * as badgeController from "../controllers/badge-controller";

const router: Router = Router();

router.get("/api/badge", badgeController.AllBadge);
router.patch("/api/badge/equipaggiato", badgeController.Loadbadge);
router.get("/api/badge/sbloccati/:Username", badgeController.Unlocked);

export default router;
