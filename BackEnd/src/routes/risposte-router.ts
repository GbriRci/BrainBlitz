import { Router } from "express";
import * as risposteController from "../controllers/risposte-controller";

const router: Router = Router();

router.get("/api/risposte/:IDDomanda", risposteController.getAnswer);

export default router;
