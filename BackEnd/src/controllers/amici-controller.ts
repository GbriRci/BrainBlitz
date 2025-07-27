import { Request, Response } from "express";
import { connection } from "../utils/db";

export async function SearchFriends(req: Request, res: Response) {
    connection.execute(
        `SELECT Username, Pvinte, PGiocate, Online
        FROM utente
        WHERE Username LIKE ?
        LIMIT 5`,
        [req.params.username+'%'],
        function (err, results, fields) {
            res.json(results);
        }
    );
}

export async function AllFriends(req: Request, res: Response) {
    connection.execute(
        `SELECT u.Username, u.PGiocate, u.PVinte
        FROM amici a JOIN utente u 
        ON (u.Username = CASE 
            WHEN a.Username1 = ? THEN a.Username2 
            WHEN a.Username2 = ? THEN a.Username1 
        END) 
        WHERE ? IN (a.Username1, a.Username2)
        ORDER BY PVinte DESC`,
        [req.params.username, req.params.username, req.params.username],
        function (err, results, fields) {
            res.json(results);
        }
    );
}

export async function DeleteFriend(req: Request, res: Response){
    connection.execute(
        `DELETE FROM AMICI 
        WHERE (Username1 = ? AND Username2 = ?)
        OR 	(Username1 = ? AND Username2 = ?)`,
        [req.params.user, req.params.amico, req.params.amico, req.params.user,],
        function (err, results, fields) {
            res.json(results);
        }
    );
} 

export async function SendRequest(req: Request, res: Response){
    const { destinatario, mittente } = req.body;

    connection.execute(
        `INSERT INTO richieste(Username1, Username2) 
        VALUES(?, ?)`,
        [mittente, destinatario],
        function (err, results, fields) {
            res.json(results);
        }
    );
}

export async function GetRequests(req: Request, res: Response){
    connection.execute(
        `SELECT Username, Pvinte, PGiocate, Online
        FROM richieste join utente
        ON Username1 = Username
        WHERE Username2 = ?`,
        [req.params.username],
        function (err, results, fields) {
            res.json(results);
        }
    );
}

export async function AcceptRequest(req: Request, res: Response){
    const { richiesta, user } = req.body;
    
    connection.execute(
        `INSERT INTO amici(Username1, Username2) 
        VALUES (?,?)`,
        [richiesta, user],
        function (err, results, fields) {
            res.json(results);
        }
    );
}

export async function RefuseRequest(req: Request, res: Response){
    connection.execute(
        `DELETE FROM richieste
        WHERE Username1 = ?
        AND Username2 = ?`,
        [req.params.richiesta, req.params.user],
        function (err, results, fields) {
            res.json(results);
        }
    );
}

export async function AlreadyAsked(req: Request, res: Response){
    connection.execute(
        `SELECT Username, Pvinte, PGiocate, Online
        FROM richieste join utente
        ON Username2 = Username
        WHERE Username1 = ?`,
        [req.params.username],
        function (err, results, fields) {
            res.json(results);
        }
    );
}

export async function OnlineFriends(req: Request, res: Response) {
    connection.execute(
        `SELECT u.Username, u.PGiocate, u.PVinte, u.Occupato
        FROM amici a JOIN utente u 
        ON (u.Username = CASE 
            WHEN a.Username1 = ? THEN a.Username2 
            WHEN a.Username2 = ? THEN a.Username1 
        END) 
        WHERE ? IN (a.Username1, a.Username2)
            AND u.Online = 1
        ORDER BY PVinte DESC`,
        [req.params.user, req.params.user, req.params.user],
        function (err, results, fields) {
            res.json(results);
        }
    );
}