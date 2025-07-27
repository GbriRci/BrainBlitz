import { Router } from "express";
import * as categoriaController from "../controllers/categoria-controller";

const router: Router = Router();

router.get("/api/categoria/:IDCategoria", categoriaController.categoryById);
router.get("/api/categorie", categoriaController.AllCategory);

export default router;
