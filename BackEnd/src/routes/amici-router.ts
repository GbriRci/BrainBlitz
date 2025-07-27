import { Router } from "express";
import * as amiciController from "../controllers/amici-controller";

const router: Router = Router();

// quando si fa una richiesta al database, si chiama la funzione del controller
router.get("/api/amici/:username", amiciController.AllFriends);
router.get("/api/amici/ricerca/:username", amiciController.SearchFriends);
router.delete("/api/amici/cancella/:user/:amico", amiciController.DeleteFriend);
router.post("/api/amici/richiesta", amiciController.SendRequest);
router.get("/api/amici/richieste/:username", amiciController.GetRequests);
router.get("/api/amici/giarichiesto/:username", amiciController.AlreadyAsked);
router.delete('/api/amici/rifiuta/:user/:richiesta', amiciController.RefuseRequest);
router.post('/api/amici/accetta', amiciController.AcceptRequest);
router.get("/api/amici/online/:user", amiciController.OnlineFriends);

export default router;