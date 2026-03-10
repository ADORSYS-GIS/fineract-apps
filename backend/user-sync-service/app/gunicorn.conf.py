"""Gunicorn configuration file."""

import os

# Server socket
bind = f"0.0.0.0:{os.getenv('PORT', 5000)}"

# Worker processes
workers = int(os.getenv("GUNICORN_WORKERS", 2))
worker_class = "sync"
threads = int(os.getenv("GUNICORN_THREADS", 4))

# Security
# Drop privileges after binding to the socket
user = "syncuser"
group = "syncuser"

# Logging
accesslog = "-"  # Log to stdout
errorlog = "-"   # Log to stderr
loglevel = os.getenv("GUNICORN_LOG_LEVEL", "info")

# Process naming
proc_name = "fineract-user-sync-service"

# Other settings
# Graceful timeout for workers
graceful_timeout = int(os.getenv("GUNICORN_GRACEFUL_TIMEOUT", 30))
# Timeout for handling a request
timeout = int(os.getenv("GUNICORN_TIMEOUT", 30))
# Number of requests a worker will process before restarting
max_requests = int(os.getenv("GUNICORN_MAX_REQUESTS", 1000))
# Jitter to prevent all workers from restarting at the same time
max_requests_jitter = int(os.getenv("GUNICORN_MAX_REQUESTS_JITTER", 50))