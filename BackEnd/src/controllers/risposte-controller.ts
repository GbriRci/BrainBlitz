import { Request, Response } from "express";
import { connection } from "../utils/db";

export async function getAnswer(req: Request, res: Response) {
    connection.execute(
        `SELECT IDRisposta, Testo, Correttezza
        FROM risposte
        WHERE IDDomanda = ?
        ORDER BY RAND();`,
        [req.params.IDDomanda],
        function (err, results, fields) {
        res.json(results)
      }
    )
  }