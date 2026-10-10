from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class BoundingBox(BaseModel):
    x: float = Field(..., description="Top left x percentage 0-100")
    y: float = Field(..., description="Top left y percentage 0-100")
    width: float = Field(..., description="Box width percentage 0-100")
    height: float = Field(..., description="Box height percentage 0-100")

class Detection(BaseModel):
    id: str
    hazard_type: str
    confidence: float
    severity: str
    risk_score: int
    recommended_speed_kmh: int
    recommended_actions: List[str]
    vehicle_type: str
    location: str
    road_condition: str
    weather: str
    visibility: str
    explanation: str
    timestamp: str
    bounding_box: Optional[BoundingBox] = None
    image_url: Optional[str] = None
    is_demo: bool = True

class DetectRequest(BaseModel):
    hazard_type: Optional[str] = None
    vehicle_type: Optional[str] = "passenger_car"
    current_speed_kmh: Optional[int] = 60
    posted_speed_limit_kmh: Optional[int] = 60
    weather: Optional[str] = "clear"
    visibility: Optional[str] = "daylight"
    location: Optional[str] = "OMR Demo Corridor"
    image_url: Optional[str] = None

class AdvisoryRequest(BaseModel):
    hazard_type: str
    risk_score: int
    severity: str
    vehicle_type: str = "passenger_car"
    current_speed_kmh: int = 60
    posted_speed_limit_kmh: int = 60
    weather: str = "clear"
    visibility: str = "daylight"

class AdvisoryResponse(BaseModel):
    recommended_speed_kmh: int
    risk_level: str
    recommended_actions: List[str]
    reason: str
    disclaimer: str = "Prototype safety recommendation — does not replace legal traffic rules or driver judgment."

class Alert(BaseModel):
    id: str
    detection_id: str
    hazard_type: str
    severity: str
    risk_score: int
    recommended_speed_kmh: int
    location: str
    timestamp: str
    status: str
    vehicle_type: str

class Statistics(BaseModel):
    total_detections: int
    high_risk_hazards: int
    active_alerts: int
    road_segments_monitored: int
    waterlogging_events: int
    average_road_health: int
    mode: str = "DEMO MODE"
    disclaimer: str = "Demo and simulated data for prototype demonstration."

class RoadHealth(BaseModel):
    score: int
    status: str
    pothole_incidents: int
    waterlogging_incidents: int
    debris_incidents: int
    tree_incidents: int
    disclaimer: str = "Prototype Road Health Index (Model-Based)"
    segments: List[Dict[str, Any]]

class EnvironmentalMetric(BaseModel):
    road_disruption_index: int
    estimated_congestion_delay_min: float
    estimated_idle_fuel_penalty_liters: float
    estimated_excess_co2_kg: float
    waterlogging_flood_risk: str
    label: str = "Estimated / Model-Based"
    disclaimer: str = "Camera systems do not directly measure emissions. Environmental metrics are derived from traffic slow-down and congestion models."

class ModelInfo(BaseModel):
    id: str
    name: str
    accuracy: str
    speed: str
    memory: str
    status: str
    latency_ms: int
    architecture: str
    supported_hazards: List[str]
    disclaimer: str = "Illustrative benchmark values for prototype evaluation."

class RouteAnalysisRequest(BaseModel):
    start: str
    destination: str

class RouteAnalysisResponse(BaseModel):
    summary: str
    known_incidents: int
    source: str
    disclaimer: str
