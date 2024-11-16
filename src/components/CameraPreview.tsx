import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Modal from '../components/ModalManual'
import '../styles/Home.css';
import '../styles/CameraPreview.css';

interface CameraPreviewProps {
  deviceId: string;
  onCapture: () => void;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({ deviceId, onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal

  const capture = useCallback(() => {
    const image = webcamRef.current?.getScreenshot();
    onCapture();
    if (image) {
      setLoading(true);
      setMessage(null);
      fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: image }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          setMessage(data.message);
        })
        .catch((error) => {
          setLoading(false);
          setMessage('Erro ao processar a imagem. Tente novamente.');
          console.error('Erro ao enviar imagem para o backend:', error);
        });
    }
  }, [webcamRef, onCapture]);

  const handleNewCapture = () => {
    window.location.href = '/';
  };

  const handleManualInsert = () => {
    setIsModalOpen(true); // Abre o modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Fecha o modal
  };

  return (
    <div className="camera-preview-container">
      {!loading && !message && (
        <div className="camera-preview">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={720}
            videoConstraints={{
              deviceId: deviceId ? { exact: deviceId } : undefined,
            }}
          />
          <button className="capture-button" onClick={capture}>
            REALIZAR CAPTURA
          </button>
        </div>
      )}

      {(loading || message) && (
        <div className="overlay">
          {loading ? (
            <p className="loading-message">Processando a imagem...</p>
          ) : (
            <div className="status-container">
              <p className={`status-message ${message?.includes('Erro') ? 'error' : 'success'}`}>
                {message}
              </p>
              <div className="action-buttons">
                {message?.includes('Erro') && (
                  <button className="manual-insert-button" onClick={handleManualInsert}>
                    INSERIR MANUALMENTE
                  </button>
                )}
                <button className="new-capture-button" onClick={handleNewCapture}>
                  REALIZAR NOVA CAPTURA
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {isModalOpen && <Modal onClose={handleCloseModal} />}
    </div>
  );
};

export default CameraPreview;
