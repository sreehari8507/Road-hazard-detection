import sqlite3
import os
import json
from pathlib import Path
from typing import List, Dict, Any, Optional

DB_PATH = Path(__file__).resolve().parent.parent.parent / "cyclops.db"

def get_db():
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Detections Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS detections (
        id TEXT PRIMARY KEY,
        hazard_type TEXT NOT NULL,
        confidence REAL NOT NULL,
        severity TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        recommended_speed_kmh INTEGER NOT NULL,
        recommended_actions TEXT NOT NULL,
        vehicle_type TEXT NOT NULL,
        location TEXT NOT NULL,
        road_condition TEXT NOT NULL,
        weather TEXT NOT NULL,
        visibility TEXT NOT NULL,
        explanation TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        bounding_box TEXT,
        image_url TEXT,
        is_demo INTEGER DEFAULT 1
    );
    """)
    
    # 2. Alerts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        detection_id TEXT NOT NULL,
        hazard_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        recommended_speed_kmh INTEGER NOT NULL,
        location TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL,
        vehicle_type TEXT NOT NULL,
        FOREIGN KEY (detection_id) REFERENCES detections (id)
    );
    """)
    
    # 3. Road Segments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS road_segments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        road_health_score INTEGER NOT NULL,
        status TEXT NOT NULL,
        length_km REAL NOT NULL,
        last_surveyed TEXT NOT NULL,
        pothole_count INTEGER DEFAULT 0,
        waterlogging_count INTEGER DEFAULT 0,
        debris_count INTEGER DEFAULT 0,
        tree_count INTEGER DEFAULT 0
    );
    """)

    # 4. Vehicles Intelligence Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY,
        vehicle_type TEXT NOT NULL,
        name TEXT NOT NULL,
        active_units INTEGER NOT NULL,
        avg_advisory_speed INTEGER NOT NULL,
        risk_events INTEGER NOT NULL
    );
    """)
    
    conn.commit()
    conn.close()
