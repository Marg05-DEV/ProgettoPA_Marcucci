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
| Rotta | Metodo HTTP | Ruolo | Parametri | Descrizione |
| :--- | :--- | :---: | :--- | :--- |
| `/login` | POST | Nessuno |  |
| `/register` | POST | Nessuno |  |
| `/users/:userId` | GET | User | vedi utente |
| `/admin/rechargeToken` | POST | Admin |  |
| `/admin/pending` | PATCH | Admin | conferma richiesta |
| `/admin/changeRole` | PATCH | Admin | conferma richiesta |
| `/graphs` | GET | User | Lista grafi |
| `/graphs` | POST | User | crea nuovo grafo |
| `/graphs/:graphId` | GET | User | Vedi grafo |
| `/graphs/:graphId/run` | POST | User | esegui |
| `/graphs/:graphId` | PATCH | User | modifica archi |
| `/graphs/:graphId/log?start=&end=&status=&format=` | GET | Admin | vedi lista modifiche |




<!-- TOC --><a name="diagrammi-di-sequenza"></a>
### Diagrammi di sequenza

<!-- TOC --><a name="design-pattern-utilizzati"></a>
### Design Pattern utilizzati

<!-- TOC --><a name="installazione-e-avvio"></a>
## Installazione e avvio

<!-- TOC --><a name="testing"></a>
## Testing 

```bash
npx sequelize-auto -h localhost -d progetto_pa_db -u user -x password -p 5432 -e postgres -o ./src/models -l ts --caseModel p --caseFile p --caseProp c --singularize 
```