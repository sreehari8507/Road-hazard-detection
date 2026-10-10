import json
from .connection import get_db, init_db

def seed_database():
    """Initializes the database tables with a clean slate (zero fake entries)."""
    init_db()
    conn = get_db()
    cursor = conn.cursor()
    # Ensure tables exist without fake dummy detections
    conn.commit()
    conn.close()

def clear_all_data():
    """Wipes all mock/fake detections so the app starts completely blank."""
    init_db()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM alerts")
    cursor.execute("DELETE FROM detections")
    cursor.execute("DELETE FROM road_segments")
    cursor.execute("DELETE FROM vehicles")
    conn.commit()
    conn.close()
