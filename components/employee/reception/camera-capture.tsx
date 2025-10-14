'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

export default function CameraCapture({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  React.useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e) {
      console.error(e);
    }
  };

  const take = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
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
