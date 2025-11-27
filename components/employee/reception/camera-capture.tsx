'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { getSpiritType } from '@/lib/api';
import { SpiritType } from '@/lib/types';
import { toLowerCase } from 'zod';

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  // @ts-expect-error expected error
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export interface DetectedFace {
  x: number;
  y: number;
  w: number;
  h: number;
  area: number;
}

interface CameraCaptureProps {
  typeId: string;
  onCapture: (dataUrl: string) => void; // Para vista previa inmediata local
  onUploadComplete?: (s3Url: string, faces: DetectedFace[]) => void; // Para cuando el backend responda
  onError?: (message: string) => void;
}

export default function CameraCapture({ typeId, onCapture, onUploadComplete, onError }: CameraCaptureProps) {
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

        if (!typeId) {
          console.error('ERROR CRÍTICO: No hay typeId seleccionado.');
          alert('Error: No se ha seleccionado el tipo de espíritu.');
          setIsUploading(false);
          return;
        }
        let templateName = '';
        try {
          const type = await getSpiritType(typeId);
          if (!type || !type.name || !type.image) {
            throw new Error("El objeto 'type' no es válido.");
          }
          // Aseguramos minúsculas/mayúsculas según tu S3.
          // Si en S3 es "onryo.png", usa toLowerCase().
          templateName = type.image;
        } catch (typeError) {
          console.error('Error obteniendo tipo de espíritu:', typeError);
          alert('Error al identificar el tipo de espíritu.');
          setIsUploading(false);
          return;
        }

        // 4. Preparar EL ÚNICO FormData
        const formData = new FormData();
        // Agregamos el archivo (asegurando nombre)
        formData.append('user_file', file, 'user_capture.png');
        // Agregamos el template (ahora seguro que existe)
        formData.append('template_filename', templateName);

        // Debugging (Opcional)
        console.log(`Enviando: File=${file.size}bytes, Template=${templateName}`);

        // 5. Llamada ÚNICA al API
        const response = await fetch(`http://localhost:8004/files/upload-image-with-faces`, {
          method: 'POST',
          body: formData,
          // NO PONGAS HEADERS MANUALES DE CONTENT-TYPE AQUÍ
        });

        // 6. Manejo de Errores HTTP
        if (!response.ok) {
          try {
            const errorData = await response.json();
            const mensajeBackend = errorData.detail || 'Error desconocido';
            alert(`⚠️ Atención: ${mensajeBackend}`);
          } catch (parseError) {
            console.error('Error parseando respuesta de error:', parseError);
            alert('Error 500: El servidor falló internamente.');
          }
          setIsUploading(false);
          return;
        }

        // 7. Éxito
        const data = await response.json();

        // Aquí asumimos que data tiene { url: "...", status: "...", faces: [] }
        onUploadComplete(data.url, data.faces || []);
      } catch (error) {
        console.error('Error de red o inesperado:', error);
        alert('Hubo un error de conexión al subir la imagen.');
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
