// Script di fallback che viene eseguito se il bundle principale non si carica
console.log('Script di fallback caricato');

// Verifica se l'applicazione React è stata caricata
setTimeout(function() {
  // Se il contenitore di caricamento è ancora visibile dopo 10 secondi,
  // significa che l'applicazione React non è stata caricata correttamente
  if (document.querySelector('.loading-container')) {
    console.error('L\'applicazione React non è stata caricata correttamente');
    
    // Mostra il messaggio di errore
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
      errorElement.style.display = 'block';
      
      // Aggiungi un messaggio di errore specifico
      const errorMessageElement = document.createElement('p');
      errorMessageElement.textContent = 'Il bundle JavaScript principale non è stato caricato correttamente.';
      errorMessageElement.style.fontWeight = 'bold';
      errorElement.appendChild(errorMessageElement);
      
      // Aggiungi un link alla pagina di fallback statica
      const fallbackLink = document.createElement('a');
      fallbackLink.href = '/fallback.html';
      fallbackLink.textContent = 'Vai alla pagina di fallback statica';
      fallbackLink.style.display = 'inline-block';
      fallbackLink.style.marginTop = '1rem';
      fallbackLink.style.color = 'white';
      errorElement.appendChild(fallbackLink);
    }
  }
}, 10000); 