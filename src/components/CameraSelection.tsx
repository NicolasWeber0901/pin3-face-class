// src/components/CameraSelection.tsx
import React, { useEffect, useState } from 'react';

interface CameraSelectionProps {
  onSelect: (deviceId: string) => void;
}

const CameraSelection: React.FC<CameraSelectionProps> = ({ onSelect }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  
  useEffect(() => {
    const getCameras = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
    };

    getCameras();
  }, []);

  return (
    <div>
      <h2>Selecione a Câmera:</h2>
      <select onChange={(e) => onSelect(e.target.value)}>
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
