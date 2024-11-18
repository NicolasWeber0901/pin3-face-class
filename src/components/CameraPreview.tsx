import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Repository from '../repository/Repository';  // Corrija a importação aqui
import Modal from '../components/ModalManual';
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

  const capture = useCallback(async () => {
    const image = webcamRef.current?.getScreenshot();
    onCapture(); // Executa a ação do callback
    if (image) {
      setLoading(true); // Mostra carregamento
      setMessage(null); // Reseta a mensagem

      try {
        const backendMessage = await Repository.processaImagem(image); // Usando a instância do Repository
        setMessage(backendMessage); // Define a mensagem de sucesso
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(error.message); // Define a mensagem de erro
        } else {
          setMessage('Erro desconhecido. Tente novamente.'); // Mensagem genérica em caso de erro desconhecido
        }
      } finally {
        setLoading(false); // Esconde carregamento
      }
    }
  }, [webcamRef, onCapture]);

  const handleTentarNovamente = () => {
    window.location.href = '/';
  };

  const handleManualInsert = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
                <button className="new-capture-button" onClick={handleTentarNovamente}>
                  REALIZAR NOVA CAPTURA
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {isModalOpen && <Modal onClose={handleCloseModal} navigateToHome={handleTentarNovamente} />}
    </div>
  );
};

export default CameraPreview;
