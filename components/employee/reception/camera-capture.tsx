'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  // @ts-ignore
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void; // Para vista previa inmediata local
  onUploadComplete?: (s3Url: string, faces: any[]) => void; // Para cuando el backend responda
}

export default function CameraCapture({ onCapture, onUploadComplete }: CameraCaptureProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const take = async () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);

    // B. Iniciar proceso de subida al Backend
    if (onUploadComplete) {
      setIsUploading(true);
      try {
        // 1. Convertir Base64 a File
        const file = dataURLtoFile(dataUrl, `capture-${Date.now()}.png`);

        // 2. Preparar FormData
        const formData = new FormData();
        formData.append('file', file);

        // 3. Llamada al API (Asegúrate de que la URL sea correcta para tu entorno)
        // NOTA: Usa localhost si estás probando local, o tu variable de entorno
        const response = await fetch('http://localhost:8000/api/v1/files/upload-image-with-faces', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          try {
            // FastAPI envía los errores en formato JSON: { "detail": "Mensaje..." }
            const errorData = await response.json();

            // Extraemos el mensaje específico que escribiste en Python
            const mensajeBackend = errorData.detail || 'Error desconocido en el servidor';

            // A. Opción simple: Alerta nativa
            alert(`⚠️ Atención: ${mensajeBackend}`);

            // B. (Opcional) Si tuvieras un prop onError, lo llamarías aquí:
            // if (props.onError) props.onError(mensajeBackend);
          } catch (parseError) {
            // Si el backend se rompió feo y no mandó JSON (ej. 500 HTML)
            console.error('Error parseando respuesta:', parseError);
            alert('Ocurrió un error inesperado al procesar la imagen.');
          }
          setIsUploading(false);
          return; // Salimos de la función aquí para no ejecutar lo de abajo
          // throw new Error('Error en la subida al servidor');
        }

        const data = await response.json();

        // 4. Devolver datos finales (URL S3 + Rostros)
        onUploadComplete(data.url, data.faces);
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        alert('Hubo un error al procesar la imagen en el servidor.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 mx-auto">
        <Button type="button" onClick={start} variant="outline">
          Abrir cámara
        </Button>
        <Button type="button" onClick={take} variant="default">
          Tomar foto
        </Button>
      </div>
      <div className="mx-auto">
        <video ref={videoRef} autoPlay playsInline className={clsx('bg-black')} />
        <canvas ref={canvasRef} className="hidden w-1/2 aspect-square" />
      </div>
    </div>
  );
}
