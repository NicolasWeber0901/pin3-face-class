// src/components/CameraPreview.tsx
import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import '../styles/Home.css';

interface CameraPreviewProps {
  deviceId: string;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({ deviceId }) => {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);

  const capture = useCallback(() => {
    const image = webcamRef.current?.getScreenshot();
    if (image) {
      setImageSrc(image);
    }
  }, [webcamRef]);

  return (
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
      {imageSrc && (
        <div className="captured-image">
          <h2>Imagem Capturada:</h2>
          <img src={imageSrc} alt="Captura" />
        </div>
      )}
    </div>
  );
};

export default CameraPreview;
