from abc import ABC, abstractmethod
from typing import List
from ..models.schemas import AdvisoryRequest, AdvisoryResponse

class AdvisoryEngine(ABC):
    """Abstract Base Class for CYCLOPS Speed and Safety Advisory Systems."""
    
    @abstractmethod
    def evaluate(self, request: AdvisoryRequest) -> AdvisoryResponse:
        pass


class RuleBasedAdvisoryEngine(AdvisoryEngine):
    """
    Transparent rule-based advisory engine.
    Calculates physics-aware deceleration and tactical safety advice
    governed by vehicle dynamics, visibility, and hazard severity.
    """
    
    VEHICLE_PROFILES = {
        "passenger_car": {
            "name": "Passenger Car",
            "braking_multiplier": 1.0,
            "maneuverability": "high",
            "ground_clearance": "standard"
        },
        "emergency": {
            "name": "Emergency Vehicle",
            "braking_multiplier": 0.85,
            "maneuverability": "high",
            "priority": "code_3"
        },
        "commercial": {
            "name": "Commercial / Heavy Truck",
            "braking_multiplier": 1.6,
            "maneuverability": "low",
            "cargo_shift_risk": "high"
        },
        "bus": {
            "name": "Public Transit Bus",
            "braking_multiplier": 1.45,
            "maneuverability": "low",
            "passenger_inertia_risk": "high"
        },
        "service": {
            "name": "Municipal Service Vehicle",
            "braking_multiplier": 1.2,
            "maneuverability": "moderate"
        }
    }

    def evaluate(self, request: AdvisoryRequest) -> AdvisoryResponse:
        h_type = request.hazard_type.lower().replace(" ", "_")
        risk = request.risk_score
        veh_type = request.vehicle_type.lower()
        posted_limit = max(10, request.posted_speed_limit_kmh)
        current_spd = request.current_speed_kmh
        
        veh_profile = self.VEHICLE_PROFILES.get(veh_type, self.VEHICLE_PROFILES["passenger_car"])
        
        # 1. Determine Risk Level
        if risk <= 25:
            risk_level = "LOW"
        elif risk <= 50:
            risk_level = "MODERATE"
        elif risk <= 75:
            risk_level = "HIGH"
        else:
            risk_level = "CRITICAL"
            
        # 2. Base Speed Calculation by Hazard
        actions: List[str] = []
        reason = ""
        
        if h_type == "fallen_tree":
            rec_speed = 0
            risk_level = "CRITICAL"
            actions = [
                "STOP / DO NOT PROCEED: Complete lane obstruction detected",
                "Activate hazard warning lights (4-way flashers)",
                "Do not attempt an off-road bypass without route confirmation",
                "Alert traffic control and emergency services dispatch"
            ]
            reason = "Full road blockage. Vehicle collision risk is critical regardless of vehicle class."
            
        elif h_type == "pothole":
            if risk_level in ["CRITICAL", "HIGH"]:
                rec_speed = 30
                actions = [
                    "Ease off the accelerator smoothly; brake before the rim",
                    "Do NOT slam brakes inside the pothole depression",
                    "Avoid sudden swerving into adjacent lane traffic",
                    "Firm two-hand grip on steering wheel"
                ]
            else:
                rec_speed = min(45, posted_limit)
                actions = [
                    "Moderate speed deceleration",
                    "Scan mirrors for following vehicles",
                    "Maintain lane center line"
                ]
            reason = f"Severe road crater. At {current_spd} km/h, suspension bottom-out or tire rupture is imminent."
            
        elif h_type == "waterlogging":
            rec_speed = 25
            actions = [
                "Reduce speed to 25 km/h to eliminate hydroplaning threshold",
                "Maintain steady low-gear throttle to prevent exhaust water ingress",
                "Avoid sudden steering inputs or lock-up braking",
                "Follow high-clearance vehicle wake tracks"
            ]
            reason = "Standing water layer reduces tire friction coefficient from ~0.8 to <0.3."
            
        elif h_type == "debris":
            rec_speed = 35
            actions = [
                "Decelerate to 35 km/h to evaluate debris clearance",
                "Scan adjacent lane blind spots before adjusting trajectory",
                "If unavoidable, straddle obstacle along centerline at low speed",
                "Check tire pressure warning system post-crossing"
            ]
            reason = "Solid road obstacle poses undercarriage puncture and tire bead displacement hazard."
            
        else:
            rec_speed = posted_limit
            actions = [
                "Maintain posted highway speed limit",
                "Continue standard situational horizon scanning"
            ]
            reason = "Optimal road pavement condition with nominal friction telemetry."

        # 3. Apply Vehicle Dynamics Adjustments
        if rec_speed > 0:
            if veh_type in ["commercial", "bus"]:
                # Require extra buffer due to braking inertia
                rec_speed = max(15, rec_speed - 5)
                actions.insert(0, f"Heavy vehicle alert ({veh_profile['name']}): Extended braking distance required.")
            elif veh_type == "emergency":
                # Operational capability permits tighter response bounds
                rec_speed = min(posted_limit, max(rec_speed, 35))
                actions.insert(0, "Emergency Priority Mode: High-speed tactical maneuvering allowed if sirens active.")

        # 4. Weather & Visibility Penalties
        if request.weather in ["rain", "storm", "fog"] and rec_speed > 0:
            rec_speed = max(15, rec_speed - 5)
            actions.append(f"Adverse weather ({request.weather}): Speed reduced further for reduced wet grip.")
            
        if request.visibility in ["night", "fog_low"] and rec_speed > 0:
            rec_speed = max(15, rec_speed - 5)
            actions.append("Reduced optical visibility: Headlight illumination horizon restricted.")

        # 5. Cap by Legal Posted Speed Limit
        rec_speed = min(rec_speed, posted_limit)

        return AdvisoryResponse(
            recommended_speed_kmh=rec_speed,
            risk_level=risk_level,
            recommended_actions=actions,
            reason=reason
        )
