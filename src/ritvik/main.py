from fastapi import FastAPI, HTTPException, Body, Request
from .models import Task
from .excel_utils import add_task, list_tasks, mark_task_complete, update_task_status_by_name
from uuid import UUID
import re
from datetime import datetime

app = FastAPI()

# 1. Add task from chat (with optional deadline)
@app.post("/add-task-from-chat")
def add_task_from_chat(request: Request, body: dict = Body(...)):
    """
    Accepts a chat message like:
    'add task @kalakonda harshith rao, add api integration to ritvik, deadline: 2025-07-05 18:00'
    - Use a comma after the asignee name to separate it from the task description.
    - Optionally, add ', deadline: YYYY-MM-DD HH:MM' at the end to specify a deadline.
    - The assigner is inferred from the request (e.g., from a header or a field in the body, such as 'sender_email').
    - The asignee is the @name (can be multiple words) after 'add task'.
    - The task is the rest of the message after the comma, before the deadline (if present).
    """
    message = body.get("message")
    assigner = body.get("assigner")  # This should be set by the client (e.g., Gmail address)
    if not message or not assigner:
        raise HTTPException(status_code=400, detail="Missing message or assigner.")

    print(f"Received message: {repr(message)}")
    # Regex: match asignee, task, and optional deadline
    regex = r'add[- ]task\s*@\s*([^,]+)\s*,\s*(.*?)(?:,\s*deadline:\s*([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}))?$'
    match = re.match(regex, message, re.IGNORECASE)
    if not match:
        raise HTTPException(status_code=400, detail="Could not parse chat message. Use: 'add task @asignee_name, task description, deadline: YYYY-MM-DD HH:MM' (comma after name, asignee can be any length, deadline is optional)")
    asignee = match.group(1).strip()
    task_text = match.group(2).strip()
    deadline_str = match.group(3)
    now = datetime.now()
    if deadline_str:
        try:
            deadline = datetime.strptime(deadline_str, "%Y-%m-%d %H:%M")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid deadline format. Use YYYY-MM-DD HH:MM")
    else:
        deadline = now

    task_obj = Task(
        asigner=assigner,
        asignee=asignee,
        request_date=now,
        task=task_text,
        deadline=deadline,
        status="incomplete"
    )
    add_task(task_obj)
    return {"success": True, "message": "Task added from chat message."}

# 2. Get tasks by asignee name
@app.post("/get-tasks-by-name")
def get_tasks_by_name(body: dict = Body(...)):
    """
    Returns the list of tasks assigned to the given asignee name, formatted for display.
    Expects a JSON body: { "asignee": "full name" }
    """
    asignee = body.get("asignee")
    if not asignee:
        raise HTTPException(status_code=400, detail="Missing asignee name.")
    tasks = list_tasks(asignee)
    formatted = [
        f"Task: {t.task}, Deadline: {t.deadline.strftime('%Y-%m-%d %H:%M')}, Assigned by: {t.asigner}, Status: {t.status}" for t in tasks
    ]
    print(f"Formatted tasks for {asignee}: {formatted}")
    return formatted

# 3. Update task status by task_id
@app.post("/update-task-status")
def update_task_status(body: dict = Body(...)):
    """
    Update the status of a task by task_id. Expects JSON: {"task_id": "...", "status": "..."
    """
    task_id = body.get("task_id")
    status = body.get("status")
    if not task_id or not status:
        raise HTTPException(status_code=400, detail="Missing task_id or status.")
    try:
        uuid_task_id = UUID(task_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task_id format.")
    updated = mark_task_complete(uuid_task_id, status)
    if updated:
        return {"success": True, "message": f"Task status updated to '{status}'."}
    else:
        raise HTTPException(status_code=404, detail="Task not found.")

# 4. Update task status by asignee and task name
@app.post("/update-task-status-by-name")
def update_task_status_by_name_endpoint(body: dict = Body(...)):
    print(f"Received body for update: {body}")
    """
    Update the status of a task by asignee and task name (text). Expects JSON: {"asignee": "...", "task": "...", "status": "..."
    """
    asignee = body.get("asignee")
    task_name = body.get("task")
    status = body.get("status")
    if not asignee or not task_name or not status:
        raise HTTPException(status_code=400, detail="Missing asignee, task, or status.")
    updated = update_task_status_by_name(asignee, task_name, status)
    if updated:
        return {"success": True, "message": f"Task '{task_name}' status updated to '{status}'."}
    else:
        raise HTTPException(status_code=404, detail="Task not found for given asignee and task name.")

# 5. Get tasks assigned to me (with optional assigner filter)
@app.post("/get-tasks-assigned-to-me")
def get_tasks_assigned_to_me(body: dict = Body(...)):
    """
    Returns tasks assigned to the given asignee. If 'assigner' is provided, filters by assigner as well.
    Expects JSON: { "asignee": "your name", "assigner": "optional assigner name" }
    """
    asignee = body.get("asignee")
    assigner = body.get("assigner")
    if not asignee:
        raise HTTPException(status_code=400, detail="Missing asignee name.")
    tasks = list_tasks(asignee)
    if assigner:
        tasks = [t for t in tasks if t.asigner == assigner]
    formatted = [
        f"Task: {t.task}, Deadline: {t.deadline.strftime('%Y-%m-%d %H:%M')}, Assigned by: {t.asigner}, Status: {t.status}" for t in tasks
    ]
    print(f"Filtered tasks for {asignee} (assigner: {assigner}): {formatted}")
    return formatted
