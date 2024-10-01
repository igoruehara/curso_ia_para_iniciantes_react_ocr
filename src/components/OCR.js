import React, { useState } from 'react';
import axios from 'axios';
import './OCR.css';

const OCR = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file.size > maxSize) {
        alert('O arquivo excede o tamanho máximo de 5MB.');
        return;
      }

      setImage(e.target.files[0]);
      setText('');
      setProgress(0);
    }
  };

  const handleOCR = async () => {
    if (!image) {
      alert('Por favor, faça upload de uma imagem primeiro.');
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      setText(response.data.text);
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro durante o processo de OCR.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="ocr-container">
      <h1>React OCR com Backend</h1>
      
      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {image && (
        <div className="image-preview">
          <img src={URL.createObjectURL(image)} alt="Uploaded" />
        </div>
      )}

      {image && (
        <button onClick={handleOCR} disabled={isProcessing}>
          {isProcessing ? 'Processando...' : 'Iniciar OCR'}
        </button>
      )}

      {isProcessing && (
        <div className="progress-section">
          <progress value={progress} max="100"></progress>
          <span>{progress}%</span>
        </div>
      )}

      {text && (
        <div className="result-section">
          <h2>Texto Extraído:</h2>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default OCR;