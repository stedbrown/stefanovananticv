# Assistente CV di Stefano Vananti

Un'applicazione web interattiva che permette di fare domande sul CV di Stefano Vananti utilizzando il riconoscimento vocale e l'intelligenza artificiale.

## Caratteristiche

- **Interfaccia Interattiva**: Visualizzazione grafica animata che reagisce alla voce
- **Riconoscimento Vocale**: Supporto per il riconoscimento vocale in italiano
- **Risposte AI**: Utilizza OpenAI GPT-3.5 per rispondere alle domande sul CV
- **Tema Chiaro/Scuro**: Supporto per tema chiaro e scuro
- **Effetti Sonori**: Feedback audio per migliorare l'esperienza utente
- **Visualizzazione Audio**: Animazione reattiva all'input audio

## Tecnologie Utilizzate

- React
- TypeScript
- Tailwind CSS
- OpenAI API
- Web Speech API
- Web Audio API
- Canvas API

## Installazione

1. Clona il repository
   ```
   git clone https://github.com/stedbrown/stefanovananticv.git
   cd stefanovananticv
   ```

2. Installa le dipendenze:
   ```
   npm install
   ```

3. Crea un file `.env` nella root del progetto con la tua chiave API OpenAI:
   ```
   VITE_OPENAI_API_KEY=la_tua_chiave_api
   ```

4. Avvia l'applicazione in modalità sviluppo:
   ```
   npm run dev
   ```

## Deploy su GitHub Pages

Per effettuare il deploy dell'applicazione su GitHub Pages:

1. Installa il pacchetto gh-pages:
   ```
   npm install --save-dev gh-pages
   ```

2. Aggiungi questi script al tuo `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Configura la base URL nel file `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/stefanovananticv/',
     // altre configurazioni...
   });
   ```

4. Esegui il comando di deploy:
   ```
   npm run deploy
   ```

5. Configura GitHub Pages nelle impostazioni del repository per utilizzare il branch `gh-pages`.

## Struttura del Progetto

- `/src/components`: Componenti React
- `/src/hooks`: Hook personalizzati
- `/src/utils`: Utility e funzioni helper
- `/src/types`: Definizioni dei tipi TypeScript
- `/src/constants`: Costanti dell'applicazione

## Sicurezza

**Importante**: Questa applicazione utilizza `dangerouslyAllowBrowser: true` per le chiamate API OpenAI, che è accettabile solo per un progetto dimostrativo ma non è consigliato per un'applicazione in produzione. 

In un ambiente di produzione, è necessario:
1. Utilizzare un backend per gestire le chiamate API
2. Non esporre mai la chiave API nel frontend
3. Implementare rate limiting e altre misure di sicurezza

## Licenza

MIT 