import e, { Request, Response } from "express";
import { connection } from "../utils/db";

export async function getUser(req: Request, res: Response) {
  connection.execute(
    `SELECT * 
    FROM utente 
    WHERE Username = ?`,
    [req.params.username],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

export async function SfideRicevute(req: Request, res: Response) {
  connection.execute(
    `SELECT Username, Pvinte, PGiocate, Online
    FROM sfide join utente
    ON Username1 = Username
    WHERE Username2 = ?`,
    [req.params.username],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

export async function MandaRichiesta(req: Request, res: Response) {
  const { destinatario, mittente } = req.body;
  
  connection.execute(
    `INSERT INTO sfide(Username1, Username2) 
    VALUES(?, ?)`,
    [mittente, destinatario],
    function (err, results, fields) { 
      res.json(results)
    }
  )
}

export async function Rifiuta(req: Request, res: Response) {
  connection.execute(
    `DELETE FROM sfide
    WHERE Username1 = ?
    AND Username2 = ?`,
    [req.params.sfida, req.params.user],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

export async function NumeroBadge(req: Request, res: Response) {
  connection.execute(
    `SELECT *
    FROM achievement
    JOIN badge 
    ON achievement.IDBadge = badge.IDBadge
    WHERE Username = ?`,
    [req.params.username],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

export async function AggiornaStatistiche(req: Request, res: Response) {
  const { Username } = req.body

  connection.execute(
    `UPDATE UTENTE
    SET PGiocate = PGiocate + 1
    WHERE Username = ?`,
    [Username],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

export async function Vittoria(req: Request, res: Response) {
  const { Username } = req.body

  connection.execute(
    `UPDATE UTENTE
    SET PVinte = PVinte + 1
    WHERE Username = ?`,
    [Username],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

export async function AggiungiAchievement(req: Request, res: Response) {
  connection.execute(
    `INSERT INTO achievement (Username, IDBadge) 
    VALUES (?, ?)`,
    [req.params.user, req.params.IDBadge],
    function (err, results, fields) {
      res.json(results)
  }
  )
}

export async function NotOccupato(req: Request, res: Response) { // setta occupato = 1 quando l'utente inizia una partita  
  const { Username } = req.body

  connection.execute(
    `UPDATE utente 
    SET Occupato = 0 
    WHERE Username = ?`,
    [Username],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

export async function Online(req: Request, res: Response) { // setta online = 1 quando l'utente si logga
  const { Username } = req.body
  console.log(Username + ' è online');
  connection.execute(
    `UPDATE utente 
    SET Online = 1 
    WHERE Username = ?`,
    [Username],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

export async function Occupato(req: Request, res: Response) { // setta occupato = 1 quando l'utente inizia una partita  
  const { Username } = req.body

  connection.execute(
    `UPDATE utente 
    SET Occupato = 1 
    WHERE Username = ?`,
    [Username],
    function (err, results, fields) {
      res.json(results)
    }
  )
}

export async function Disconnected(req: Request, res: Response) { 
  const { Username } = req.body

  connection.execute(
    `UPDATE utente
    SET Online = 0
    WHERE Username = ?;`,
    [Username],
    function (err, results, fields) {
      res.json(results)
    }
  )
  console.log(Username,"offline")
}