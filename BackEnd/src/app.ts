import express, { Express, Request, Response } from 'express';
import historyApiFallback from "connect-history-api-fallback";
import utenteRouter from "./routes/utente-router";
import amiciRouter from "./routes/amici-router";
import badgeRouter from "./routes/badge-router";
import categoriaRouter from "./routes/categoria-router";
import domandaRouter from "./routes/domanda-router";
import risposteRouter from "./routes/risposte-router";
import registrazioneRouter from "./routes/registrazione-router";
import bodyParser from "body-parser";
import http from 'http';
import { Server, Socket } from 'socket.io';

const port: number = 3000;
const app: Express = express();

//creazione server 
const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"]
    }
});

//variabili per il server
let utenti_connessi: string[] = [];
let utenti_in_attesa: string[] = [];
const sfide: { [key: string]: string[] } = {};
const stanze: string[] = [];
//mappatura tra username e socket
const socketMap: { [username: string]: Socket } = {}; 

//creazione della connessione
io.on('connection', (socket) => {
    function getSocketByUsername(username: string): Socket | undefined {
        return socketMap[username];
    };
    
    //mappa l'username al socket
    function socketmap(username: string){
        socketMap[username] = socket; 
    };

    //se si connette un nuovo utente e lo metto in attesa
    socket.on('nuovo_utente', (username: string) => { 
        if(!utenti_connessi.includes(username)) {
            utenti_connessi.push(username);
            socketmap(username);
        }
        if (!utenti_in_attesa.includes(username)) {
            utenti_in_attesa.push(username);
        }
        //se ci sono almeno due utenti in attesa creo una stanza
        if (utenti_in_attesa.length >= 2) {
            const categoria = Math.floor(Math.random() * 6) + 1;    //genero una categoria random
            const username1 = utenti_in_attesa.shift()!;            //prendo i primi due utenti in attesa
            const username2 = utenti_in_attesa.shift()!;
            const stanza = `${username1}_${username2}`;             //creo la stanza e la aggiungo all'array delle stanze
            stanze.push(stanza);
            const socket1 = getSocketByUsername(username1);         //prendo i socket degli utenti
            const socket2 = getSocketByUsername(username2);
            if (socket1 && socket2) {                               //se i socket esistono
                socketMap[username1] = socket1;
                socketMap[username2] = socket2;
                socket1.join(stanza);                               //unisco i socket alla stanza e invio i dati
                io.to(stanza).emit('avversario_trovato', username1, username2, categoria); 
                socket2.join(stanza);
                io.to(stanza).emit('avversario_trovato', username1, username2, categoria); 
            }
        }
    });

    //invio il punteggio su richiesta dell'evento 'invioPunteggio'
    socket.on('invioPunteggio', (username, punteggio) => {
        const stanza = Array.from(socket.rooms).find(room =>  room !== socket.id); 
        if (stanza) {
            io.to(stanza).emit('punteggio', username, punteggio);   //invia il punteggio alla stanza
        }
    });

    //gesrtione della disconnessione
    socket.on('disconnessione',() => {
        for (const username in socketMap) {
            if (socketMap[username] === socket) {                   //cancello la socketmap dell'utente
                delete socketMap[username];                         //rimuovo l'utente da utenti_connessi e utenti_in_attesa                
                utenti_connessi = utenti_connessi.filter(user => user !== username); 
                utenti_in_attesa = utenti_in_attesa.filter(user => user !== username);
                for (const stanza of stanze) {                      //cerco la stanza dell'utente e la rimuovo da stanze
                    if (stanza.includes(username)) {
                        stanze.splice(stanze.indexOf(stanza), 1); 
                    }
                }
                for (const stanza in sfide) {                       //anche per le stanze tra amici cancello la stanza dell'utente
                    if (sfide[stanza].includes(username)) {
                        delete sfide[stanza];
                    }
                }
                break;
            }
        }
    });

    //mette l'untente in attesa dell'amico
    socket.on('attesa_amico', (username) => {
        if (!utenti_connessi.includes(username)) {
            utenti_connessi.push(username);
            console.log(utenti_connessi);
            socketMap[username] = socket;
        }
    });

    //crea la stanza tra amici
    socket.on('stanza_amici', (usernameRichiedente, usernameDestinatario) => {
        console.log(`Richiedente: ${usernameRichiedente}`);
        console.log(`Destinatario: ${usernameDestinatario}`);
        const socketRichiedente = socketMap[usernameRichiedente];       //creo la socket per gli utenti
        const socketDestinatario = socketMap[usernameDestinatario];
        if (socketRichiedente && socketDestinatario) {                  
            const categoria = Math.floor(Math.random() * 6) + 1;        //sorteggio la categoria
            const stanza = `${usernameRichiedente}_${usernameDestinatario}`;
            sfide[stanza] = [usernameRichiedente, usernameDestinatario];
            socketRichiedente.join(stanza);                             //li aggiungo alla stanza
            socketDestinatario.join(stanza);
            io.to(stanza).emit('partita_iniziata', usernameRichiedente, usernameDestinatario, categoria);
        }
    });
});

app.use(historyApiFallback()); 
app.use(express.static("public")); // file statici nella cartella public (immagini)
app.use(bodyParser.json()); 

// MIDDLEWARE
app.use(amiciRouter);
app.use(badgeRouter);
app.use(categoriaRouter);
app.use(domandaRouter);
app.use(utenteRouter);
app.use(risposteRouter);
app.use(registrazioneRouter);

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "text/plain");
  res.status(404).send("Ops... Pagina non trovata");
});

server.listen(port, function() {
  console.log(`Listening on http://localhost:${port}`);
});