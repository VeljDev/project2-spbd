# Security & Privacy by Design: Project 2

## Autori: Veljko Markovic, Elisa Resch

## Descrizione del Progetto

Questo progetto è stato sviluppato come parte del corso **Security & Privacy by Design**. L'obiettivo è realizzare un sistema IT che rispetti i criteri di **security by design** attraverso l'implementazione di un front-end, un back-end e un sistema di autenticazione e tracciabilità degli eventi.

Il sistema si basa su un database predefinito, **Chinook Database**, adattato per soddisfare le specifiche richieste del progetto. Le principali funzionalità includono:
- Autenticazione e autorizzazione basate su **JWT**.
- Gestione delle password sicura, con memorizzazione crittografata e regole di complessità.
- Session management con scadenze e refresh automatico per i token.
- Tracciabilità delle attività utente mediante logging lato back-end.
- Prevenzione di attacchi come SQL injection e crawling massivo di dati.

## Tecnologie Utilizzate

- **Front-end**:
  - Framework: **React** con **Vite.js**
  - Librerie: Chakra UI, React Router, Axios

- **Back-end**:
  - Linguaggio: **Node.js**
  - Framework: **Express**
  - Autenticazione: **JWT**
  - Logging: Salvataggio e tracciabilità delle attività utente.
  - Email: Integrazione con **Resend** per l'invio di email.

- **Database**:
  - Tipo: **PostgreSQL** (compatibile con altre versioni di Chinook Database come SQLite e MySQL).
  - Modifiche: Aggiunti attributi e tabelle per supportare l'autenticazione e l'autorizzazione.

- **Containerizzazione**:
  - **Docker**: Configurazione di servizi tramite `docker-compose`.

- **Sicurezza**:
  - Crittografia delle password (hashing con algoritmi sicuri).
  - Validazione dei dati e gestione delle eccezioni per prevenire exploit.

## Funzionalità Principali

### Utenti
1. **Login**: Ogni utente accede con un default password iniziale modificabile.
2. **Autorizzazione**:
   - Manager: Accesso completo ai clienti.
   - Utenti normali: Accesso limitato ai propri clienti.
3. **Gestione delle password**:
   - Complessità minima (maiolica, numeri, caratteri speciali).
   - Memorizzazione crittografata e storicizzazione delle ultime 5 password.

### Sistema
1. **Session Management**:
   - Scadenza dei token ogni 5 minuti.
   - Refresh automatico per i manager.
   - Logout automatico per inattività (2 minuti).
2. **Validazione dei dati**:
   - Prevenzione di SQL injection e data crawling.
3. **Tracciabilità**:
   - Logging dettagliato delle attività lato server.

## Requisiti per l'Esecuzione

- **Software necessario**:
  - Docker e Docker Compose installati.
  - Editor di testo o IDE (opzionale per modifiche).

- **Configurazione del file `.env`**:
  È necessario un file `.env` per configurare le variabili sensibili. È importante che venga utilizzata
  ```plaintext
  MONGO_URI=your_mongo_connection_string
  JWT_SECRET=your_jwt_secret
  JWT_REFRESH_SECRET=your_jwt_refresh_secret
  RESEND_API_KEY=your_resend_api_key
