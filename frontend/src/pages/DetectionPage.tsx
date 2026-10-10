import React from 'react';
import { MediaUploadDetector } from '../components/detection/MediaUploadDetector';
import { UploadCloud, Info, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DetectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight flex items-center gap-2.5">
            <UploadCloud className="w-7 h-7 text-cyan-400" />
            <span>Upload &amp; Detect Road Hazards</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload your road photos or dashcam videos to detect potholes, standing water, and road obstructions in real-time.
          </p>
        </div>

        <button
          onClick={() => navigate('/map')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300 transition-colors self-start sm:self-auto"
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>View Live Google Map</span>
        </button>
      </div>

      {/* UPLOAD & DETECTION COMPONENT */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-xl">
        <MediaUploadDetector onNavigateToMap={() => navigate('/map')} />
      </div>

      {/* HELPFUL TIPS CARD */}
      <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/80 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
          <Info className="w-4 h-4" />
          <span>How to Get the Best Results</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 leading-relaxed">
          <li><strong>Photos:</strong> Capture a clear forward road angle showing the asphalt surface.</li>
          <li><strong>Videos:</strong> Upload standard dashcam footage (.mp4, .webm). You can pause at any second to inspect specific road defects.</li>
          <li><strong>Real Hazard Detection:</strong> The system automatically extracts bounding boxes, computes risk levels, and generates safe deceleration advisories.</li>
        </ul>
      </div>

    </div>
  );
};
