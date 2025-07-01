from pydantic import BaseModel, Field
from datetime import datetime
from uuid import uuid4, UUID

class Task(BaseModel):
    asigner: str
    asignee: str
    request_date: datetime
    task: str
    deadline: datetime
    status: str = Field(default="incomplete")
    task_id: UUID = Field(default_factory=uuid4)
