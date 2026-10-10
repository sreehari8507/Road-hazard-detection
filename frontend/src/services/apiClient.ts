import { Detection, DetectRequest, AdvisoryRequest, AdvisoryResponse, Alert, Statistics, RoadHealth, EnvironmentalMetric, ModelInfo, VehicleProfile } from '../types';
import { mockStore } from './mockStore';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

let isBackendOnline = false;
const statusListeners: ((online: boolean) => void)[] = [];

export function onBackendStatusChange(listener: (online: boolean) => void) {
  statusListeners.push(listener);
  listener(isBackendOnline);
  return () => {
    const idx = statusListeners.indexOf(listener);
    if (idx !== -1) statusListeners.splice(idx, 1);
  };
}

function setBackendStatus(online: boolean) {
  if (isBackendOnline !== online) {
    isBackendOnline = online;
    statusListeners.forEach(fn => fn(online));
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 2500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const apiClient = {
  getBackendStatus(): boolean {
    return isBackendOnline;
  },

  async checkHealth(): Promise<{ status: string; mode: string; hardware_profile?: string }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/health`);
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      // Fallback
    }
    setBackendStatus(false);
    return { status: "offline", mode: "DEMO MODE (Simulation)", hardware_profile: "Lightweight In-Browser" };
  },

  async getStatistics(): Promise<Statistics> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/statistics`);
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      setBackendStatus(false);
    }
    return mockStore.getStatistics();
  },

  async getDetections(limit = 25, hazardType?: string): Promise<Detection[]> {
    try {
      let url = `${API_BASE_URL}/detections?limit=${limit}`;
      if (hazardType) url += `&hazard_type=${hazardType}`;
      const res = await fetchWithTimeout(url);
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      setBackendStatus(false);
    }
    let all = mockStore.getDetections();
    if (hazardType) all = all.filter(d => d.hazard_type === hazardType);
    return all.slice(0, limit);
  },

  async getDetection(id: string): Promise<Detection | undefined> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/detections/${id}`);
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      setBackendStatus(false);
    }
    return mockStore.getDetection(id);
  },

  async runDetection(req: DetectRequest): Promise<Detection> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      setBackendStatus(false);
    }
    return mockStore.runDetection(req);
  },

  async getAlerts(limit = 10): Promise<Alert[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/alerts?limit=${limit}`);
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      setBackendStatus(false);
    }
    return mockStore.getAlerts().slice(0, limit);
  },

  async getRoadHealth(): Promise<RoadHealth> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/road-health`);
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      setBackendStatus(false);
    }
    return mockStore.getRoadHealth();
  },

  async getEnvironment(): Promise<EnvironmentalMetric> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/environment`);
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      setBackendStatus(false);
    }
    return mockStore.getEnvironmentMetrics();
  },

  async getVehicles(): Promise<VehicleProfile[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/vehicles`);
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      setBackendStatus(false);
    }
    return mockStore.getVehicles();
  },

  async getModels(): Promise<ModelInfo[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/models`);
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      setBackendStatus(false);
    }
    return mockStore.getModels();
  },

  async getAnalytics(): Promise<any> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/analytics`);
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      setBackendStatus(false);
    }
    return mockStore.getAnalyticsData();
  },

  async getAdvisory(req: AdvisoryRequest): Promise<AdvisoryResponse> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/advisory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (res.ok) {
        setBackendStatus(true);
        return await res.json();
      }
    } catch {
      setBackendStatus(false);
    }
    return mockStore.evaluateAdvisory(req);
  }
};
