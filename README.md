# 🧠BrainBlitz
Il progetto nasce dalla collabolazione con [sofcaroli2](https://github.com/sofcaroli2) e [Anapaxx](https://github.com/Anapaxx).
La primissima idea era quella di creare un gioco a quiz su un server web con Node, Vite, Vue ed Express. 
Utilizzando un database di supporto avremmo gestito l'accesso degli utenti, i rapporti di amicizia tra di 
loro e tutte le domande con relative risposte. Non ci siamo discostati troppo dalla nostra idea di partenza, 
ma abbiamo aggiunto mano a mano delle features per renderlo più piacevole e accattivante. 
A progetto terminato, gli utenti accedono tramite un username univoco e una password; il profilo può 
successivamente essere personalizzato con un’immagine. È possibile inviare richieste di amicizia ad altri 
giocatori conoscendone l’username. Ci saranno più modalità di gioco per rendere sempre nuovo e 
interessante il sito. Le domande sono divise in categorie in base all'argomento e sono di due tipi: scelta 
multipla e vero/falso. Ogni domanda possiede una spiegazione aggiuntiva alla risposta corretta. 
Un partita è composta da 5 domande e i punteggi sono aggiornati in tempo reale alla fine della stessa. 

# 🏹Features per gli utenti
- Possibilità di registrarsi, fare l’accesso e personalizzare il proprio profilo tramite immagine e 
username;
- Visualizzazione delle proprie statistiche personali, come vittorie e partite giocate;
- Possibilità di creare una propria lista di amici, tramite apposite richieste di amicizia;
- Badges da sbloccare completando svariate missioni; ad ogni badge corrisponde un gadget che può 
arricchire ulteriormente il profilo;
- Più modalità di gioco: allenamento, gioco online e sfida;
- Tre stati dell’utente: online (l’utente è nella home e può ricevere richieste di sfida), offline (l’utente 
è uscito dal sito) ed occupato (l’utente è in partita e non può ricevere richieste di sfida).

# 🎮Modalità di gioco
### Offline
Una modalità "Allenamento" che permette al giocatore di prendere confidenza con le 
diverse categorie, che possono essere scelte all’inizio di ogni partita, e di visualizzare le 
relative spiegazioni senza limite di tempo.
### Online
- Una richiesta di gioco verso altri utenti casuali online che permette di 
mettersi alla prova dopo la modalità di allenamento;
- Una sfida tra amici creata tramite una richiesta di gioco verso un utente specifico appartenente alla lista di 
amici.

# 🪛Tecnologie 
- XAMPP (per avviare MySQL e accedere al database) = ci ha permesso di testare il sito localmente 
e di creare il nostro database con i relativi dati;
- Node.js = ambiente di sviluppo per creare web server; 
- npm (Node Package Manager) = gestore di librerie e funzioni di Node;
- Vite = un build tool per incapsulare Vue all’interno di HTML;
- Vue.js = framework JS per costruire un'istanza dell’app renderizzata con mount;
- Vue router = libreria di routing per Vue.js per gestire la navigazione tra pagine;
- Axios = una libreria per effettuare richieste HTTP e per interagire con API e server;
- TypeScript = un super set (estensione di JS) che aggiunge i tipi statici (number, string, ...);
- Express = un framework server-side per web app su Node;
- Bootstrap e CSS = linguaggi di stile (Bootstrap è un framework CSS) per descrivere l’aspetto di 
pagine web;
- Socket = un endpoint per consentire la comunicazione client-server in tempo reale;
- Visual Studio Code (Live share) = ci ha permesso di lavorare insieme anche quando non eravamo 
fisicamente nello stesso luogo, in particolare Live Share ha fatto in modo di mostrare file condivisi e 
cambiamenti apportati in tempo reale.

# ⚖️ Accessibilità 
Per rendere il sito di più facile comprensione a persone con condizioni visive che alterano la 
percezione del colore, abbiamo inserito nelle varie risposte delle domande icone differenti per 
simboleggiare le risposte corrette/sbagliate. Precedentemente il messaggio era prima veicolato 
semplicemente tramite i colori rosso/verde, facilmente confusi da persone affette da daltonismo di 
tipo deuteranopia e protanopia. Abbiamo inoltre inserito degli alt nelle immagini per una più facile 
lettura da parte degli screen reader. 

# 🔐Sicurezza
Per quanto riguarda la sicurezza abbiamo preso in considerazione le criticità derivanti dall’inserimento di 
autenticazione/registrazione e dall’utilizzo di input utenti nel sito. 
Per quanto riguarda la memorizzazione delle password e la creazione/memorizzazione di token 
abbiamo scelto di affidarci al servizio clerk, che offre una suite completa di strumenti per l’autenticazione e 
registrazione di utenti all’interno di un database esterno. In questo modo i dati rimangono nascosti a coloro 
che potrebbero voler eseguire attacchi verso gli utenti.  
Il nostro sito presenta poi un input utente per la ricerca di altri giocatori; questo può essere soggetto a 
attacchi come Cross-Site Scripting (iniettare script dannosi in pagine web) o SQL injection (inserire 
codice SQL dannoso nei campi di input). Informandoci abbiamo scoperto che attacchi di Cross-Site 
Scripting potevano essere evitati tramite DOMPurify, abbiamo quindi deciso di inserirlo nella pagina 
interessata. 
Inoltre per evitare SQL injection ci siamo avvalsi di query parametrizzate (ossia che utilizzano dei 
parametri sostituiti successivamente con i valori reali solo dopo che la query è stata compilata). 

# ⬇️Installazione
1. Clonare la cartella di GitHub: ‘ https://github.com/GbriRci/BrainBlitz ‘ 
2. Installare le dipendenze tramite il comando ‘ npm i ’ 
3. Inserire all’interno di XAMPP il database contenuto nella cartella backend/utils/database.txt e 
avviare Apache e MySQL 
4. Aprire due terminali nelle cartelle Frontend e BackEnd e lanciare il comando ‘ npm run dev ’ 
5. Visitare il link: ‘ http://localhost:5173/accesso ’ 
