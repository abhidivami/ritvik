from fastapi import FastAPI, HTTPException, Body, Request
from .models import Task
from .excel_utils import add_task, list_tasks, mark_task_complete, update_task_status_by_name, update_task_by_id
from uuid import UUID
import re
from datetime import datetime

app = FastAPI()

# 1. Add task from chat (with optional deadline)
@app.post("/add-task-from-chat")
def add_task_from_chat(body: dict = Body(...)):
    """
    Accepts a JSON payload with all task fields directly:
    {
      "asigner": "rahul@example.com",
      "asignee": "john@example.com",
      "request_date": "2025-07-02T09:00",
      "task": "Prepare onboarding documents for new intern",
      "deadline": "2025-07-05T18:00",
      "status": "incomplete"
    }
    """
    print(f"Received body: {body}")
    required_fields = ["asigner", "asignee", "request_date", "task_name", "task_description", "deadline", "status"]
    for field in required_fields:
        if field not in body:
            raise HTTPException(status_code=400, detail=f"Missing field: {field}")

    try:
        request_date = datetime.fromisoformat(body["request_date"])
        deadline = datetime.fromisoformat(body["deadline"])
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format: YYYY-MM-DDTHH:MM")

    print(f"Writing to Excel: asigner={body['asigner']}, asignee={body['asignee']}, request_date={request_date}, task_name={body['task_name']}, task_description={body['task_description']}, deadline={deadline}, status={body['status']}")

    task_obj = Task(
        asigner=body["asigner"],
        asignee=body["asignee"],
        request_date=request_date,
        task_name=body["task_name"],
        task_description=body["task_description"],
        deadline=deadline,
        status=body["status"]
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
        f"ID: {t.task_id}, Task: {t.task}, Deadline: {t.deadline.strftime('%Y-%m-%d %H:%M')}, Assigned by: {t.asigner}, Status: {t.status}" for t in tasks
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
    Update the status of a task by asignee and task name (text). Expects JSON: {"asignee": "...", "task": "...", "status": "..."}
    Also supports {"asignee": "...", "task_name": "...", "status": "..."}
    """
    asignee = body.get("asignee")
    # Accept both 'task' and 'task_name'
    task_name = body.get("task") or body.get("task_name")
    status = body.get("status")
    if not asignee or not task_name or not status:
        raise HTTPException(status_code=400, detail="Missing asignee, task, or status.")
    updated = update_task_status_by_name(asignee, task_name, status)
    if updated:
        return {"success": True, "message": f"Task '{task_name}' status updated to '{status}'."}
    else:
        raise HTTPException(status_code=404, detail="Task not found for given asignee and task name.")

# 4a. Update all task fields by task_id
@app.post("/update-task-status-by-id")
def update_task_by_id_endpoint(body: dict = Body(...)):
    print(f"Received body for update by id: {body}")
    task_id = body.get("task_id")
    if not task_id:
        raise HTTPException(status_code=400, detail="Missing task_id.")
    try:
        # Parse datetimes, allow empty string for request_date
        request_date = None
        if body.get("request_date"):
            request_date = datetime.fromisoformat(body["request_date"])
        deadline = datetime.fromisoformat(body["deadline"]) if body.get("deadline") else None
        task_obj = Task(
            asigner=body["asigner"],
            asignee=body["asignee"],
            request_date=request_date or datetime.now(),
            task_name=body["task_name"],
            task_description=body["task_description"],
            deadline=deadline,
            status=body["status"],
            task_id=UUID(task_id)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {e}")
    from .excel_utils import update_task_by_id as update_task_by_id_excel
    updated = update_task_by_id_excel(task_id, task_obj)
    if updated:
        return {"success": True, "message": f"Task '{body.get('task_name')}' updated successfully."}
    else:
        raise HTTPException(status_code=404, detail="Task not found for given id.")

# 5. Get tasks assigned to me (with optional assigner filter)
@app.post("/get-tasks-assigned-to-me")
def get_tasks_assigned_to_me(body: dict = Body(...)):
    print(f"Received body for get-tasks-assigned-to-me: {body}")
    """
    Returns tasks assigned to the given asignee.
    Expects JSON: { "asignee": "your name" }
    """
    asignee = body.get("asignee")
    if not asignee:
        raise HTTPException(status_code=400, detail="Missing asignee name.")
    all_tasks = list_tasks(None)
    tasks = [t for t in all_tasks if asignee.lower() in t.asignee.lower()]
    formatted = [
        f"ID: {t.task_id}, Task: {t.task_name}, Description: {t.task_description}, Request Date: {t.request_date.strftime('%Y-%m-%d %H:%M')}, Deadline: {t.deadline.strftime('%Y-%m-%d %H:%M')}, Assigned to: {t.asignee}, Assigned by: {t.asigner}, Status: {t.status}" for t in tasks
    ]
    print(f"Tasks for {asignee}: {formatted}")
    return formatted

# 6. Get tasks assigned by me (with optional asignee filter)
@app.post("/get-tasks-assigned-by-me")
def get_tasks_assigned_by_me(body: dict = Body(...)):
    print(f"Received body for get-tasks-assigned-by-me: {body}")
    
    assigner = body.get("assigner") or body.get("asigner")
    if not assigner:
        raise HTTPException(status_code=400, detail="Missing assigner name.")

    assigner_normalized = assigner.strip().lower()
    all_tasks = list_tasks()
    print(f"All tasks loaded: {len(all_tasks)}")

    tasks = []
    for t in all_tasks:
        task_assigner = t.asigner.strip().lower()
        if assigner_normalized in task_assigner or task_assigner in assigner_normalized:
            tasks.append(t)
        else:
            print(f"✖ Skipped: input='{assigner_normalized}' vs assigner='{task_assigner}'")

    formatted = [
        f"ID: {t.task_id}, Task: {t.task_name}, Description: {t.task_description}, "
        f"Request Date: {t.request_date.strftime('%Y-%m-%d %H:%M')}, "
        f"Deadline: {t.deadline.strftime('%Y-%m-%d %H:%M')}, "
        f"Assigned to: {t.asignee}, Assigned by: {t.asigner}, Status: {t.status}"
        for t in tasks
    ]

    print(f"Tasks matched and formatted for assigner '{assigner}': {len(formatted)}")
    return formatted
