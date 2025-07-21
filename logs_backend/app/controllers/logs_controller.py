from flask import request, jsonify, abort
from datetime import timedelta
from ..db import get_db, parse_iso8601, now_utc


# /api/logs?server=server1
# this endpoint retrieves logs for a specific server
# it supports optional 'since', 'until', and 'limit' query parameters
# 'since' and 'until' should be in ISO-8601 format
# if 'since' is not provided, defaults to 15 minutes ago
# if 'until' is not provided, defaults to now
# 'limit' can be used to limit the number of results returned
# returns a JSON array of log entries
def get_logs():
    server = request.args.get("server")
    if not server:
        abort(400, "Missing required parameter: server")

    since_str = request.args.get("since")
    if since_str:
        since = parse_iso8601(since_str)
        if not since:
            abort(400, "Invalid ISO-8601 for 'since'")
    else:
        since = now_utc() - timedelta(minutes=15)

    until_str = request.args.get("until")
    if until_str:
        until = parse_iso8601(until_str)
        if not until:
            abort(400, "Invalid ISO-8601 for 'until'")
    else:
        until = now_utc()

    limit = request.args.get("limit", type=int)

    query = (
        "SELECT id, server, message, timestamp "
        "FROM logs "
        "WHERE server = ? AND timestamp BETWEEN ? AND ? "
        "ORDER BY timestamp ASC"
    )
    params = [server, since.isoformat(), until.isoformat()]
    if limit:
        query += " LIMIT ?"
        params.append(limit)

    conn = get_db()
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

def create_log():
    data = request.get_json()
    if not data:
        abort(400, "JSON body required")

    server = data.get("server")
    message = data.get("message")
    ts_str = data.get("timestamp")

    if not server or not message:
        abort(400, "'server' and 'message' are required")

    if ts_str:
        ts = parse_iso8601(ts_str)
        if not ts:
            abort(400, "Invalid ISO-8601 timestamp")
    else:
        ts = now_utc()

    iso_ts = ts.isoformat()
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO logs(server,message,timestamp) VALUES (?,?,?)",
        (server, message, iso_ts)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()

    return jsonify({
        "id": new_id,
        "server": server,
        "message": message,
        "timestamp": iso_ts
    }), 201
