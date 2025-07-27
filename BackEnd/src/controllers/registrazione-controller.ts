import { Request, Response } from "express";
import { connection } from "../utils/db";

export async function postUtente(req: Request, res: Response) {
    const { Username } = req.body;

    connection.execute(
        `INSERT INTO utente (Username)
        SELECT ?
        WHERE NOT EXISTS 
            (SELECT ? FROM utente
            WHERE Username = ?)`,
        [Username, Username, Username],
    );
}
