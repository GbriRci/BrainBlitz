# 🧠BrainBlitz

**BrainBlitz** è un **gioco a quiz online in tempo reale** sviluppato in collaborazione con [sofcaroli2](https://github.com/sofcaroli2) e [Anapaxx](https://github.com/Anapaxx) come progetto per un esame universitario. L'idea è creare una piattaforma interattiva dove gli utenti possono mettersi alla prova con domande di cultura generale e sfidare amici o altri giocatori.

Il gioco gestisce l'accesso degli utenti, le relazioni di amicizia, e un vasto database di domande con risposte e spiegazioni dettagliate.

## ✨ Caratteristiche Principali

* **Profilo Utente:** Registrazione, accesso, personalizzazione del profilo con username univoco e immagine.
* **Social:** Possibilità di inviare e gestire richieste di amicizia.
* **Statistiche:** Visualizzazione delle proprie vittorie e partite giocate.
* **Progressione:** Sblocco di badge completando missioni, con gadget per personalizzare il profilo.
* **Domande:** Divise per categorie, di tipo scelta multipla e vero/falso, con spiegazioni aggiuntive per ogni risposta corretta. Ogni partita è composta da 5 domande con punteggi aggiornati in tempo reale.
* **Stati Utente:** Online, Offline, Occupato (in partita).

## 🎮 Modalità di Gioco

BrainBlitz offre diverse modalità per un'esperienza di gioco dinamica:

* **Offline (Allenamento):** Permette ai giocatori di familiarizzare con le categorie e le spiegazioni senza limiti di tempo.
* **Online:**
    * **Gioca con Utenti Casuali:** Sfida altri utenti online per mettere alla prova le proprie abilità.
    * **Sfida Amici:** Invia richieste di gioco a utenti specifici dalla propria lista amici.

## 🚀 Tecnologie Utilizzate

Il progetto è stato sviluppato utilizzando una combinazione di tecnologie moderne per il frontend, backend e la gestione del database:

* **Frontend:** `Vite`, `Vue.js` (con `Vue Router`), `Axios`, `Bootstrap` e `CSS`.
* **Backend:** `Node.js` (con `npm`), `Express.js`, `Socket.IO` (per la comunicazione real-time).
* **Database:** `MySQL` (gestito tramite `XAMPP`).
* **Sviluppo:** `TypeScript`, `Visual Studio Code` (con Live Share per la collaborazione).

## 🔒 Sicurezza e Accessibilità

La sicurezza e l'accessibilità sono state priorità nel design:

* **Sicurezza:** Le password e i token sono gestiti tramite il servizio esterno `Clerk` per una robusta autenticazione. Per prevenire attacchi comuni come Cross-Site Scripting (XSS) è stato integrato `DOMPurify`, e per le SQL Injection sono state implementate query parametrizzate.
* **Accessibilità:** Per migliorare la comprensione per gli utenti con daltonismo, sono state aggiunte icone distinte per indicare risposte corrette/sbagliate (in aggiunta ai colori). Le immagini includono `alt text` per una migliore compatibilità con gli screen reader.

## ⬇️ Installazione e Avvio

Per avviare BrainBlitz localmente:

1.  Clona il repository GitHub: `git clone https://github.com/GbriRci/BrainBlitz.git`
2.  Naviga nella cartella del progetto e installa le dipendenze: `npm i`
3.  Configura il database: Inserisci il database contenuto in `backend/src/utils/database.txt` in `XAMPP` e avvia Apache e MySQL.
4.  Apri due terminali (uno nella cartella `Frontend` e uno in `Backend`) e lancia il comando: `npm run dev`
5.  Visita l'applicazione nel browser: `http://localhost:5173/accesso`

## 👥 Collaboratori

Questo progetto è stato sviluppato in collaborazione con:
* [sofcaroli2](https://github.com/sofcaroli2)
* [Anapaxx](https://github.com/Anapaxx)

## Scarica la relazione completa: 
[https://github.com/GbriRci/BrainBlitz/blob/main/BrainBlitz_relazione.pdf](BrainBlitz_relazione.pdf)
