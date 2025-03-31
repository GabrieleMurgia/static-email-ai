import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import imageCompression from 'browser-image-compression';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [status, setStatus] = useState('');

  // Funzione per gestire il caricamento e la compressione dell'immagine
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Opzioni per la compressione
    const options = {
      maxSizeMB: 0.03, // circa 50KB
      maxWidthOrHeight: 800, // dimensione massima (modifica in base alle tue esigenze)
      useWebWorker: true,
    };

    try {
      // Comprime il file
      const compressedFile = await imageCompression(file, options);

      debugger

      // Converte il file compresso in Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        // Il risultato contiene la stringa Base64 (es: "data:image/png;base64,...")
        setFileBase64(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Errore durante la compressione", error);
      setStatus('Errore durante la compressione dell\'immagine.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !fileBase64) {
      setStatus('Per favore, inserisci una email e carica un\'immagine.');
      return;
    }

    // Parametri da passare al template di EmailJS
    const templateParams = {
      user_email: email,
      file_base64: fileBase64, // Invia la stringa Base64 dell'immagine
    };

    emailjs.send(
      'service_uf0lynz',      // Il tuo Service ID
      'template_g6gcbp9',     // Il tuo Template ID
      templateParams,
      'hWySam3hfchbGNISL'     // La tua Public Key
    )
    .then(
      (response) => {
        setStatus('Email inviata con successo!');
      },
      (err) => {
        console.error(err);
        setStatus('Errore durante l\'invio dell\'email.');
      }
    );
  };

  return (
    <div className="App">
      <h1>Carica immagine e invia email</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Seleziona immagine:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label>Inserisci la tua email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="esempio@dominio.com"
          />
        </div>
        <button type="submit">Invia</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default App;
