// src/components/App.tsx
import React, { useState } from 'react';
import '../styles/Home.css';
import logo from '../assets/logo-faceclass.png';
import CameraPreview from './CameraPreview';
import CameraSelection from './CameraSelection';

const App: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const handleStartCamera = () => {
    setIsCameraActive(true);
  };

  const handleSelectCamera = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <img src={logo} alt="Logo" className="logo" />
        </div>
      </header>

      <div className="content">
        {!isCameraActive ? (
          <button className="register-button" onClick={handleStartCamera}>
            REGISTRAR PRESENÇA
          </button>
        ) : (
          <>
            <CameraSelection onSelect={handleSelectCamera} />
            {selectedDeviceId && <CameraPreview deviceId={selectedDeviceId} />}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
