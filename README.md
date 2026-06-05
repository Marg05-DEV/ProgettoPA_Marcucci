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

<!-- TOC --><a name="progettazione"></a>
## Progettazione

<!-- TOC --><a name="diagramma-dei-casi-duso"></a>
### Diagramma dei casi d'uso

<!-- TOC --><a name="elenco-delle-rotte"></a>
### Elenco delle rotte
| Rotta | Metodo HTTP | Ruolo | Descrizione |
| :--- | :--- | :---: | :--- |
| `/login` | POST | Utente non autenticato |  |
| `/register` | POST | Utente non autenticato |  |
| `/graph` | GET | Utente autenticato | Lista grafi |
| `/graph` | POST | Utente autenticato | crea nuovo grafo |
| `/graph/:graphId` | GET | Utente autenticato | Vedi grafo |
| `/graph/:graphId/run` | POST | Utente autenticato | esegui |
| `/graph/:graphId` | PATCH | Utente autenticato | modifica archi |
| `/graph/:graphId/log` | GET | Admin | vedi lista modifiche |
| `/graph/:graphId/log/:updateId` | PATCH | Admin | conferma richiesta |
| `/user/:userId` | GET | Utente autenticato | vedi utente |
| `/user/:userId/reloadToken` | POST | Admin |  |

<!-- TOC --><a name="diagrammi-di-sequenza"></a>
### Diagrammi di sequenza

<!-- TOC --><a name="design-pattern-utilizzati"></a>
### Design Pattern utilizzati

<!-- TOC --><a name="installazione-e-avvio"></a>
## Installazione e avvio

<!-- TOC --><a name="testing"></a>
## Testing 