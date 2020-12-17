"""
Task statuses
"""

STOPPED = "STOPPED"
RUNNING = "RUNNING"
PAUSED = "PAUSED"
CREATED = "CREATED"
DONE = "DONE"
ERROR = "ERROR"

STATUS_CHOICES = [
    (STOPPED, 'Stopped'),
    (RUNNING, 'Running'),
    (PAUSED, 'Paused'),
    (CREATED, 'Created'),
    (DONE, 'Done'),
    (ERROR, 'Error')
]
