import { Router } from "express";
import * as registrazioneController from "../controllers/registrazione-controller";

const router: Router = Router();

router.post("/api/registrazione/utente", registrazioneController.postUtente);

export default router;
