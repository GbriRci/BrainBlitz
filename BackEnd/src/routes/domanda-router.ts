import { Router } from "express";
import * as domandaController from "../controllers/domanda-controller";

const router: Router = Router();

router.get("/api/domanda/:IDCategoria", domandaController.getQuestion);
router.get("/api/domanda", domandaController.getQuestionMix);

export default router;