# Streaming App

## Descrizione

L'applicazione consiste in un prototipo ad alto livello di una piattaforma online di streaming di film e serie TV, nella quale è possibile navigare attraverso una vasta gamma di titoli e vederne i dettagli.
## Premessa

Dato che la maggior parte dei contenuti multimediali dei titoli sono protetti da copyright, l'app si limita a mostrare i trailer dei film e delle serie TV.

## Link

https://streamingapp-8662c.web.app

## Linguaggi

- TypeScript
- JavaScript
- CSS
- HTML

## Librerie

- React
- React Router
- Tailwind CSS

## API

- TMDB API: https://developer.themoviedb.org/docs

## Altri strumenti

- Firebase authentication
- Firestore Database

## Funzioni

- Visione del titolo in evidenza
- Navigazione tra i titoli più popolati, più votati e quelli in arrivo
- Filtraggio per film o serie TV
- Possibilità di aggiungere un titolo alla lista dei salvati

<img src="./assets/images/home.png" width="600">

- Panoramica generale del titolo
- Lista degli episodi (solo per le serie TV)
- Dettagli del titolo
- Lista dei correlati

<img src="./assets/images/title.png" width="600">

- Ricerca di un titolo specifico, e dei suoi correlati, tramite barra di ricerca

<img src="./assets/images/search.png" width="600">

- Creazione di un account
- Visione della lista dei titoli salvati
- Personalizzazione della foto di profilo
- Verifica dell'account tramite email
- Cambio della password

<img src="./assets/images/profile.png" width="600">

- Funzioni base di una PWA:

    1. Installabile
    2. Collegamento alla pagina di fallback in caso di assenza di connessione ad internet

- Invio di notifiche desktop quando:

    1. L'utente ha effettuato la registrazione
    2. L'utente ha cambiato la propria password
    3. Si è verificato un errore durante il login

## Gerarchia dei componenti

<img src="./assets/images/components-relations.png" width="600">

## Componenti

### App

- Si occupa del rendering di tutti gli altri componenti
- Implementa un sistema di routing per la navigazione tra le varie pagine, grazie alla libreria *React Router*
- Gestisce la creazione e la modifica dello stato globale dell'app

### Navbar

- Componente dedito alla navigazione tra le pagine principali e alla ricerca dei titoli tramite nome
### SmoothScrool

- Implenta un'animazione di scorrimento fino all'inizio della pagina

### Home/Film/Series

- *Home* rappresenta la pagina iniziale con la quale si apre si sito, dove si possono visualizzare i contenuti di ogni tipo
- *Film* e *Series* rappresentano le pagine i cui contenuti sono filtrati rispettivamente per film e serie TV

### TitleSlider/EpisodeSlider

- Sono le componenti che implementano uno slider per la navigazione tramite scorrimento, rispettivamente dei titoli e degli episodi di una serie TV

### TitleSliderCell/EpisodeSliderCell

- Rappresentano le singole celle che costituiscono rispettivamente *TitleSlider* e *EpisodesSlider*

### Search

- Rappresenta la pagina di ricerca dei titoli, che si apre in automatico una volta che l'utente scrive nella barra di ricerca
### Title

- Rappresenta la pagina di un determinato titolo
- Gestisce tutto il sistema di richieste dei dati del titolo in questione

### Watch

- Rappresenta la pagina di visualizzazione del contenuto video

### Profile

- Rappresenta la pagina accedibile tramite navbar, contenente le informazioni dell'account dell'utente

### ProfilePic

- Singola componente che rappresenta una pic per il profilo
- Più *ProfilePic* formano il box di scelta della pic visualizzata nella pagina *profile*

### Login

- Rapprensenta la pagina accedibile tramite navbar, in cui l'utente può effettuare l'accesso

### Register

- Rapprensenta la pagina accedibile tramite navbar, in cui l'utente può effettuare la registrazione

### Verification

- Rappresenta la pagina dove viene rimandato l'utente una volta effettuata la registrazione, o se decide di verificare l'email in un momento successivo tramite l'icona "<img src="./src/images/not-verified.svg" width="16" style="transform: translateY(3px)">"

### ChangePassword

- Rappresenta la pagina dove viene rimandato l'utente in caso decida di cambiare la propria password

## Gestione delle richieste all'API TMDB

<img src="./assets/images/requests-managment.png" width="300">