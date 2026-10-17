import React from 'react';
import doctorLeafletHtml from '../data/doctor-leaflet-generator.html?raw';

export const DoctorLeafletWorkspace: React.FC = () => (
  <iframe
    title="Anowara Medical Complex Doctor Leaflet Generator"
    srcDoc={doctorLeafletHtml}
    className="block w-full rounded-3xl border-0 bg-slate-100"
    style={{ height: '1600px', minHeight: '100vh' }}
  />
);
