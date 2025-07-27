import { Request, Response } from "express";
import { connection } from "../utils/db";

export async function Loadbadge(req: Request, res: Response) {
    const { Username, Scelta } = req.body
    connection.execute(
        `UPDATE UTENTE
        SET BadgeEQ = ? 
        WHERE Username = ?`,
        [Scelta, Username], 
        function (err, results, fields) {
            res.json(results)
        }
    )
}

export async function AllBadge(req: Request, res: Response) {
    connection.execute(
        `SELECT *
        FROM badge`,
        [], 
        function (err, results, fields) {
            res.json(results)
        }
    )
}

export async function Unlocked(req: Request, res: Response) {
    connection.execute(
        `SELECT *
        FROM badge b JOIN achievement a
        ON b.IDBadge = a.IDBadge
        WHERE a.Username = ?`,
        [req.params.Username],
        function (err, results, fields) {
            res.json(results)
        }
    )
}