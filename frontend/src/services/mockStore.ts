import { Detection, Alert, Statistics, RoadHealth, EnvironmentalMetric, ModelInfo, VehicleProfile, AdvisoryRequest, AdvisoryResponse } from '../types';

// Preset mock hazards for simulated detection
const PRESET_HAZARDS: Record<string, any> = {
  pothole: {
    name: "Pothole",
    confidence: 0.94,
    severity: "high",
    base_risk: 87,
    recommended_speed: 30,
    road_condition: "Degraded Asphalt / Severe Crater",
    bbox: { x: 37.0, y: 43.0, width: 30.0, height: 20.0 },
    explanation: "Severe road cavity detected in primary lane trajectory. Threat of wheel rim buckling and suspension shock compression.",
    image_url: "/samples/pothole.jpg",
    actions: [
      "Ease off accelerator smoothly",
      "Brake firmly prior to hole; avoid braking inside rim",
      "Avoid sudden swerving into adjacent lane traffic",
      "Maintain firm steering wheel grip"
    ]
  },
  debris: {
    name: "Debris",
    confidence: 0.89,
    severity: "moderate",
    base_risk: 58,
    recommended_speed: 40,
    road_condition: "Fallen Wooden Pallets & Metal Scrap",
    bbox: { x: 36.0, y: 32.0, width: 36.0, height: 23.0 },
    explanation: "Scattered cargo pallet and metal debris in driving lane. Threat of tire puncture, underbody strikes, and emergency lane-change collisions.",
    image_url: "/samples/debris.jpg",
    actions: [
      "Gradually reduce speed to 40 km/h",
      "Check rear-view mirrors before adjusting lane positioning",
      "Straddle with low speed if lane departure is unsafe",
      "Increase following distance to 3+ seconds"
    ]
  },
  fallen_tree: {
    name: "Fallen Tree",
    confidence: 0.97,
    severity: "critical",
    base_risk: 96,
    recommended_speed: 0,
    road_condition: "Total Carriage Obstruction",
    bbox: { x: 25.0, y: 18.0, width: 68.0, height: 44.0 },
    explanation: "Large tree trunk and heavy branches spanning across road lanes. Immediate collision hazard across both bounds. Impassable without clearing.",
    image_url: "/samples/fallen_tree.jpg",
    actions: [
      "STOP / DO NOT PROCEED: Full vehicle halt required",
      "Engage emergency hazard warning blinkers",
      "Do not attempt to push through foliage",
      "Notify municipal highway control / emergency services"
    ]
  },
  waterlogging: {
    name: "Waterlogging",
    confidence: 0.92,
    severity: "high",
    base_risk: 78,
    recommended_speed: 25,
    road_condition: "Standing Water / Aquaplaning Zone",
    bbox: { x: 8.0, y: 36.0, width: 84.0, height: 46.0 },
    explanation: "Submerged road surface with standing water exceeding tire tread dispersion depth. High probability of hydroplaning and concealed potholes.",
    image_url: "/samples/waterlogging.jpg",
    actions: [
      "Reduce speed to 25 km/h immediately",
      "Maintain constant throttle; avoid sudden braking",
      "Follow tire tracks of preceding high-clearance vehicles",
      "Turn on low-beam headlights and wipers"
    ]
  },
  clear: {
    name: "Clear Road",
    confidence: 0.99,
    severity: "low",
    base_risk: 12,
    recommended_speed: 60,
    road_condition: "Optimal Pavement Quality",
    bbox: { x: 38.0, y: 55.0, width: 24.0, height: 15.0 },
    explanation: "No significant obstacles or structural pavement anomalies detected. Safe driving conditions.",
    image_url: "/samples/clear.jpg",
    actions: [
      "Maintain legal posted speed limit",
      "Continue visual horizon scanning",
      "Observe standard safety margins"
    ]
  }
};

class MockStore {
  private detections: Detection[] = [];
  private alerts: Alert[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.initDefaultData();
  }

