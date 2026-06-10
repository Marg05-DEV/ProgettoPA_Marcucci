# Backend per la gestione di modelli di ottimizzazione su grafi
--- 
Realizzazione di un backend per la gestione della creazione e della valutazione di modelli di ottimizzazione su grafo. Questo progetto riguarda l'esame pratico di Programamzione Avanzata (A.A. 2025/2026) del corso di Laurea Magistrale in Ingegneria Informatica e dell'Automazione tenuto presso UNIVPM.

### Indice

<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Obiettivo del progetto](#obiettivo-del-progetto)
- [Progettazione](#progettazione)
   * [Diagramma dei casi d'uso](#diagramma-dei-casi-duso)
   * [Elenco delle rotte](#elenco-delle-rotte)
   * [Diagrammi di sequenza](#diagrammi-di-sequenza)
   * [Design Pattern utilizzati](#design-pattern-utilizzati)
- [Installazione e avvio](#installazione-e-avvio)
- [Testing ](#testing)

<!-- TOC end -->

<!-- TOC --><a name="obiettivo-del-progetto"></a>
## Obiettivo del progetto

Realizzazione di un sistema che consenta di gestire la creazione e valutazione di modelli di ottimizzazione su grafo. Il sistema permette di gestire l'aggiornamento di pesi effettuato da utenti autenticati mediante JWT, simulando il concetto di crowd-sourcing .

#### Tecnologie utilizzate

- **Node.JS** - Runtime JavaScript
- **Express** - Framework web
- **Sequelize** - ORM per database relazionali
- **RDBMS** - PostgreSQL
- **node-dijkstra** - Libreria per algoritmo di Dijkstra ([github.com/albertorestifo/node-dijkstra](https://github.com/albertorestifo/node-dijkstra))
- **TypeScript** - Linguaggio utilizzato per lo sviluppo

### Requisiti Funzionali

#### 1. Gestione dei Modelli di Ottimizzazione

- **Creazione**: Creare nuovi modelli seguendo l'interfaccia definita in node-dijkstra, specificando il grafo con i relativi pesi
- **Validazione**: Validare le richieste di creazione del modello
- **Sistema di Token**:
  - Addebitare token per la creazione: 0.20 per ogni nodo e 0.05 per ogni arco
  - Il modello può essere creato solo se c'è credito sufficiente
  - Ogni utente ha un numero iniziale di token nel database

#### 2. Esecuzione dei Modelli

- Eseguire il modello fornendo un nodo di partenza (start) e uno di arrivo (goal)
- Applicare un costo per l'esecuzione pari a quello addebitato nella fase di creazione
- Ritornare il risultato in formato JSON con:
  - Il percorso ottimale
  - Il costo del percorso (in termini di pesi del grafo)
  - Il tempo di esecuzione dell'algoritmo

#### 3. Aggiornamento dei Pesi degli Archi

- Consentire agli utenti autenticati di richiedere aggiornamenti di peso per uno o più archi
- **Formula di aggiornamento**: Media esponenziale $p_{i,j} = \alpha \cdot p_{i,j} + (1 - \alpha) \cdot p_{new}$
  - $p_{i,j}$ = precedente costo dell'arco
  - $p_{new}$ = nuovo costo suggerito
  - $\alpha$ = parametro configurabile via variabile d'ambiente (default: 0.8, intervallo: 0 < α < 1)
- **Validazione delle richieste**: Una richiesta è valida se il peso non si discosta per più del **50%** dal valore attuale
- **Richieste anomale**: Gli aggiornamenti che superano il 50% devono essere approvati/rifiutati da un utente admin

#### 4. Gestione degli Accessi e dei Ruoli

- Tutte le chiamate devono essere autenticate con **JWT** (schema RS256)
- **Utente standard**: Può creare modelli, eseguirli e suggerire aggiornamenti di peso
- **Utente admin**: 
  - Visualizzare le richieste di aggiornamento in attesa di conferma
  - Approvare o rifiutare aggiornamenti anomali
  - Ricaricare i token per altri utenti (fornendo email e nuovo credito)
  - Visualizzare il log degli aggiornamenti

#### 5. Gestione Token

- Ogni utente ha un numero di token residuo memorizzato nel database
- Quando i token terminano, ogni richiesta dell'utente deve ritornare **401 Unauthorized**
- Rotta admin per ricaricare i token di un utente

#### 6. Log e Storico degli Aggiornamenti

- Restituire l'elenco degli aggiornamenti dei pesi di un dato modello in formato **JSON** o **CSV** (tramite querystring)
- Supportare filtri per:
  - Data di modifica (inizio, fine o entrambe)
  - Status della richiesta
- Validare le richieste di filtro

### Specifiche Tecniche

- **Database**: Script di seed per inizializzare il sistema
  - Almeno 2 modelli diversi per la demo
  - Almeno due versioni per modello
  - Minimo 8 nodi e 16 archi per modello
- **Middleware**: Utilizzo delle funzionalità di middleware di Express
- **Gestione errori**: Utilizzo di middleware per gestire e sollevare eccezioni
- **Autenticazione**: JWT con chiave privata RS256 memorizzata in file `.env`
- **Documentazione**: Design Pattern utilizzati devono essere documentati nel README

<!-- TOC --><a name="progettazione"></a>
## Progettazione

<!-- TOC --><a name="diagramma-dei-casi-duso"></a>
### Diagramma dei casi d'uso

![Use Case Diagram](readme-asset/UseCase.png)

<!-- TOC --><a name="elenco-delle-rotte"></a>
### Elenco delle rotte
| Rotta | Metodo HTTP | Ruolo | Parametri | Descrizione |
| :--- | :--- | :---: | :--- | :--- |
| `/` | GET | - | - | Pagina di benvenuto |
| `/login` | POST | - | {email, password} | Effettua il login e restituisce il token JWT associato all'utente |
| `/register` | POST | - | {username, email, password} | Crea un nuovo utente e fa il login restituendo il JWT |
| `/users/:id` | GET | User Owner o Admin | - | Restituisce i dati di un utente |
| `/admin/rechargeToken` | PATCH | Admin | {email, qtyToken} | Ricarica i token ad un utente |
| `/admin/pending` | PATCH | Admin | {updateId, status} | Risolve una richiesta di modifica pendente |
| `/admin/pending` | GET | Admin | - | Restituisce la lista delle richieste di modifica pendenti |
| `/admin/changeRole` | PATCH | Admin | {email, isAdmin} | Assegna un ruolo ad un utente |
| `/graphs` | GET | User | - | Restituisce la lista di tutti i grafi |
| `/graphs` | POST | User | {name, description, nodes[], edges[\{startNode, endNode, weight\}]}  | Crea un nuovo grafo e i rispettivi archi |
| `/graphs/:id` | GET | User | id tra i Params | Restituisce le informazioni del grafo |
| `/graphs/:id/run` | POST | User | id tra i Params, {startNode, endNode} | Calcola il percorso tra due nodi su un grafo |
| `/graphs/:id` | PATCH | User | id tra i Params, [\{edgeId, newWeight\}] | Richiede la modifica dei pesi di alcuni archi di un grafo |
| `/graphs/:id/log?startDate=&endDate=` | GET | User | id, startDate e endDate tra i params, {format}| Restituisce la lista delle modifiche di un grafo |

**NB.** Tutte le rotte in cui l'utente deve essere autorizzato (cioè deve avere un ruolo) è sottointeso che ci sia il token JWT nell'authorization



<!-- TOC --><a name="diagrammi-di-sequenza"></a>
### Diagrammi di sequenza

#### POST /auth/login
Effettua il login di un utente fornendo le credenziali (email e password). Il middleware valida il formato dei dati, il controller verifica le credenziali nel database e genera il token JWT di autenticazione.

![Login Sequence Diagram](readme-asset/01Login.png)

**Errori possibili:** `INVALID_EMAIL`, `INVALID_PASSWORD`, `USER_NOT_FOUND`, `INTERNAL_SERVER_ERROR`
**Successo:** `USER_LOGGED_IN` (HTTP 200) - Ritorna il JWT token e i dati dell'utente

---

#### POST /auth/register
Crea un nuovo utente nel sistema. Il middleware valida username, email e password, il controller crea l'utente nel database e restituisce automaticamente il token JWT di autenticazione.

**Errori possibili:** `INVALID_USERNAME`, `INVALID_EMAIL`, `INVALID_PASSWORD`, `USER_ALREADY_EXISTS`, `INTERNAL_SERVER_ERROR`
**Successo:** `USER_REGISTERED` (HTTP 201) - Ritorna il JWT token e i dati dell'utente creato

---

#### GET /users/:id
Restituisce i dati di un utente specifico. Solo il proprietario o un admin possono accedere a questa rotta. Il middleware verifica il JWT e che l'utente sia autorizzato.

**Errori possibili:** `JWT_NOT_PROVIDED`, `INVALID_JWT`, `TOKENS_FINISHED`, `INVALID_ID`, `NOT_OWNER_OR_ADMIN`, `USER_NOT_FOUND`, `INTERNAL_SERVER_ERROR`
**Successo:** `USER_FOUND` (HTTP 200) - Ritorna i dati dell'utente (username, email, qtyToken, isAdmin)

---

#### PATCH /admin/rechargeToken
Ricarica i token ad un utente specifico. Solo un admin può eseguire questa operazione. Richiede l'email dell'utente e la quantità di token da aggiungere.

![Reload Token Sequence Diagram](readme-asset/04ReloadToken.png)

**Errori possibili:** `JWT_NOT_PROVIDED`, `INVALID_JWT`, `NOT_ADMIN`, `INVALID_EMAIL`, `INVALID_TOKEN_AMOUNT`, `USER_NOT_FOUND`, `TOKENS_FINISHED`, `INTERNAL_SERVER_ERROR`
**Successo:** `TOKENS_RECHARGED` (HTTP 200) - Ritorna i dati aggiornati dell'utente con i token ricaricati

---

#### PATCH /admin/pending
Risolve una richiesta di modifica pendente approvando o rifiutando l'aggiornamento. Solo un admin può eseguire questa operazione. Aggiorna lo stato del log di modifica e, se approvato, modifica il peso dell'arco.

![Manage Pending Request Sequence Diagram](readme-asset/05ManagePendingRequest.png)

**Errori possibili:** `JWT_NOT_PROVIDED`, `INVALID_JWT`, `NOT_ADMIN`, `INVALID_ID`, `INVALID_STATUS`, `UPDATE_LOG_NOT_FOUND`, `EDGE_NOT_FOUND`, `GRAPH_NOT_FOUND`, `TOKENS_FINISHED`, `INTERNAL_SERVER_ERROR`
**Successo:** `PENDING_UPDATE_RESOLVED` (HTTP 200) - Ritorna il log di modifica aggiornato

---

#### GET /admin/pending
Restituisce la lista di tutte le richieste di modifica pendenti. Solo un admin può accedere a questa rotta. Supporta paginazione e filtri.

![Get Pending Sequence Diagram](readme-asset/07GetPending.png)

**Errori possibili:** `JWT_NOT_PROVIDED`, `INVALID_JWT`, `NOT_ADMIN`, `TOKENS_FINISHED`, `INTERNAL_SERVER_ERROR`
**Successo:** `PENDING_REQUESTS_FOUND` (HTTP 200) - Ritorna un array di UpdateLog con status='pending'

---

#### PATCH /admin/changeRole
Assegna o revoca il ruolo di amministratore a un utente. Solo un admin può eseguire questa operazione. Richiede l'email dell'utente e un valore booleano che indica se promuovere (true) o declassare (false).

**Errori possibili:** `JWT_NOT_PROVIDED`, `INVALID_JWT`, `NOT_ADMIN`, `INVALID_EMAIL`, `INVALID_ROLE`, `USER_NOT_FOUND`, `TOKENS_FINISHED`, `INTERNAL_SERVER_ERROR`
**Successo:** `ROLE_UPDATED` (HTTP 200) - Ritorna i dati aggiornati dell'utente con il nuovo ruolo

---

#### GET /graphs
Restituisce la lista di tutti i grafi disponibili nel sistema. Richiede autenticazione tramite JWT.

**Errori possibili:** `JWT_NOT_PROVIDED`, `INVALID_JWT`, `TOKENS_FINISHED`, `INTERNAL_SERVER_ERROR`
**Successo:** `GRAPHS_FOUND` (HTTP 200) - Ritorna un array di grafi con i loro nodi e archi

---

#### POST /graphs
Crea un nuovo grafo nel sistema con i relativi nodi e archi. Il middleware valida che il grafo sia connesso e che i dati siano nel formato corretto. Addebita token in base al numero di nodi e archi.

![Create Graph Sequence Diagram](readme-asset/11CreateGraph.png)

**Errori possibili:** `JWT_NOT_PROVIDED`, `INVALID_JWT`, `INVALID_GRAPH_NAME`, `INVALID_GRAPH_DESCRIPTION`, `INVALID_NODES_DATA`, `INVALID_NODES_FORMAT`, `INVALID_EDGES_DATA`, `INVALID_EDGES_FORMAT`, `EDGE_NODE_NOT_FOUND`, `GRAPH_NOT_CONNECTED`, `TOKENS_FINISHED`, `INTERNAL_SERVER_ERROR`
**Successo:** `GRAPH_CREATED` (HTTP 201) - Ritorna il grafo creato con i suoi nodi e archi

---

#### GET /graphs/:id
Restituisce le informazioni di un grafo specifico inclusi tutti i suoi nodi e archi. Richiede autenticazione tramite JWT.

![Get Graph by ID Sequence Diagram](readme-asset/09GraphById.png)

**Errori possibili:** `JWT_NOT_PROVIDED`, `INVALID_JWT`, `INVALID_ID`, `GRAPH_NOT_FOUND`, `TOKENS_FINISHED`, `INTERNAL_SERVER_ERROR`
**Successo:** `GRAPH_FOUND` (HTTP 200) - Ritorna i dettagli del grafo con nodi e archi

---

#### POST /graphs/:id/run
Esegue l'algoritmo di Dijkstra su un grafo per trovare il percorso ottimale tra due nodi. Il middleware valida i nodi di inizio e fine. Addebita token all'utente per l'esecuzione.

![Run Graph Sequence Diagram](readme-asset/10RunGraph.png)

**Errori possibili:** `JWT_NOT_PROVIDED`, `INVALID_JWT`, `INVALID_ID`, `INVALID_RUN_NODES`, `GRAPH_NOT_FOUND`, `NODE_NOT_FOUND`, `TOKENS_FINISHED`, `DIJKSTRA_ERROR`, `INTERNAL_SERVER_ERROR`
**Successo:** `SHORTEST_PATH_COMPUTED` (HTTP 200) - Ritorna il percorso calcolato, il costo totale e il tempo di esecuzione

---

#### PATCH /graphs/:id
Richiede la modifica dei pesi di uno o più archi di un grafo. Se la modifica rientra nella soglia (±50%), viene applicata immediatamente, altrimenti viene creata una richiesta pendente per l'approvazione dell'admin.

![Update Graph Edges Sequence Diagram](readme-asset/12UpdateGraphEdges.png)

**Errori possibili:** `JWT_NOT_PROVIDED`, `INVALID_JWT`, `INVALID_ID`, `INVALID_UPDATE_DATA`, `INVALID_UPDATE_FORMAT`, `GRAPH_NOT_FOUND`, `EDGE_NOT_FOUND`, `WEIGHT_OUT_OF_RANGE`, `TOKENS_FINISHED`, `INTERNAL_SERVER_ERROR`
**Successo:** `GRAPH_EDGES_UPDATED` (HTTP 200) - Ritorna il grafo aggiornato o la lista di UpdateLog creati se in attesa di approvazione

---

#### GET /graphs/:id/log
Restituisce la lista di tutte le modifiche effettuate su un grafo. Supporta filtri per data di modifica (startDate, endDate) e formato di output (JSON o CSV). Solo gli utenti autorizzati possono accedere.

![Update Log Graph Sequence Diagram](readme-asset/13UpdateLogGraph.png)

**Errori possibili:** `JWT_NOT_PROVIDED`, `INVALID_JWT`, `INVALID_ID`, `INVALID_DATE_FORMAT`, `INVALID_OUTPUT_FORMAT`, `GRAPH_NOT_FOUND`, `TOKENS_FINISHED`, `INTERNAL_SERVER_ERROR`, `CSV_GENERATION_ERROR`
**Successo:** `GRAPH_LOGS_FOUND` (HTTP 200) - Ritorna la lista di UpdateLog filtrati in formato JSON o CSV

<!-- TOC --><a name="design-pattern-utilizzati"></a>

---
### Design Pattern utilizzati

#### M(V)C - Model View Controller (senza View)

Il pattern MVC è stato adattato al contesto di un'API REST. Il **Controller** riceve le richieste HTTP da Express e estrae i dati dal body/params, il **Service** contiene tutta la logica di business e di validazione, mentre il **Model** (fornito da Sequelize) rappresenta la struttura dei dati. Questo separazione di responsabilità rende il codice modulare, testabile e facilmente manutenibile. Ogni rotta è gestita da un controller dedicato (AuthController, UserController, AdminController, GraphController) che delega la logica al corrispondente service.

#### Service Layer

Il **Service Layer** incapsula la logica di business dell'applicazione, fungendo da intermediario tra il Controller e il DAO. Ogni service (AuthService, UserService, AdminService, GraphService) contiene metodi che orchestrano operazioni complesse, validano i dati, e coordinano l'interazione con i DAO. Questo pattern consente una testabilità più semplice poiché la logica di business è isolata dalle richieste HTTP. Il service è responsabile di calcoli complessi come la formula di aggiornamento esponenziale dei pesi, la gestione dei token, e l'esecuzione dell'algoritmo di Dijkstra.

#### DAO - Data Access Object

Il **DAO Pattern** fornisce un'astrazione per l'accesso ai dati del database. Ogni entità del sistema (User, Graph, Edge, UpdateLog) ha un DAO corrispondente che implementa l'interfaccia generica `IDao<T>`. Questo isolamento del codice di accesso ai dati dal resto dell'applicazione facilita il cambio del database e rende i test più semplici attraverso il mocking. I DAO utilizzano Sequelize per le operazioni CRUD e gestiscono gli errori del database, sollevando eccezioni personalizzate che vengono catturate dai service.

#### Chain of Responsibility (CoR)

Il pattern **Chain of Responsibility** è implementato tramite il middleware di Express. Le rotte sono protette da una catena di middleware che vengono eseguiti sequenzialmente: ad esempio, la rotta `/admin/rechargeToken` richiede `[checkJwt, checkAdmin, checkEmail, checkAmount]`. Ogni middleware valida un aspetto specifico della richiesta e, se la validazione fallisce, passa un errore al prossimo handler. Se passa, delega al successivo. Questo pattern rende facile aggiungere nuove validazioni senza modificare il codice esistente.

#### Factory Pattern

#### Singleton Pattern

Il **Singleton Pattern** è applicato ai Service e DAO, anche se non esplicitamente implementato come singleton classico. Ogni Controller istanzia il service una sola volta nel costruttore e lo riutilizza per tutte le operazioni, garantendo che esista una sola istanza per controller. Analogamente, ogni Service istanzia il DAO una sola volta nel costruttore. Questo pattern garantisce coerenza dello stato e rende efficiente l'utilizzo delle risorse, evitando istanze multiple e non necessarie.

<!-- TOC --><a name="installazione-e-avvio"></a>
## Installazione e avvio

#### 1. Clonazione della repository
```

#### 1.

<!-- TOC --><a name="testing"></a>
## Testing 

```bash
npx sequelize-auto -h localhost -d progetto_pa_db -u user -x password -p 5432 -e postgres -o ./src/models -l ts --caseModel p --caseFile p --caseProp c --singularize 
```