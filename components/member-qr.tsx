"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function MemberQr({ value }: { value: string }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      color: { dark: "#0d6b3e", light: "#ffffff" },
      margin: 1,
      width: 180,
    }).then((dataUrl) => {
      if (active) {
        setSrc(dataUrl);
      }
    });

    return () => {
      active = false;
    };
  }, [value]);

  if (!src) {
    return <div className="h-[180px] w-[180px] animate-pulse rounded-3xl bg-black/5" />;
  }

  return <img src={src} alt="QR code membre" className="h-[180px] w-[180px] rounded-3xl" />;
}
