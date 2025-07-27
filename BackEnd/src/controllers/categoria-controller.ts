import { Request, Response } from "express";
import { connection } from "../utils/db";

export async function AllCategory(req: Request, res: Response) {
  connection.execute(
    `SELECT * 
    FROM categorie`,
    [],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

export async function categoryById(req: Request, res: Response) {
  connection.execute(
    `SELECT *
    FROM categorie c
    WHERE c.IDCategoria = ?`,
    [req.params.IDCategoria],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

