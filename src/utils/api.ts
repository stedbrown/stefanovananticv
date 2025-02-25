import OpenAI from 'openai';
import { CV_SYSTEM_PROMPT } from '../constants/prompts';

// Inizializza il client OpenAI
const createOpenAIClient = () => {
  // In un ambiente di produzione, questa chiave dovrebbe essere gestita da un backend
  // e non esposta nel frontend. Questa implementazione è solo per scopi dimostrativi.
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key mancante. Aggiungerla al file .env.');
  }

  // NOTA: In produzione, rimuovere dangerouslyAllowBrowser e utilizzare un backend
  // per gestire le chiamate API in modo sicuro
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // ATTENZIONE: Usare solo per demo, non in produzione
  });
};

// Funzione per ottenere una risposta da ChatGPT
export const getChatGPTResponse = async (text: string): Promise<string> => {
  try {
    const openai = createOpenAIClient();

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: CV_SYSTEM_PROMPT 
        },
        { 
          role: "user", 
          content: text 
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error getting ChatGPT response:', error);
    throw new Error('Errore di connessione a ChatGPT. Verifica la tua API key e riprova.');
  }
}; 