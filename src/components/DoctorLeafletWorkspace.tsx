import React from 'react';
import doctorLeafletHtml from '../data/doctor-leaflet-generator.html?raw';
import { CloudDesignerWorkspace } from './CloudDesignerWorkspace';

export const DoctorLeafletWorkspace: React.FC = () => (
  <CloudDesignerWorkspace
    title="Anowara Medical Complex Doctor Leaflet Generator"
    html={doctorLeafletHtml}
    workspace="doctor-leaflet"
  />
);
