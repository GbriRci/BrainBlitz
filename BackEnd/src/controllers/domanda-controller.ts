import { Request, Response } from "express";
import { connection } from "../utils/db";

export async function getQuestion(req: Request, res: Response) {
  connection.execute(
    `SELECT d.IDDomanda, d.Testo, d.Spiegazione, d.Categoria
    FROM domande d
    JOIN categorie c ON d.Categoria = c.IDCategoria
    WHERE c.IDCategoria = ?
    ORDER BY RAND()
    LIMIT 5`,
    [req.params.IDCategoria],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

export async function getQuestionMix(req: Request, res: Response) {
  connection.execute(
    `SELECT d.IDDomanda, d.Testo, d.Spiegazione, d.Categoria
    FROM domande d
    ORDER BY RAND()
    LIMIT 5`,
    [],
    function (err, results, fields) {
      res.json(results)
    }
  )
}