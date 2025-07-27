import { Router } from "express";
import * as utenteController from "../controllers/utente-controller";

const router: Router = Router();

router.get("/api/utente/:username", utenteController.getUser);
router.get("/api/utente/sfide/:username", utenteController.SfideRicevute);
router.post("/api/utente/richiesta", utenteController.MandaRichiesta);
router.delete("/api/utente/rifiuta/:user/:sfida", utenteController.Rifiuta);
router.get('/api/utente/badge/:username', utenteController.NumeroBadge);
router.patch("/api/utente/statistiche", utenteController.AggiornaStatistiche);
router.patch("/api/utente/statistiche/vittoria", utenteController.Vittoria);
router.post("/api/utente/achievement/:user/:IDBadge", utenteController.AggiungiAchievement);
router.patch("/api/utente/online", utenteController.Online);
router.patch("/api/utente/nonoccupato", utenteController.NotOccupato);
router.patch("/api/utente/occupato", utenteController.Occupato);
router.patch("/api/utente/disconnessione", utenteController.Disconnected);

export default router;