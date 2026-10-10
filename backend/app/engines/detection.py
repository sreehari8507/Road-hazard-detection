from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import uuid
from datetime import datetime
from ..models.schemas import Detection, BoundingBox

class DetectionEngine(ABC):
    """Abstract Base Class for CYCLOPS Road Hazard Detection Engines."""
    
    @abstractmethod
    def detect(self, hazard_type: Optional[str] = None, vehicle_type: str = "passenger_car",
               current_speed_kmh: int = 60, posted_speed_limit_kmh: int = 60,
               weather: str = "clear", visibility: str = "daylight",
               location: str = "OMR Demo Corridor", image_url: Optional[str] = None) -> Detection:
        """Process road image/telemetry and detect hazards."""
        pass


class MockDetectionEngine(DetectionEngine):
    """
    Simulation detection engine designed for lightweight environments (e.g. 8 GB RAM).
    Generates realistic, physically sound hazard detections with bounding boxes and explanations.
    """
    
    PRESET_HAZARDS = {
        "pothole": {
            "name": "Pothole",
            "confidence": 0.94,
            "severity": "high",
            "base_risk": 87,
            "recommended_speed": 30,
            "road_condition": "Degraded Asphalt / Severe Crater",
            "bbox": BoundingBox(x=37.0, y=43.0, width=30.0, height=20.0),
            "explanation": "Severe road cavity detected in primary lane trajectory. Risk of rim buckling, suspension compression shock, and vehicle trajectory instability.",
            "image_url": "/samples/pothole.jpg",
            "actions": [
                "Ease off the accelerator smoothly",
                "Brake firmly before the crater, avoid braking inside the hole",
                "Avoid sharp swerving into adjacent lane traffic",
                "Maintain firm steering wheel grip"
            ]
        },
        "debris": {
            "name": "Debris",
            "confidence": 0.89,
            "severity": "moderate",
            "base_risk": 58,
            "recommended_speed": 40,
            "road_condition": "Fallen Wooden Pallets & Metal Scrap",
            "bbox": BoundingBox(x=36.0, y=32.0, width=36.0, height=23.0),
            "explanation": "Scattered cargo pallet and metal debris in driving lane. Threat of tire puncture, underbody strikes, and emergency lane-change collisions.",
            "image_url": "/samples/debris.jpg",
            "actions": [
                "Gradually reduce speed to 40 km/h",
                "Check rear-view mirrors before adjusting lane positioning",
                "Straddle with low speed if lane departure is unsafe",
                "Increase following distance to 3+ seconds"
            ]
        },
        "fallen_tree": {
            "name": "Fallen Tree",
            "confidence": 0.97,
            "severity": "critical",
            "base_risk": 96,
            "recommended_speed": 0,
            "road_condition": "Total Carriage Obstruction",
            "bbox": BoundingBox(x=25.0, y=18.0, width=68.0, height=44.0),
            "explanation": "Large tree trunk and heavy branches spanning across road lanes. Immediate collision hazard across both bounds. Impassable without clearing.",
            "image_url": "/samples/fallen_tree.jpg",
            "actions": [
                "STOP / DO NOT PROCEED — Full vehicle halt required",
                "Engage emergency hazard warning blinkers",
                "Do not attempt to push through foliage",
                "Notify municipal highway control / emergency services"
            ]
        },
        "waterlogging": {
            "name": "Waterlogging",
            "confidence": 0.92,
            "severity": "high",
            "base_risk": 78,
            "recommended_speed": 25,
            "road_condition": "Standing Water / Aquaplaning Zone",
            "bbox": BoundingBox(x=8.0, y=36.0, width=84.0, height=46.0),
            "explanation": "Submerged road surface with standing water exceeding tire tread dispersion depth. High probability of hydroplaning and concealed potholes.",
            "image_url": "/samples/waterlogging.jpg",
            "actions": [
                "Reduce speed to 25 km/h immediately",
                "Maintain constant throttle; avoid sudden braking",
                "Follow tire tracks of preceding high-clearance vehicles",
                "Turn on low-beam headlights and wipers"
            ]
        },
        "clear": {
            "name": "Clear Road",
            "confidence": 0.99,
            "severity": "low",
            "base_risk": 12,
            "recommended_speed": 60,
            "road_condition": "Optimal Pavement Quality",
            "bbox": BoundingBox(x=38.0, y=55.0, width=24.0, height=15.0),
            "explanation": "No significant obstacles or structural pavement anomalies detected. Safe driving conditions.",
            "image_url": "/samples/clear.jpg",
            "actions": [
                "Maintain legal posted speed limit",
                "Continue visual horizon scanning",
                "Observe standard safety margins"
            ]
        }
    }

    def detect(self, hazard_type: Optional[str] = None, vehicle_type: str = "passenger_car",
               current_speed_kmh: int = 60, posted_speed_limit_kmh: int = 60,
               weather: str = "clear", visibility: str = "daylight",
               location: str = "OMR Demo Corridor", image_url: Optional[str] = None) -> Detection:
        
        # Default to pothole if unspecified
        h_key = (hazard_type or "pothole").lower().replace(" ", "_")
        if h_key not in self.PRESET_HAZARDS:
            h_key = "pothole"
            
        preset = self.PRESET_HAZARDS[h_key]
        
        # Vehicle & environmental adjustment to risk
        risk = preset["base_risk"]
        rec_speed = preset["recommended_speed"]
        
        if weather in ["rain", "storm", "fog"]:
            risk = min(100, risk + 8)
            rec_speed = max(0, rec_speed - 10)
            
        if vehicle_type in ["commercial", "bus"]:
            # Heavy vehicles have longer braking distance
            risk = min(100, risk + 5)
            if rec_speed > 0:
                rec_speed = max(15, rec_speed - 5)
        elif vehicle_type == "emergency":
            # Priority response vehicles
            rec_speed = min(posted_speed_limit_kmh, max(rec_speed, 35))
            
        # Ensure recommended speed never exceeds posted speed limit
        rec_speed = min(rec_speed, posted_speed_limit_kmh)
        
        det_id = f"CYC-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        return Detection(
            id=det_id,
            hazard_type=h_key,
            confidence=preset["confidence"],
            severity=preset["severity"],
            risk_score=risk,
            recommended_speed_kmh=rec_speed,
            recommended_actions=preset["actions"],
            vehicle_type=vehicle_type,
            location=location,
            road_condition=preset["road_condition"],
            weather=weather,
            visibility=visibility,
            explanation=preset["explanation"],
            timestamp=datetime.now().isoformat(),
            bounding_box=preset["bbox"],
            image_url=image_url,
            is_demo=True
        )


class YOLODetectionEngine(DetectionEngine):
    """
    Production-grade YOLOv8 / YOLOv11 Road Detection Engine stub.
    Reserved for environments with dedicated GPU or >= 16 GB RAM.
    Demonstrates architectural readiness for real model drop-in.
    """
    def __init__(self, model_weights_path: str = "models/yolov8_road_hazards.pt"):
        self.model_weights_path = model_weights_path
        self.is_initialized = False

    def initialize(self):
        # In full production deployment:
        # from ultralytics import YOLO
        # self.model = YOLO(self.model_weights_path)
        self.is_initialized = True

    def detect(self, hazard_type: Optional[str] = None, vehicle_type: str = "passenger_car",
               current_speed_kmh: int = 60, posted_speed_limit_kmh: int = 60,
               weather: str = "clear", visibility: str = "daylight",
               location: str = "OMR Demo Corridor", image_url: Optional[str] = None) -> Detection:
        raise NotImplementedError(
            "YOLODetectionEngine is disabled in 8 GB RAM mode to conserve memory. "
            "Use MockDetectionEngine (Demo Mode) for the prototype."
        )
