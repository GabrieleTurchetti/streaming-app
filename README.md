# Streaming App

## Descrizione

L'applicazione consiste in una piattaforma online di streaming di film e serie TV, nella quale è possibile navigare attraverso una vasta gamma di titoli, vederne i dettagli e prendere visione del contenuto video effettivo.

</br>

## Premessa

Dato che la maggior parte dei contenuti multimediali dei titoli sono protetti da copyright, l'app si limita a mostrare altri tipi di video, come ad esempio i trailer dei film e delle serie TV.

</br>

## Linguaggi

- TypeScript
- JavaScript
- CSS
- HTML

</br>

## Librerie

- React
- React Router
- Tailwind CSS

</br>

## API

- TMDB API: https://developer.themoviedb.org/docs

</br>

## Altri strumenti

- Firebase authentication
- Firestore Database

</br>

## Funzioni

- Navigazione tra i titoli più popolati, più votati e quelli in arrivo
- Visione del titolo in evidenza tramite tasto *play*
- Collegamento alla pagina principale del titolo in evidenza tramite tasto *info*
- Filtraggio per film o serie TV

</br>

<img src="./assets/images/home.png" width="600">

</br>

- Panoramica generale del titolo
- Lista degli episodi (solo per le serie TV)
- Dettagli del titolo
- Lista dei correlati

</br>

<img src="./assets/images/title.png" width="600">

</br>

- Ricerca di un titolo specifico, e dei suoi correlati, tramite barra di ricerca

</br>

<img src="./assets/images/search.png" width="600">

</br>

- Creazione di un account
- Personalizzazione della foto di profilo
- Verifica dell'account tramite email
- Cambio della password

</br>

<img src="./assets/images/profile.png" width="600">

</br>

- Funzioni base di una PWA:

    1. Installabile
    2. Collegamento alla pagina di fallback in caso di assenza di connessione ad internet

</br>

- Invio di notifiche desktop quando:

    1. L'utente ha effettuato la registrazione
    2. L'utente ha cambiato la propria password
    3. Si è verificato un errore durante il login

</br>

## Struttura del progetto

### App.tsx:

- Si occupa del rendering delle varie pagine e dei componenti attraverso il sistema di routing offerto dalla libreria *React Router*
- Gestisce la creazione e la modifica dello stato globale dell'app

</br>

### pages:

- Contiene i file dei componenti che rappresentano le pagine effettive visualizzabili nella piattaforma

</br>

### components:

- Contiene i file delle singole componenti che verranno utilizzate in *App.tsx*, nei file di *pages* e in altre componenti della cartella stessa *components*

</br>

### requests

- Qui vengono gestite tutte le richieste all'API TMDB, formattate nella corretta maniera ed esportate alle componenti che ne richiederanno i dati

</br>

### index.html

- E' la pagina principale dove verranno renderizzati gli elementi tramite la libreria *React*

</br>

### offline.html

- E' la pagina di fallback che verrà automaticamente visualizzata in mancanza di connessione ad internet

</br>

<img src="./assets/images/structure.png" width="600">
