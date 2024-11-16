import React, { useEffect, useState } from 'react';

interface CameraSelectionProps {
  onSelect: (deviceId: string) => void;
}

const CameraSelection: React.FC<CameraSelectionProps> = ({ onSelect }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getCameras = async () => {
      try {
        // Solicita permissão para acessar a câmera
        await navigator.mediaDevices.getUserMedia({ video: true });

        // Lista os dispositivos disponíveis
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
      } catch (error) {
        console.error("Erro ao acessar dispositivos de vídeo:", error);
      }
    };

    getCameras();
  }, []);

  const handleSelect = (deviceId: string) => {
    onSelect(deviceId); // Atualiza o deviceId no componente pai
  };

  return (
    <div>
      <h2>Selecione a Câmera:</h2>
      <select onChange={(e) => handleSelect(e.target.value)}>
        <option value="">Escolha uma câmera</option>
        {devices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Câmera ${device.deviceId}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CameraSelection;
