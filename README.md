# Streaming App

## Descrizione

L'applicazione consiste in una piattaforma di streaming di film e serie TV, nella quale è possibile navigare attraverso una vasta gamma di titoli.

</br>

## Premessa

Essendo difficilmente reperibili i contenuti multimediali effettivi dei titoli, in maniera gratis e legale, l'app si limita a mostrare un altro contenuto video, come ad esempio il trailer del film o della serie TV.

</br>

## Linguaggi

- TypeScript
- JavaScript
- CSS
- HTML

</br>

## Librerie

- React
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
- Fitraggio per film o serie TV

<img src="./assets/images/home.png" width="600">

</br>

- Panoramica generale del titolo
- Lista degli episodi (solo per le serie TV)
- Dettagli del titolo
- Lista dei correlati

<img src="./assets/images/title.png" width="600">

</br>

- Ricerca di un titolo specifico, e dei suoi correlati, tramite barra di ricerca

<img src="./assets/images/search.png" width="600">

</br>

- Creazione di un account
- Personalizzazione della foto di profilo
- Verifica dell'account tramite email
- Cambio della password

<img src="./assets/images/profile.png" width="600">

</br>

- Funzioni base di una PWA:

    1. Installabile
    2. Collegamento alla pagina di fallback in caso di assenza di connessione

</br>

- Invio di notifiche desktop quando:

    1. L'utente ha effettuato la registrazione
    2. L'utente ha cambiato la propria password
    3. Si è verificato un errore durante il login