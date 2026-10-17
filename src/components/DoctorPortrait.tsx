import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';

interface DoctorPortraitProps {
  photo?: string;
  name: string;
  isBn: boolean;
  className?: string;
}

export const DoctorPortrait: React.FC<DoctorPortraitProps> = ({
  photo,
  name,
  isBn,
  className = 'h-56',
}) => {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className={`relative flex w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_115%,#d5eaf2_0%,#edf6f9_44%,#f8fbfc_100%)] ${className}`}>
      <div aria-hidden="true" className="absolute -left-12 -top-16 h-44 w-44 rounded-full border border-white/80" />
      <div aria-hidden="true" className="absolute -right-10 -bottom-24 h-52 w-52 rounded-full border border-white/80" />
      <div aria-hidden="true" className="absolute right-8 top-8 h-2 w-2 rounded-full bg-[#C9973B]/70" />
      <div aria-hidden="true" className="absolute bottom-9 left-12 h-1.5 w-1.5 rounded-full bg-[#2D8FC1]/40" />
      {photo && !hasImageError ? (
        <img
          src={photo}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setHasImageError(true)}
          className="relative z-10 h-40 w-40 rounded-full border-4 border-white object-cover object-top shadow-[0_12px_30px_rgba(14,58,83,0.2)] ring-1 ring-[#0E3A53]/10"
        />
      ) : (
        <div
          role="img"
          aria-label={name}
          className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full border-4 border-white bg-white/80 text-[#2D8FC1] shadow-[0_12px_30px_rgba(14,58,83,0.12)] ring-1 ring-[#0E3A53]/10"
        >
          <Stethoscope className="h-14 w-14 stroke-[1.35]" />
          <span className="absolute bottom-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0E3A53]/45">
            {isBn ? 'চিকিৎসক' : 'Doctor'}
          </span>
        </div>
      )}
    </div>
  );
};