  private initDefaultData() {
    this.detections = [];
    this.alerts = [];
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getDetections(): Detection[] {
    return [...this.detections];
  }

  public getDetection(id: string): Detection | undefined {
    return this.detections.find(d => d.id === id);
  }

  public runDetection(params: {
    hazard_type?: string;
    vehicle_type?: string;
    current_speed_kmh?: number;
    posted_speed_limit_kmh?: number;
    weather?: string;
    visibility?: string;
    location?: string;
    image_url?: string;
  }): Detection {
    const hKey = (params.hazard_type || "pothole").toLowerCase().replace(" ", "_");
    const preset = PRESET_HAZARDS[hKey] || PRESET_HAZARDS["pothole"];
    const vehicleType = params.vehicle_type || "passenger_car";
    const postedLimit = params.posted_speed_limit_kmh || 60;
    
    let risk = preset.base_risk;
    let recSpeed = preset.recommended_speed;

    if (params.weather && ["rain", "storm", "fog"].includes(params.weather)) {
      risk = Math.min(100, risk + 8);
      recSpeed = Math.max(0, recSpeed - 10);
    }

    if (vehicleType === "commercial" || vehicleType === "bus") {
      risk = Math.min(100, risk + 5);
      if (recSpeed > 0) recSpeed = Math.max(15, recSpeed - 5);
    } else if (vehicleType === "emergency") {
      recSpeed = Math.min(postedLimit, Math.max(recSpeed, 35));
    }

    recSpeed = Math.min(recSpeed, postedLimit);
    const detId = `CYC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;

    const newDetection: Detection = {
      id: detId,
      hazard_type: hKey,
      confidence: preset.confidence,
      severity: preset.severity,
      risk_score: risk,
      recommended_speed_kmh: recSpeed,
      recommended_actions: [...preset.actions],
      vehicle_type: vehicleType,
      location: params.location || "OMR Demo Corridor (Kandanchavadi)",
      road_condition: preset.road_condition,
      weather: params.weather || "clear",
      visibility: params.visibility || "daylight",
      explanation: preset.explanation,
      timestamp: new Date().toISOString(),
      bounding_box: preset.bbox,
      image_url: params.image_url || `/samples/${hKey}.jpg`,
      is_demo: true
    };

    this.detections.unshift(newDetection);

    if (newDetection.severity === "high" || newDetection.severity === "critical" || newDetection.risk_score >= 70) {
      const alert: Alert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        detection_id: newDetection.id,
        hazard_type: newDetection.hazard_type,
        severity: newDetection.severity,
        risk_score: newDetection.risk_score,
        recommended_speed_kmh: newDetection.recommended_speed_kmh,
        location: newDetection.location,
        timestamp: newDetection.timestamp,
        status: newDetection.severity === "critical" ? "Critical Alert" : "Active",
        vehicle_type: newDetection.vehicle_type
      };
      this.alerts.unshift(alert);
    }

    this.notify();
    return newDetection;
  }

  public getStatistics(): Statistics {
    const total = this.detections.length;
    const highRisk = this.detections.filter(d => d.severity === 'high' || d.severity === 'critical').length;
    const activeAlerts = this.alerts.filter(a => a.status === 'Active' || a.status === 'Critical Alert').length;
    const waterlogging = this.detections.filter(d => d.hazard_type === 'waterlogging').length;

    return {
      total_detections: total,
      high_risk_hazards: highRisk,
      active_alerts: activeAlerts,
      road_segments_monitored: 5,
      waterlogging_events: waterlogging,
      average_road_health: 74,
      mode: "DEMO MODE",
      disclaimer: "Demo and simulated data for prototype demonstration."
    };
  }

  public getAlerts(): Alert[] {
    return [...this.alerts];
  }

  public getRoadHealth(): RoadHealth {
    const segments = [
      { id: "SEG-01", name: "OMR Demo Corridor (Tidel to Sholinganallur)", health_score: 72, status: "Moderate Wear", length_km: 14.5, last_surveyed: "2026-09-21", potholes: 5, waterlogging: 2, debris: 3, trees: 0 },
      { id: "SEG-02", name: "Anna Nagar Demo Route (Roundtana to Inner Ring)", health_score: 65, status: "Hazard Alert", length_km: 8.2, last_surveyed: "2026-09-21", potholes: 7, waterlogging: 3, debris: 1, trees: 1 },
      { id: "SEG-03", name: "Marina Road Demo Segment (Kamarajar Salai)", health_score: 84, status: "Good Condition", length_km: 6.8, last_surveyed: "2026-09-21", potholes: 1, waterlogging: 4, debris: 1, trees: 0 },
      { id: "SEG-04", name: "Airport Demo Route (Kathipara to Meenambakkam)", health_score: 79, status: "Fair Condition", length_km: 9.4, last_surveyed: "2026-09-21", potholes: 3, waterlogging: 1, debris: 2, trees: 0 },
      { id: "SEG-05", name: "Guindy Industrial Segment (SIDCO Link)", health_score: 61, status: "Requires Maintenance", length_km: 5.1, last_surveyed: "2026-09-21", potholes: 8, waterlogging: 3, debris: 4, trees: 0 },
    ];
    return {
      score: 72,
      status: "MODERATE / CAUTION",
      pothole_incidents: 24,
      waterlogging_incidents: 13,
      debris_incidents: 11,
      tree_incidents: 1,
      disclaimer: "Prototype Road Health Index (Model-Based)",
      segments
    };
  }

  public getEnvironmentMetrics(): EnvironmentalMetric {
    return {
      road_disruption_index: 64,
      estimated_congestion_delay_min: 18.4,
      estimated_idle_fuel_penalty_liters: 142.6,
      estimated_excess_co2_kg: 330.8,
      waterlogging_flood_risk: "High in Coastal Corridors",
      label: "Estimated / Model-Based",
      disclaimer: "Camera systems do not directly measure emissions. Environmental metrics are derived from traffic slow-down and congestion models."
    };
  }

  public getVehicles(): VehicleProfile[] {
    return [
      {
        id: "VEH-01",
        vehicle_type: "passenger_car",
        name: "Passenger Sedans & SUVs",
        active_units: 42,
        avg_advisory_speed: 48,
        risk_events: 14,
        dynamics: {
          braking_multiplier: 1.0,
          maneuverability: "High"
        }
      },
      {
        id: "VEH-02",
        vehicle_type: "emergency",
        name: "Ambulance & Fire Tactical",
        active_units: 8,
        avg_advisory_speed: 54,
        risk_events: 4,
        dynamics: {
          braking_multiplier: 0.85,
          maneuverability: "High",
          priority: "Code 3 Priority"
        }
      },
      {
        id: "VEH-03",
        vehicle_type: "commercial",
        name: "Heavy Logistics & Haulers",
        active_units: 19,
        avg_advisory_speed: 36,
        risk_events: 11,
        dynamics: {
          braking_multiplier: 1.6,
          maneuverability: "Low",
          cargo_shift_risk: "High Cargo Inertia"
        }
      },
      {
        id: "VEH-04",
        vehicle_type: "bus",
        name: "City Metro Transit Buses",
        active_units: 15,
        avg_advisory_speed: 32,
        risk_events: 9,
        dynamics: {
          braking_multiplier: 1.45,
          maneuverability: "Low",
          passenger_inertia_risk: "Standing Passenger Safety"
        }
      },
      {
        id: "VEH-05",
        vehicle_type: "service",
        name: "Municipal Utility Sweepers",
        active_units: 6,
        avg_advisory_speed: 28,
        risk_events: 5,
        dynamics: {
          braking_multiplier: 1.2,
          maneuverability: "Moderate"
        }
      }
    ];
  }

  public getModels(): ModelInfo[] {
    return [
      {
        id: "mod-yolo-v8e",
        name: "YOLOv8 Road-Edge (Prototype)",
        accuracy: "91.4%",
        speed: "38 FPS (Fast)",
        memory: "220 MB RAM",
        status: "Demo / Integrated Simulation",
        latency_ms: 26,
        architecture: "CSPDarknet53 + PANet Head",
        supported_hazards: ["Potholes", "Surface Cracks", "Debris", "Fallen Trees", "Standing Water"],
        disclaimer: "Illustrative benchmark values for prototype evaluation."
      },
      {
        id: "mod-lightnet",
        name: "LightRoad-Tiny Detector",
        accuracy: "87.2%",
        speed: "62 FPS (Very Fast)",
        memory: "85 MB RAM",
        status: "Active Edge Candidate",
        latency_ms: 16,
        architecture: "MobileNetV4 + SSDLite Depthwise",
        supported_hazards: ["Potholes", "Loose Debris"],
        disclaimer: "Illustrative benchmark values for prototype evaluation."
      },
      {
        id: "mod-vit-infra",
        name: "Vision Transformer Road-HQ",
        accuracy: "94.8%",
        speed: "18 FPS (Moderate)",
        memory: "1.4 GB VRAM",
        status: "Future Cloud Deployment",
        latency_ms: 58,
        architecture: "Swin-Transformer B + Feature Pyramid",
        supported_hazards: ["All Hazard Classes + Subsurface Moisture + Road Striping"],
        disclaimer: "Illustrative benchmark values for prototype evaluation."
      }
    ];
  }

  public getAnalyticsData() {
    return {
      hazards_by_type: [
        { type: "Potholes", count: 28, risk_avg: 76 },
        { type: "Waterlogging", count: 14, risk_avg: 82 },
        { type: "Debris", count: 19, risk_avg: 54 },
        { type: "Fallen Trees", count: 4, risk_avg: 94 }
      ],
      temporal_trend: [
        { hour: "00:00", potholes: 2, waterlogging: 1, debris: 0 },
        { hour: "04:00", potholes: 1, waterlogging: 3, debris: 1 },
        { hour: "08:00", potholes: 7, waterlogging: 4, debris: 5 },
        { hour: "12:00", potholes: 6, waterlogging: 2, debris: 4 },
        { hour: "16:00", potholes: 8, waterlogging: 3, debris: 6 },
        { hour: "20:00", potholes: 4, waterlogging: 1, debris: 3 }
      ],
      severity_distribution: [
        { name: "Critical", value: 12, color: "#EF4444" },
        { name: "High", value: 24, color: "#F97316" },
        { name: "Moderate", value: 18, color: "#FBBF24" },
        { name: "Low", value: 11, color: "#10B981" }
      ],
      vehicle_encounter_rates: [
        { vehicle: "Passenger Car", encounters: 34, avg_speed: 34 },
        { vehicle: "Commercial Truck", encounters: 21, avg_speed: 28 },
        { vehicle: "Transit Bus", encounters: 16, avg_speed: 26 },
        { vehicle: "Emergency", encounters: 5, avg_speed: 42 },
        { vehicle: "Municipal Service", encounters: 7, avg_speed: 22 }
      ],
      disclaimer: "Simulated aggregate data for prototype demonstration."
    };
  }

  public evaluateAdvisory(req: AdvisoryRequest): AdvisoryResponse {
    const hType = req.hazard_type.toLowerCase().replace(" ", "_");
    const risk = req.risk_score;
    const vehType = req.vehicle_type;
    const postedLimit = Math.max(10, req.posted_speed_limit_kmh);

    let riskLevel = "LOW";
    if (risk > 75) riskLevel = "CRITICAL";
    else if (risk > 50) riskLevel = "HIGH";
    else if (risk > 25) riskLevel = "MODERATE";

    let recSpeed = 40;
    let actions: string[] = [];
    let reason = "";

    if (hType === "fallen_tree") {
      recSpeed = 0;
      riskLevel = "CRITICAL";
      actions = [
        "STOP / DO NOT PROCEED: Total lane obstruction detected",
        "Activate hazard warning lights (4-way flashers)",
        "Do not attempt an off-road bypass without route confirmation",
        "Alert traffic control and emergency services dispatch"
      ];
      reason = "Full road blockage. Vehicle collision risk is critical regardless of vehicle class.";
    } else if (hType === "pothole") {
      recSpeed = riskLevel === "CRITICAL" || riskLevel === "HIGH" ? 30 : 45;
      actions = [
        "Ease off accelerator smoothly; brake before the rim",
        "Do NOT slam brakes inside the pothole depression",
        "Avoid sudden swerving into adjacent lane traffic",
        "Firm two-hand grip on steering wheel"
      ];
      reason = `Severe road crater. At ${req.current_speed_kmh} km/h, suspension bottom-out or tire rupture is imminent.`;
    } else if (hType === "waterlogging") {
      recSpeed = 25;
      actions = [
        "Reduce speed to 25 km/h to eliminate hydroplaning threshold",
        "Maintain steady low-gear throttle to prevent exhaust water ingress",
        "Avoid sudden steering inputs or lock-up braking",
        "Follow high-clearance vehicle wake tracks"
      ];
      reason = "Standing water layer reduces tire friction coefficient from ~0.8 to <0.3.";
    } else if (hType === "debris") {
      recSpeed = 35;
      actions = [
        "Decelerate to 35 km/h to evaluate debris clearance",
        "Scan adjacent lane blind spots before adjusting trajectory",
        "Straddle obstacle along centerline at low speed",
        "Check tire pressure warning system post-crossing"
      ];
      reason = "Solid road obstacle poses undercarriage puncture and tire bead displacement hazard.";
    } else {
      recSpeed = postedLimit;
      actions = [
        "Maintain posted highway speed limit",
        "Continue standard situational horizon scanning"
      ];
      reason = "Optimal road pavement condition with nominal friction telemetry.";
    }

    if (recSpeed > 0 && (vehType === "commercial" || vehType === "bus")) {
      recSpeed = Math.max(15, recSpeed - 5);
      actions.unshift("Heavy vehicle alert: Extended braking distance required.");
    }

    recSpeed = Math.min(recSpeed, postedLimit);

    return {
      recommended_speed_kmh: recSpeed,
      risk_level: riskLevel,
      recommended_actions: actions,
      reason,
      disclaimer: "Prototype safety recommendation — does not replace legal traffic rules or driver judgment."
    };
  }
}

export const mockStore = new MockStore();
