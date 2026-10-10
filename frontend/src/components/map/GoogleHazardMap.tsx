// Source: Google Maps Platform Code Assist
// Apache-2.0 License
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { 
  MapPin, Navigation, Key, ExternalLink, ShieldCheck, 
  Layers, Search, CheckCircle2, AlertCircle, Compass, Gauge,
  ArrowRight, ArrowLeft, ArrowUp, XCircle, RefreshCw, Trash2
} from 'lucide-react';

declare const google: any;

export interface PinnedHazard {
  id: string;
  type: 'pothole' | 'waterlogging' | 'fallen_tree' | 'debris';
  title: string;
  lat: number;
  lng: number;
  locationName: string;
  riskScore: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  recommendedSpeedKmh: number;
  steeringText: string;
  driverAdvice: string;
  image: string;
  timestamp: string;
}

export type HazardItem = PinnedHazard;

// Preset popular cities for instant selection
const CITY_PRESETS = [
  { name: 'My Current GPS Location', lat: 0, lng: 0, isGps: true },
  { name: 'Chennai Central', lat: 13.0827, lng: 80.2707, isGps: false },
  { name: 'Guindy, Chennai', lat: 13.0067, lng: 80.2206, isGps: false },
  { name: 'OMR, Chennai', lat: 12.9654, lng: 80.2458, isGps: false },
  { name: 'Coimbatore Junction', lat: 11.0168, lng: 76.9558, isGps: false },
  { name: 'Madurai Junction', lat: 9.9252, lng: 78.1198, isGps: false },
  { name: 'Trichy Central Bus Stand', lat: 10.7905, lng: 78.7047, isGps: false },
  { name: 'Salem Junction', lat: 11.6643, lng: 78.1460, isGps: false },
  { name: 'Mahabalipuram', lat: 12.6269, lng: 80.1927, isGps: false },
];

// Subcomponent: Attaches Google's Official Live TrafficLayer onto the Map
const GoogleTrafficOverlay: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const map = useMap();
  const trafficLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps || !google.maps.TrafficLayer) return;

    if (!trafficLayerRef.current) {
      trafficLayerRef.current = new google.maps.TrafficLayer();
    }

    if (enabled) {
      trafficLayerRef.current.setMap(map);
    } else {
      trafficLayerRef.current.setMap(null);
    }

    return () => {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    };
  }, [map, enabled]);

  return null;
};

const GoogleRouteOverlay: React.FC<{
  origin: string;
  destination: string;
  onResult: (summary: string, points: Array<{ lat: number; lng: number }>) => void;
}> = ({ origin, destination, onResult }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !origin.trim() || !destination.trim()) return;

    const service = new google.maps.DirectionsService();
    const renderer = new google.maps.DirectionsRenderer({ map, suppressMarkers: false });
    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        region: 'IN'
      },
      (result: any, status: string) => {
        if (status !== 'OK' || !result?.routes?.length) {
          onResult('Google could not find a drivable route in Tamil Nadu for these locations.', []);
          return;
        }
        renderer.setDirections(result);
        const leg = result.routes[0].legs[0];
        const points = result.routes[0].overview_path.map((point: any) => ({ lat: point.lat(), lng: point.lng() }));
        onResult(`Route found: ${leg.distance.text} • ${leg.duration.text} • ${result.routes.length} option${result.routes.length === 1 ? '' : 's'}`, points);
      }
    );

    return () => renderer.setMap(null);
  }, [map, origin, destination, onResult]);

  return null;
};

interface GoogleHazardMapProps {
  className?: string;
  showControls?: boolean;
  onHazardSelect?: (hazard: PinnedHazard | null) => void;
  onVehicleTelemetry?: (t: any) => void;
}

