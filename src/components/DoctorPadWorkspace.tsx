import React from 'react';
import doctorPadHtml from '../data/doctor-pad-generator.html?raw';

export const DoctorPadWorkspace: React.FC = () => (
  <iframe
    title="Anowara Medical Complex Doctor Pad Generator"
    srcDoc={doctorPadHtml}
    className="block w-full rounded-3xl border-0 bg-slate-100"
    style={{ height: '1600px', minHeight: '100vh' }}
  />
);
