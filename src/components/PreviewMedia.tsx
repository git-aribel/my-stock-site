"use client";

import { useRef, useState } from "react";

type Props = {
  imageUrl: string | null;
  videoUrl: string | null;
  alt: string;
};

export default function PreviewMedia({ imageUrl, videoUrl, alt }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  function start() {
    if (!videoUrl) return;
    setActive(true);
    videoRef.current?.play().catch(() => {});
  }

  function stop() {
    setActive(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  }

  return (
    <div className="absolute inset-0" onMouseEnter={start} onMouseLeave={stop}>
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
      )}
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={imageUrl ?? undefined}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            active ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