export const GoogleHazardMap: React.FC<GoogleHazardMapProps> = ({
  className = '',
  showControls = true,
  onHazardSelect
}) => {
  // Read API Key from environment or localStorage
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('cyclops_gmaps_key') || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey);

  // User chosen location (Default: Mumbai or user GPS)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string }>({
    lat: 19.0760,
    lng: 72.8777,
    name: 'Mumbai Central Corridor'
  });
  const [locationStatus, setLocationStatus] = useState<string>('Select your location or tap "My Location"');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [routeOrigin, setRouteOrigin] = useState('');
  const [routeDestination, setRouteDestination] = useState('');
  const [routeRequested, setRouteRequested] = useState(false);
  const [routeStatus, setRouteStatus] = useState('Enter a start and destination to analyse a route.');
  const [routeAnalysis, setRouteAnalysis] = useState<string | null>(null);
  const [routeHazards, setRouteHazards] = useState<PinnedHazard[]>([]);

  const distanceToRouteMeters = useCallback((hazard: PinnedHazard, points: Array<{ lat: number; lng: number }>) => {
    if (!points.length) return Number.POSITIVE_INFINITY;
    const latScale = 111_000;
    return Math.min(...points.map(point => {
      const dx = (hazard.lng - point.lng) * latScale * Math.cos(point.lat * Math.PI / 180);
      const dy = (hazard.lat - point.lat) * latScale;
      return Math.sqrt(dx * dx + dy * dy);
    }));
  }, []);

  // Traffic Layer Toggle
  const [showTrafficLayer, setShowTrafficLayer] = useState<boolean>(true);

  // Real Pinned Hazards (Loaded from localStorage - only real uploads)
  const [pinnedHazards, setPinnedHazards] = useState<PinnedHazard[]>([]);
  const [selectedHazard, setSelectedHazard] = useState<PinnedHazard | null>(null);

  // Load pinned hazards from localStorage
  const loadPinnedHazards = useCallback(() => {
    try {
      const stored = localStorage.getItem('cyclops_pinned_hazards');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPinnedHazards(parsed);
          return;
        }
      }
      setPinnedHazards([]);
    } catch (e) {
      setPinnedHazards([]);
    }
  }, []);

  useEffect(() => {
    loadPinnedHazards();
    // Listen for storage events in case detection page pins an item
    const handler = () => loadPinnedHazards();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [loadPinnedHazards]);

  // Request User's Real GPS Location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Acquiring real GPS coordinates from device...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({
          lat,
          lng,
          name: `My GPS Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`
        });
        setLocationStatus(`GPS Locked: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (Accuracy: ±${Math.round(position.coords.accuracy)}m)`);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('GPS permission denied. Please pick a location from the dropdown.');
        } else {
          setLocationStatus('GPS signal timed out. Select a city from the list.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  // Preset City Selector
  const handleCitySelect = (cityName: string) => {
    const preset = CITY_PRESETS.find(p => p.name === cityName);
    if (!preset) return;

    if (preset.isGps) {
      handleGetLocation();
    } else {
      setUserLocation({
        lat: preset.lat,
        lng: preset.lng,
        name: preset.name
      });
      setLocationStatus(`Selected: ${preset.name}`);
    }
  };

  // Map Click to Set Inspection Point
  const handleMapClick = (e: any) => {
    const latLng = e.detail?.latLng;
    if (!latLng) return;
    setUserLocation({
      lat: latLng.lat,
      lng: latLng.lng,
      name: `Selected Road Point (${latLng.lat.toFixed(4)}°N, ${latLng.lng.toFixed(4)}°E)`
    });
    setLocationStatus(`Inspecting Road at ${latLng.lat.toFixed(4)}°N, ${latLng.lng.toFixed(4)}°E`);
  };

  // Clear all pinned hazards
  const clearPinnedHazards = () => {
    if (confirm('Clear all your real pinned hazards from the map?')) {
      localStorage.removeItem('cyclops_pinned_hazards');
      setPinnedHazards([]);
      setSelectedHazard(null);
    }
  };

  // Save API Key
  const saveApiKey = (newKey: string) => {
    const trimmed = newKey.trim();
    setApiKey(trimmed);
    localStorage.setItem('cyclops_gmaps_key', trimmed);
    setShowKeyModal(false);
  };

  const analyseRoute = async () => {
    if (!routeOrigin.trim() || !routeDestination.trim()) {
      setRouteStatus('Both start and destination are required.');
      return;
    }
    setRouteRequested(true);
    setRouteHazards([]);
    setRouteAnalysis('Finding the route, then checking known incidents against its road geometry...');
  };

  const handleRouteResult = useCallback((summary: string, points: Array<{ lat: number; lng: number }>) => {
    setRouteStatus(summary);
    if (!points.length) {
      setRouteHazards([]);
      setRouteAnalysis('No route geometry was returned, so no hazard claim can be made. Check the place names and Google Maps key.');
      return;
    }
    const matched = pinnedHazards.filter(hazard => distanceToRouteMeters(hazard, points) <= 150);
    setRouteHazards(matched);
    setRouteAnalysis(matched.length
      ? `${matched.length} known app hazard${matched.length === 1 ? '' : 's'} within 150 m of this route. Open each pin for the current evidence and driver response.`
      : 'No pinned app hazards are within 150 m of this route. This means no matching report is stored here, not that the road is guaranteed clear. Google traffic remains live.');
  }, [distanceToRouteMeters, pinnedHazards]);

  const getHazardIcon = (type: string) => {
    switch (type) {
      case 'pothole': return '🕳️';
      case 'waterlogging': return '🌊';
      case 'fallen_tree': return '🌲';
      case 'debris': return '📦';
      default: return '⚠️';
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-red-500 text-white border-red-300';
      case 'HIGH': return 'bg-orange-500 text-white border-orange-300';
      case 'MODERATE': return 'bg-amber-500 text-slate-950 border-amber-300';
      default: return 'bg-emerald-500 text-white border-emerald-300';
    }
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col ${className}`}>
      
      {/* 1. SIMPLE & CLEAN TOP CONTROL BAR */}
      {showControls && (
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-20">
          
          {/* Location Selection Dropdown & GPS Button */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
              title="Locate my vehicle via GPS"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Use My GPS Location'}</span>
            </button>

            {/* City Preset Selector */}
            <select
              value={userLocation.name}
              onChange={e => handleCitySelect(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
            >
              <option disabled value="">Choose a Location...</option>
              {CITY_PRESETS.map(c => (
                <option key={c.name} value={c.name}>
                  {c.isGps ? '📍' : '🏙️'} {c.name}
                </option>
              ))}
            </select>

            <span className="text-[11px] text-slate-400 hidden lg:inline font-mono">
              {locationStatus}
            </span>
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2">
            
            {/* Google Traffic Layer Toggle */}
            <button
              onClick={() => setShowTrafficLayer(!showTrafficLayer)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showTrafficLayer
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Toggle Google Real-Time Traffic Feed"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showTrafficLayer ? 'Google Live Traffic: ON' : 'Google Traffic: OFF'}</span>
            </button>

            {/* Reload Pinned Hazards */}
            <button
              onClick={loadPinnedHazards}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
              title="Refresh Real Pinned Hazards"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Clear Pinned Hazards if any exist */}
            {pinnedHazards.length > 0 && (
              <button
                onClick={clearPinnedHazards}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 text-xs border border-slate-700"
                title="Clear All Pinned Hazards"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Google Maps API Key Config */}
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
              title="Google Maps API Key Settings"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>{apiKey ? 'API Key Active' : 'Setup API Key'}</span>
            </button>
          </div>

        </div>
      )}

      {showControls && (
        <div className="grid grid-cols-1 gap-2 border-b border-slate-800 bg-slate-950 px-4 py-3 md:grid-cols-[1fr_1fr_auto]">
          <input list="tamil-nadu-places" value={routeOrigin} onChange={event => setRouteOrigin(event.target.value)} placeholder="Start: address or place in Tamil Nadu" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" />
          <input list="tamil-nadu-places" value={routeDestination} onChange={event => setRouteDestination(event.target.value)} placeholder="Destination: address or place in Tamil Nadu" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" />
          <button onClick={analyseRoute} className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300">Find route &amp; analyse</button>
          <datalist id="tamil-nadu-places">
            {CITY_PRESETS.filter(city => !city.isGps).map(city => <option key={city.name} value={`${city.name}, Tamil Nadu`} />)}
          </datalist>
          <div className="md:col-span-3 text-[11px] text-slate-400">{routeStatus}</div>
          {routeAnalysis && <div className="md:col-span-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-100">{routeAnalysis}</div>}
        </div>
      )}

      {/* 2. GOOGLE LIVE TRAFFIC ROAD HAZARD STATUS BANNER */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200">
            Google Maps Official Traffic Layer:
          </span>
          <span className="text-slate-400">
            {showTrafficLayer 
              ? 'Color overlays directly reflect Google real-time road speeds (Green = Clear, Yellow = Slow, Red = Congestion/Hazard)' 
              : 'Traffic layer paused'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-slate-400">User Pinned Hazards: <strong className="text-white">{pinnedHazards.length}</strong></span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Target Location: <strong className="text-cyan-400">{userLocation.lat.toFixed(3)}°N, {userLocation.lng.toFixed(3)}°E</strong></span>
        </div>
      </div>

      {/* 3. MAP CANVAS CONTAINER */}
      <div className="relative w-full h-[540px] sm:h-[620px] bg-slate-900">
        
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <Map
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_git_agentskills_v1']}
              defaultCenter={{ lat: userLocation.lat, lng: userLocation.lng }}
              center={{ lat: userLocation.lat, lng: userLocation.lng }}
              defaultZoom={15}
              zoom={15}
              gestureHandling="greedy"
              disableDefaultUI={false}
              onClick={handleMapClick}
              style={{ width: '100%', height: '100%' }}
            >
              {/* GOOGLE OFFICIAL LIVE TRAFFIC LAYER */}
              <GoogleTrafficOverlay enabled={showTrafficLayer} />
              {routeRequested && <GoogleRouteOverlay origin={routeOrigin} destination={routeDestination} onResult={handleRouteResult} />}

              {/* USER / VEHICLE LOCATION ADVANCED MARKER */}
              <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lng }} title={userLocation.name}>
                <div className="relative flex items-center justify-center cursor-pointer group">
                  <span className="absolute -inset-3 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />
                  <div className="w-11 h-11 rounded-full bg-slate-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.8)]">
                    <Navigation className="w-6 h-6 fill-cyan-400 text-cyan-400" />
                  </div>
                  <div className="absolute -bottom-6 whitespace-nowrap bg-slate-950/95 border border-slate-700 px-2.5 py-0.5 rounded-lg text-[10px] font-mono text-white shadow-lg">
                    {userLocation.name}
                  </div>
                </div>
              </AdvancedMarker>

              {/* ONLY USER'S REAL PINNED HAZARDS (NO FAKE / RANDOM ONES) */}
              {pinnedHazards.map(hazard => (
                <AdvancedMarker
                  key={hazard.id}
                  position={{ lat: hazard.lat, lng: hazard.lng }}
                  onClick={() => {
                    setSelectedHazard(hazard);
                    if (onHazardSelect) onHazardSelect(hazard);
                  }}
                  title={hazard.title}
                >
                  <div className="relative flex items-center justify-center cursor-pointer group transition-transform duration-200 hover:scale-125">
                    {hazard.severity === 'CRITICAL' && (
                      <span className="absolute -inset-3 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
                    )}
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-base shadow-2xl ${getSeverityBadge(hazard.severity)}`}>
                      <span>{getHazardIcon(hazard.type)}</span>
                    </div>
                    <div className="absolute -bottom-6 whitespace-nowrap bg-black/90 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                      {hazard.title}
                    </div>
                  </div>
                </AdvancedMarker>
              ))}

              {routeHazards.map(hazard => (
                <AdvancedMarker key={`route-${hazard.id}`} position={{ lat: hazard.lat, lng: hazard.lng }} title={`On route: ${hazard.title}`}>
                  <div className="rounded-md border-2 border-white bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-lg">ON ROUTE</div>
                </AdvancedMarker>
              ))}

              {/* INFO WINDOW FOR SELECTED HAZARD */}
              {selectedHazard && (
                <InfoWindow
                  position={{ lat: selectedHazard.lat, lng: selectedHazard.lng }}
                  onCloseClick={() => setSelectedHazard(null)}
                >
                  <div className="p-2 max-w-xs text-slate-900 font-sans">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getHazardIcon(selectedHazard.type)}</span>
                      <div>
                        <h4 className="text-sm font-bold leading-tight">{selectedHazard.title}</h4>
                        <p className="text-[11px] text-slate-500">{selectedHazard.locationName}</p>
                      </div>
                    </div>

                    {selectedHazard.image && (
                      <img 
                        src={selectedHazard.image} 
                        alt={selectedHazard.title} 
                        className="w-full h-24 object-cover rounded-lg mb-2 border border-slate-200" 
                      />
                    )}

                    <div className="grid grid-cols-2 gap-1.5 text-xs mb-2 bg-slate-100 p-2 rounded-lg font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Severity</span>
                        <span className="font-bold text-slate-900">{selectedHazard.severity} ({selectedHazard.riskScore}/100)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Safe Speed</span>
                        <span className="font-bold text-red-600">
                          {selectedHazard.recommendedSpeedKmh === 0 ? 'FULL STOP' : `${selectedHazard.recommendedSpeedKmh} km/h`}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-800 bg-amber-50 border border-amber-200 p-2 rounded-lg mb-2 font-medium">
                      <strong>Steering Advice:</strong> {selectedHazard.steeringText}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {selectedHazard.driverAdvice}
                    </p>
                  </div>
                </InfoWindow>
              )}

            </Map>
          </APIProvider>
        ) : (
          /* CLEAN ZERO-KEY INTERACTIVE LOCATION PICKER */
          <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-6 text-center bg-[#070D18]">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="cleanGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#38BDF8" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cleanGrid)" />
              </svg>
            </div>

            <div className="relative z-10 max-w-lg bg-slate-900/90 border border-slate-700/80 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-lg shadow-cyan-500/10">
                <MapPin className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Google Maps Live Traffic &amp; Tracking
              </h3>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                Connect your Google Maps API Key or activate the free <strong>Maps Demo Key</strong> to view real-time Google traffic congestion layers and pin your detected road hazards directly onto satellite street maps.
              </p>

              {/* Current Selected Location Status */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left mb-5">
                <div className="text-[11px] font-mono text-cyan-400 font-bold mb-1">
                  CURRENT CHOSEN LOCATION:
                </div>
                <div className="text-sm font-semibold text-white">
                  {userLocation.name}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Lat: {userLocation.lat.toFixed(4)}°N, Lng: {userLocation.lng.toFixed(4)}°E
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setShowKeyModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20"
                >
                  Enter Google Maps API Key
                </button>
                <a
                  href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                >
                  <span>Get Free Maps Demo Key (Instant, No Credit Card)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Pinned Hazards Summary */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                    Real Pinned Hazards:
                  </span>
                  <span className="text-xs text-cyan-400 font-bold">
                    {pinnedHazards.length} Detected
                  </span>
                </div>

                {pinnedHazards.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No hazards pinned yet. Upload a road photo or video in the "Upload &amp; Detect" tab, analyze it, and click "Pin to Google Map".
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {pinnedHazards.map(h => (
                      <div 
                        key={h.id}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{getHazardIcon(h.type)}</span>
                          <div>
                            <div className="text-xs font-semibold text-white">{h.title}</div>
                            <div className="text-[10px] text-slate-400">{h.locationName}</div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getSeverityBadge(h.severity)}`}>
                          {h.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 4. BOTTOM FLOATING ACTIONABLE ADVICE CARD (WHEN HAZARD IS SELECTED) */}
        {selectedHazard && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 bg-slate-900/95 border border-slate-700 text-white p-4 rounded-3xl shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{getHazardIcon(selectedHazard.type)}</span>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{selectedHazard.title}</h4>
                  <p className="text-xs text-slate-400">{selectedHazard.locationName}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getSeverityBadge(selectedHazard.severity)}`}>
                {selectedHazard.severity}
              </span>
            </div>

            {/* Driver Instructions */}
            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Safe Speed</span>
                <span className="text-sm font-bold text-cyan-300">
                  {selectedHazard.recommendedSpeedKmh === 0 ? 'STOP (0 km/h)' : `${selectedHazard.recommendedSpeedKmh} km/h`}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Steering Maneuver</span>
                <span className="text-xs font-bold text-amber-300 truncate block">
                  {selectedHazard.steeringText}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed mb-2">
              {selectedHazard.driverAdvice}
            </p>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              <span>Risk: <strong className="text-white">{selectedHazard.riskScore}/100</strong></span>
              <button 
                onClick={() => setSelectedHazard(null)} 
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Dismiss Card
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 5. GOOGLE MAPS API KEY CONFIGURATION MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Google Maps API Key</h3>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To render real Google Maps with live traffic feeds, paste your Google Maps Platform API Key below.
            </p>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                API Key (or Maps Demo Key):
              </label>
              <input
                type="text"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] text-cyan-200 leading-relaxed space-y-1.5">
              <strong className="text-cyan-300 block font-semibold">Free Instant Access (No Credit Card):</strong>
              <p>
                Get a free prototype key from Google's Maps Demo Key service:
              </p>
              <a 
                href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-300 underline font-semibold mt-1"
              >
                <span>Generate Free Maps Demo Key ↗</span>
              </a>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => saveApiKey(keyInput)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                Save &amp; Activate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
