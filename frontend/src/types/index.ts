export type HazardType = 'pothole' | 'debris' | 'fallen_tree' | 'waterlogging' | 'clear';

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';

export type VehicleType = 'passenger_car' | 'emergency' | 'commercial' | 'bus' | 'service';

export interface BoundingBox {
  x: number;      // percentage (0 - 100)
  y: number;      // percentage (0 - 100)
  width: number;  // percentage (0 - 100)
  height: number; // percentage (0 - 100)
}

export interface Detection {
  id: string;
  hazard_type: HazardType | string;
  confidence: number;
  severity: SeverityLevel | string;
  risk_score: number;
  recommended_speed_kmh: number;
  recommended_actions: string[];
  vehicle_type: VehicleType | string;
  location: string;
  road_condition: string;
  weather: string;
  visibility: string;
  explanation: string;
  timestamp: string;
  bounding_box?: BoundingBox | null;
  image_url?: string | null;
  is_demo: boolean;
}

export interface DetectRequest {
  hazard_type?: string;
  vehicle_type?: string;
  current_speed_kmh?: number;
  posted_speed_limit_kmh?: number;
  weather?: string;
  visibility?: string;
  location?: string;
  image_url?: string;
}

export interface AdvisoryRequest {
  hazard_type: string;
  risk_score: number;
  severity: string;
  vehicle_type: string;
  current_speed_kmh: number;
  posted_speed_limit_kmh: number;
  weather: string;
  visibility: string;
}

export interface AdvisoryResponse {
  recommended_speed_kmh: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | string;
  recommended_actions: string[];
  reason: string;
  disclaimer: string;
}

export interface Alert {
  id: string;
  detection_id: string;
  hazard_type: string;
  severity: string;
  risk_score: number;
  recommended_speed_kmh: number;
  location: string;
  timestamp: string;
  status: string;
  vehicle_type: string;
}

export interface Statistics {
  total_detections: number;
  high_risk_hazards: number;
  active_alerts: number;
  road_segments_monitored: number;
  waterlogging_events: number;
  average_road_health: number;
  mode: string;
  disclaimer: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  health_score: number;
  status: string;
  length_km: number;
  last_surveyed: string;
  potholes: number;
  waterlogging: number;
  debris: number;
  trees: number;
}

export interface RoadHealth {
  score: number;
  status: string;
  pothole_incidents: number;
  waterlogging_incidents: number;
  debris_incidents: number;
  tree_incidents: number;
  disclaimer: string;
  segments: RoadSegment[];
}

export interface EnvironmentalMetric {
  road_disruption_index: number;
  estimated_congestion_delay_min: number;
  estimated_idle_fuel_penalty_liters: number;
  estimated_excess_co2_kg: number;
  waterlogging_flood_risk: string;
  label: string;
  disclaimer: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  accuracy: string;
  speed: string;
  memory: string;
  status: string;
  latency_ms: number;
  architecture: string;
  supported_hazards: string[];
  disclaimer: string;
}

export interface VehicleProfile {
  id: string;
  vehicle_type: string;
  name: string;
  active_units: number;
  avg_advisory_speed: number;
  risk_events: number;
  dynamics?: {
    braking_multiplier: number;
    maneuverability: string;
    priority?: string;
    cargo_shift_risk?: string;
    passenger_inertia_risk?: string;
  };
}
