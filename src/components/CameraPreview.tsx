import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import '../styles/Home.css';
import '../styles/CameraPreview.css';

interface CameraPreviewProps {
  deviceId: string;
  onCapture: () => void;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({ deviceId, onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false); // Indicador de carregamento
  const [message, setMessage] = useState<string | null>(null); // Mensagem de sucesso ou erro

  const capture = useCallback(() => {
    const image = webcamRef.current?.getScreenshot();
    onCapture(); // Responsável por executar ações quando o botão de capturar a foto for acionado
    if (image) {
      setLoading(true); // Inicia o carregamento
      setMessage(null); // Reseta as mensagens anteriores

      // Enviar a imagem para o backend (Python)
      fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: image }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false); // Para o carregamento
          setMessage(data.message);
        })
        .catch((error) => {
          setLoading(false); // Para o carregamento
          setMessage('Erro ao processar a imagem. Tente novamente.');
          console.error('Erro ao enviar imagem para o backend:', error);
        });
    }
  }, [webcamRef, onCapture]);

  const handleNewCapture = () => {
    // Redireciona para a home
    window.location.href = '/'; // Pode ser ajustado dependendo do roteamento utilizado no app
  };

  const handleManualInsert = () => {
    // Redireciona para a página de inserção manual
    window.location.href = '/manual'; // Ajuste conforme necessário para a rota de inserção manual
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
    </div>
  );
};

export default CameraPreview;
