import sqlite3, os
from datetime import datetime, timezone, timedelta

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "logs.db")

def get_db():
    conn = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, server TEXT NOT NULL, message TEXT NOT NULL, timestamp TEXT NOT NULL)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_logs_server_ts ON logs(server, timestamp)")
    conn.commit()
    conn.close()

def seed_sample_data():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM logs")
    if cur.fetchone()[0] == 0:
        sample = [
            ("server1","Started process A","2025-07-19T11:00:00+00:00"),
            ("server1","Process A completed","2025-07-19T11:05:00+00:00"),
            ("server1","Health check OK","2025-07-19T11:10:00+00:00"),
            ("server1","Error: disk space low","2025-07-19T11:20:00+00:00"),
            ("server2","User login","2025-07-19T10:50:00+00:00"),
            ("server2","User logout","2025-07-19T10:55:00+00:00"),
            ("server2","DB backup started","2025-07-19T11:15:00+00:00"),
            ("server3","Service restarted","2025-07-19T10:30:00+00:00"),
            ("server3","Service running","2025-07-19T10:35:00+00:00"),
            ("server3","Service health OK","2025-07-19T10:40:00+00:00"),
        ]
        cur.executemany("INSERT INTO logs(server,message,timestamp) VALUES (?,?,?)", sample)
        conn.commit()
    conn.close()

def parse_iso8601(s: str):
    try:
        dt = datetime.fromisoformat(s)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return None

def now_utc():
    return datetime.now(timezone.utc)
