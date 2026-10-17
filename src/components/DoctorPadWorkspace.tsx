import React from 'react';
import doctorPadHtml from '../data/doctor-pad-generator.html?raw';
import { CloudDesignerWorkspace } from './CloudDesignerWorkspace';

export const DoctorPadWorkspace: React.FC = () => (
  <CloudDesignerWorkspace
    title="Anowara Medical Complex Doctor Pad Generator"
    html={doctorPadHtml}
    workspace="doctor-pad"
  />
);
