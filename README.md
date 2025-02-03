"BRAIN BLITZ: il gioco è la chiave dell'apprendimento." by Sofia Caroli, Anna Passini, Gabriele Ricci

L’idea iniziale:
La primissima idea era quella di creare un gioco a quiz su un server web con Node, Vite, Vue ed Express. Utilizzando un database di supporto avremmo gestito l'accesso degli utenti, i rapporti di amicizia tra di loro e tutte le domande con relative risposte. Non ci siamo discostati troppo dalla nostra idea di partenza, ma abbiamo aggiunto mano a mano delle features per renderlo più piacevole e accattivante.
A progetto terminato, gli utenti accedono tramite un username univoco e una password; il profilo può successivamente essere personalizzato con un’immagine. È possibile inviare richieste di amicizia ad altri giocatori conoscendone l’username. Ci saranno più modalità di gioco per rendere sempre nuovo e interessante il sito. Le domande sono divise in categorie in base all'argomento e sono di due tipi: scelta multipla e vero/falso. Ogni domanda possiede una spiegazione aggiuntiva alla risposta corretta.
Un partita è composta da 5 domande e i punteggi sono aggiornati in tempo reale alla fine della stessa.


Features per gli utenti:
Possibilità di registrarsi, fare l’accesso e personalizzare il proprio profilo tramite immagine e username;
Visualizzazione delle proprie statistiche personali, come vittorie e partite giocate;
Possibilità di creare una propria lista di amici, tramite apposite richieste di amicizia;
Badges da sbloccare completando svariate missioni; ad ogni badge corrisponde un gadget che può arricchire ulteriormente il profilo;
Più modalità di gioco: allenamento, gioco online e sfida;
Tre stati dell’utente: online (l’utente è nella home e può ricevere richieste di sfida), offline (l’utente è uscito dal sito) ed occupato (l’utente è in partita e non può ricevere richieste di sfida).

Installazione del progetto:
Clonare la cartella di GitHub: ‘ https://github.com/GbriRci/BrainBlitz ‘
Installare le dipendenze tramite il comando ‘ npm i ’
Inserire all’interno di XAMPP il database contenuto nella cartella backend/utils/database.txt e avviare Apache e MySQL
Aprire due terminali nelle cartelle Frontend e BackEnd e lanciare il comando ‘ npm run dev ’
Visitare il link: ‘ http://localhost:5173/accesso ’
Fare l’accesso con username: ’ chiara ’ e password: ’ 5febbraio25 ’
