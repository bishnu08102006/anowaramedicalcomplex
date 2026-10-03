import React, { useState } from 'react';

interface HospitalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'emblem' | 'full';
  alt?: string;
}

export const HospitalLogo: React.FC<HospitalLogoProps> = ({
  className = 'w-10 h-10',
  variant = 'full',
  alt = 'Anowara Medical Complex Logo'
}) => {
  const [imgError, setImgError] = useState(false);

  // User provided official logo URL
  const officialLogoUrl = 'https://i.postimg.cc/CKFmQGqw/Gemini-Generated-Image-iby2sziby2sziby2-removebg-preview.png';

  if (!imgError) {
    return (
      <div className={`relative shrink-0 flex items-center justify-center select-none overflow-hidden ${className}`}>
        <img
          src={officialLogoUrl}
          alt={alt}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain filter drop-shadow-xs"
        />
      </div>
    );
  }

  // Fallback vector SVG if image file is not reached
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full object-contain filter drop-shadow-xs select-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={alt}
        role="img"
      >
        <defs>
          <path id="anowara-arc" d="M 60,340 A 215,215 0 1,1 440,340" fill="none" />
        </defs>

        <text
          fill="#167A3B"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
          fontWeight="900"
          fontSize="33"
          letterSpacing="2.5px"
        >
          <textPath href="#anowara-arc" startOffset="50%" textAnchor="middle">
            ANOWARA MEDICAL COMPLEX
          </textPath>
        </text>

        <g id="logo-monogram">
          <path
            d="
              M 215, 130
              L 285, 130
              L 380, 415
              L 425, 415
              L 425, 450
              L 75, 450
              L 75, 415
              L 120, 415
              Z
            "
            fill="#BA1B1D"
          />

          <path
            d="
              M 170, 450
              C 170, 395 185, 335 215, 320
              C 230, 312 242, 338 250, 345
              C 258, 338 270, 312 285, 320
              C 315, 335 330, 395 330, 450
              Z
            "
            fill="#FFFFFF"
          />

          <path
            d="
              M 285, 365
              C 275, 355 264, 350 250, 350
              C 232, 350 220, 365 220, 388
              C 220, 411 232, 426 250, 426
              C 264, 426 275, 421 285, 411
              L 295, 423
              C 282, 437 267, 444 249, 444
              C 220, 444 203, 421 203, 388
              C 203, 355 220, 332 249, 332
              C 267, 332 282, 339 295, 353
              Z
            "
            fill="#BA1B1D"
          />
        </g>
      </svg>
    </div>
  );
};
