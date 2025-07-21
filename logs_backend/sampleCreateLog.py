import requests
import json
from datetime import datetime, timezone
from time import sleep

# Replace with your actual backend URL
url = "http://localhost:5000/api/logs"

payload = {
    "server": "server1",
    "message": "Sample log message with timestamp",
    "timestamp": datetime.now(timezone.utc).isoformat()  # ISO-8601 format with timezone
}

headers = {
    "Content-Type": "application/json"
}
for i in range(10):
    sleep(1)  # Sleep for 1 second between requests
    payload["message"] = f"Sample log message {i} with timestamp lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem"
    payload["timestamp"] = datetime.now(timezone.utc).isoformat()  # Update timestamp for each log
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Log {i+1} created:")

print("Status code:", response.status_code)
print("Response:", response.json())