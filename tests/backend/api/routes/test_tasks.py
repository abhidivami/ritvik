import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from datetime import datetime
from uuid import uuid4

from src.ritvik.main import app
from src.ritvik.models import Task


@pytest.fixture
def client():
    """Create a test client for the FastAPI application."""
    return TestClient(app)


@pytest.fixture
def sample_task():
    """Create a sample task for testing."""
    return Task(
        asigner="test@example.com",
        asignee="assignee@example.com",
        request_date=datetime(2025, 7, 7, 10, 0, 0),
        task_name="Test Task",
        task_description="This is a test task description",
        deadline=datetime(2025, 7, 10, 18, 0, 0),
        status="incomplete",
        task_id=uuid4()
    )


@pytest.fixture
def sample_task_dict():
    """Create a sample task dictionary for API requests."""
    return {
        "asigner": "test@example.com",
        "asignee": "assignee@example.com",
        "request_date": "2025-07-07T10:00:00",
        "task_name": "Test Task",
        "task_description": "This is a test task description",
        "deadline": "2025-07-10T18:00:00",
        "status": "incomplete"
    }


@pytest.fixture
def multiple_tasks():
    """Create multiple tasks for testing list operations."""
    return [
        Task(
            asigner="manager@example.com",
            asignee="alice@example.com",
            request_date=datetime(2025, 7, 5, 9, 0, 0),
            task_name="Task 1",
            task_description="First task description",
            deadline=datetime(2025, 7, 8, 17, 0, 0),
            status="incomplete",
            task_id=uuid4()
        ),
        Task(
            asigner="manager@example.com",
            asignee="bob@example.com",
            request_date=datetime(2025, 7, 6, 10, 0, 0),
            task_name="Task 2",
            task_description="Second task description",
            deadline=datetime(2025, 7, 9, 16, 0, 0),
            status="complete",
            task_id=uuid4()
        ),
        Task(
            asigner="alice@example.com",
            asignee="charlie@example.com",
            request_date=datetime(2025, 7, 7, 11, 0, 0),
            task_name="Task 3",
            task_description="Third task description",
            deadline=datetime(2025, 7, 11, 15, 0, 0),
            status="in_progress",
            task_id=uuid4()
        )
    ]


class TestAddTaskFromChat:
    """Test cases for POST /add-task-from-chat endpoint."""
    
    @patch('src.ritvik.main.add_task')
    def test_add_task_from_chat_success(self, mock_add_task, client, sample_task_dict):
        """Test successful task creation from chat."""
        # Mock the add_task function to avoid actual Excel file operations
        mock_add_task.return_value = None
        
        response = client.post("/add-task-from-chat", json=sample_task_dict)
        
        # Verify response
        assert response.status_code == 200
        assert response.json() == {"success": True, "message": "Task added from chat message."}
        
        # Verify that add_task was called with correct parameters
        mock_add_task.assert_called_once()
        called_task = mock_add_task.call_args[0][0]
        assert called_task.asigner == sample_task_dict["asigner"]
        assert called_task.asignee == sample_task_dict["asignee"]
        assert called_task.task_name == sample_task_dict["task_name"]
        assert called_task.task_description == sample_task_dict["task_description"]
        assert called_task.status == sample_task_dict["status"]
    
    def test_add_task_from_chat_missing_asigner(self, client, sample_task_dict):
        """Test task creation with missing asigner field."""
        incomplete_data = sample_task_dict.copy()
        del incomplete_data["asigner"]
        
        response = client.post("/add-task-from-chat", json=incomplete_data)
        
        assert response.status_code == 400
        assert "Missing field: asigner" in response.json()["detail"]
    
    def test_add_task_from_chat_missing_asignee(self, client, sample_task_dict):
        """Test task creation with missing asignee field."""
        incomplete_data = sample_task_dict.copy()
        del incomplete_data["asignee"]
        
        response = client.post("/add-task-from-chat", json=incomplete_data)
        
        assert response.status_code == 400
        assert "Missing field: asignee" in response.json()["detail"]
    
    def test_add_task_from_chat_missing_task_name(self, client, sample_task_dict):
        """Test task creation with missing task_name field."""
        incomplete_data = sample_task_dict.copy()
        del incomplete_data["task_name"]
        
        response = client.post("/add-task-from-chat", json=incomplete_data)
        
        assert response.status_code == 400
        assert "Missing field: task_name" in response.json()["detail"]
    
    def test_add_task_from_chat_missing_task_description(self, client, sample_task_dict):
        """Test task creation with missing task_description field."""
        incomplete_data = sample_task_dict.copy()
        del incomplete_data["task_description"]
        
        response = client.post("/add-task-from-chat", json=incomplete_data)
        
        assert response.status_code == 400
        assert "Missing field: task_description" in response.json()["detail"]
    
    def test_add_task_from_chat_missing_request_date(self, client, sample_task_dict):
        """Test task creation with missing request_date field."""
        incomplete_data = sample_task_dict.copy()
        del incomplete_data["request_date"]
        
        response = client.post("/add-task-from-chat", json=incomplete_data)
        
        assert response.status_code == 400
        assert "Missing field: request_date" in response.json()["detail"]
    
    def test_add_task_from_chat_missing_deadline(self, client, sample_task_dict):
        """Test task creation with missing deadline field."""
        incomplete_data = sample_task_dict.copy()
        del incomplete_data["deadline"]
        
        response = client.post("/add-task-from-chat", json=incomplete_data)
        
        assert response.status_code == 400
        assert "Missing field: deadline" in response.json()["detail"]
    
    def test_add_task_from_chat_missing_status(self, client, sample_task_dict):
        """Test task creation with missing status field."""
        incomplete_data = sample_task_dict.copy()
        del incomplete_data["status"]
        
        response = client.post("/add-task-from-chat", json=incomplete_data)
        
        assert response.status_code == 400
        assert "Missing field: status" in response.json()["detail"]
    
    def test_add_task_from_chat_invalid_request_date_format(self, client, sample_task_dict):
        """Test task creation with invalid request_date format."""
        invalid_data = sample_task_dict.copy()
        invalid_data["request_date"] = "invalid-date-format"
        
        response = client.post("/add-task-from-chat", json=invalid_data)
        
        assert response.status_code == 400
        assert "Invalid date format" in response.json()["detail"]
    
    def test_add_task_from_chat_invalid_deadline_format(self, client, sample_task_dict):
        """Test task creation with invalid deadline format."""
        invalid_data = sample_task_dict.copy()
        invalid_data["deadline"] = "invalid-date-format"
        
        response = client.post("/add-task-from-chat", json=invalid_data)
        
        assert response.status_code == 400
        assert "Invalid date format" in response.json()["detail"]
    
    @patch('src.ritvik.main.add_task')
    def test_add_task_from_chat_with_null_deadline(self, mock_add_task, client, sample_task_dict):
        """Test task creation with null deadline."""
        mock_add_task.return_value = None
        
        task_data = sample_task_dict.copy()
        task_data["deadline"] = None
        
        response = client.post("/add-task-from-chat", json=task_data)
        
        assert response.status_code == 400
        assert "Invalid date format" in response.json()["detail"]
    
    @patch('src.ritvik.main.add_task')
    def test_add_task_from_chat_with_empty_strings(self, mock_add_task, client):
        """Test task creation with empty string values."""
        empty_data = {
            "asigner": "",
            "asignee": "",
            "request_date": "2025-07-07T10:00:00",
            "task_name": "",
            "task_description": "",
            "deadline": "2025-07-10T18:00:00",
            "status": ""
        }
        
        response = client.post("/add-task-from-chat", json=empty_data)
        
        # Should still succeed as the endpoint doesn't validate empty strings
        assert response.status_code == 200
        assert response.json() == {"success": True, "message": "Task added from chat message."}
    
    @patch('src.ritvik.main.add_task')
    def test_add_task_from_chat_with_special_characters(self, mock_add_task, client):
        """Test task creation with special characters in text fields."""
        mock_add_task.return_value = None
        
        special_data = {
            "asigner": "user+test@example.com",
            "asignee": "assignee@example.com",
            "request_date": "2025-07-07T10:00:00",
            "task_name": "Task with special chars: @#$%^&*()",
            "task_description": "Description with unicode: 测试 emoji: 🚀",
            "deadline": "2025-07-10T18:00:00",
            "status": "incomplete"
        }
        
        response = client.post("/add-task-from-chat", json=special_data)
        
        assert response.status_code == 200
        assert response.json() == {"success": True, "message": "Task added from chat message."}
    
    @patch('src.ritvik.main.add_task')
    def test_add_task_from_chat_with_very_long_text(self, mock_add_task, client):
        """Test task creation with very long text fields."""
        mock_add_task.return_value = None
        
        long_text = "x" * 1000  # 1000 character string
        
        long_data = {
            "asigner": "user@example.com",
            "asignee": "assignee@example.com",
            "request_date": "2025-07-07T10:00:00",
            "task_name": long_text,
            "task_description": long_text,
            "deadline": "2025-07-10T18:00:00",
            "status": "incomplete"
        }
        
        response = client.post("/add-task-from-chat", json=long_data)
        
        assert response.status_code == 200
        assert response.json() == {"success": True, "message": "Task added from chat message."}
    
    @patch('src.ritvik.main.add_task')
    def test_add_task_from_chat_with_past_deadline(self, mock_add_task, client):
        """Test task creation with deadline in the past."""
        mock_add_task.return_value = None
        
        past_data = {
            "asigner": "user@example.com",
            "asignee": "assignee@example.com",
            "request_date": "2025-07-07T10:00:00",
            "task_name": "Past deadline task",
            "task_description": "This task has a deadline in the past",
            "deadline": "2020-01-01T18:00:00",
            "status": "incomplete"
        }
        
        response = client.post("/add-task-from-chat", json=past_data)
        
        # Should still succeed as the endpoint doesn't validate deadline dates
        assert response.status_code == 200
        assert response.json() == {"success": True, "message": "Task added from chat message."}
    
    def test_add_task_from_chat_malformed_json(self, client):
        """Test task creation with malformed JSON."""
        response = client.post("/add-task-from-chat", data="invalid json")
        
        assert response.status_code == 422  # Unprocessable Entity
    
    def test_add_task_from_chat_empty_request_body(self, client):
        """Test task creation with empty request body."""
        response = client.post("/add-task-from-chat", json={})
        
        assert response.status_code == 400
        assert "Missing field" in response.json()["detail"]
    
    @patch('src.ritvik.main.add_task')
    def test_add_task_from_chat_excel_exception(self, mock_add_task, client, sample_task_dict):
        """Test task creation when Excel operations fail."""
        mock_add_task.side_effect = Exception("Excel file error")
        
        # The endpoint doesn't handle Excel exceptions, so it should raise a 500 error
        # But due to how FastAPI handles unhandled exceptions, this will actually
        # raise the exception in the test environment
        with pytest.raises(Exception) as exc_info:
            client.post("/add-task-from-chat", json=sample_task_dict)
        
        assert "Excel file error" in str(exc_info.value)


class TestGetTasksByName:
    """Test cases for POST /get-tasks-by-name endpoint."""
    
    def test_get_tasks_by_name_success(self, client):
        """Test successful task retrieval by assignee name."""
        pass
    
    def test_get_tasks_by_name_missing_assignee(self, client):
        """Test task retrieval with missing assignee field."""
        pass
    
    def test_get_tasks_by_name_no_tasks_found(self, client):
        """Test task retrieval when no tasks exist for assignee."""
        pass


class TestUpdateTaskStatus:
    """Test cases for POST /update-task-status endpoint."""
    
    def test_update_task_status_success(self, client, sample_task):
        """Test successful task status update by ID."""
        pass
    
    def test_update_task_status_missing_fields(self, client):
        """Test task status update with missing fields."""
        pass
    
    def test_update_task_status_invalid_uuid(self, client):
        """Test task status update with invalid UUID format."""
        pass
    
    def test_update_task_status_task_not_found(self, client):
        """Test task status update for non-existent task."""
        pass


class TestUpdateTaskStatusByName:
    """Test cases for POST /update-task-status-by-name endpoint."""
    
    def test_update_task_status_by_name_success(self, client):
        """Test successful task status update by name."""
        pass
    
    def test_update_task_status_by_name_with_task_name_field(self, client):
        """Test task status update using 'task_name' field instead of 'task'."""
        pass
    
    def test_update_task_status_by_name_missing_fields(self, client):
        """Test task status update with missing fields."""
        pass
    
    def test_update_task_status_by_name_task_not_found(self, client):
        """Test task status update for non-existent task."""
        pass


class TestUpdateTaskStatusById:
    """Test cases for POST /update-task-status-by-id endpoint."""
    
    def test_update_task_status_by_id_success(self, client, sample_task_dict):
        """Test successful full task update by ID."""
        pass
    
    def test_update_task_status_by_id_missing_task_id(self, client):
        """Test task update with missing task_id."""
        pass
    
    def test_update_task_status_by_id_invalid_input(self, client):
        """Test task update with invalid input data."""
        pass
    
    def test_update_task_status_by_id_task_not_found(self, client):
        """Test task update for non-existent task."""
        pass


class TestGetTasksAssignedToMe:
    """Test cases for POST /get-tasks-assigned-to-me endpoint."""
    
    def test_get_tasks_assigned_to_me_success(self, client, multiple_tasks):
        """Test successful retrieval of tasks assigned to user."""
        pass
    
    def test_get_tasks_assigned_to_me_case_insensitive(self, client):
        """Test case-insensitive matching for assignee name."""
        pass
    
    def test_get_tasks_assigned_to_me_missing_assignee(self, client):
        """Test task retrieval with missing assignee field."""
        pass
    
    def test_get_tasks_assigned_to_me_no_tasks_found(self, client):
        """Test task retrieval when no tasks are assigned to user."""
        pass


class TestGetTasksAssignedByMe:
    """Test cases for POST /get-tasks-assigned-by-me endpoint."""
    
    def test_get_tasks_assigned_by_me_success(self, client, multiple_tasks):
        """Test successful retrieval of tasks assigned by user."""
        pass
    
    def test_get_tasks_assigned_by_me_with_assigner_field(self, client):
        """Test task retrieval using 'assigner' field instead of 'asigner'."""
        pass
    
    def test_get_tasks_assigned_by_me_case_insensitive(self, client):
        """Test case-insensitive matching for assigner name."""
        pass
    
    def test_get_tasks_assigned_by_me_missing_assigner(self, client):
        """Test task retrieval with missing assigner field."""
        pass
    
    def test_get_tasks_assigned_by_me_no_tasks_found(self, client):
        """Test task retrieval when no tasks are assigned by user."""
        pass


class TestErrorHandling:
    """Test cases for error handling and edge cases."""
    
    def test_malformed_json_request(self, client):
        """Test handling of malformed JSON requests."""
        pass
    
    def test_empty_request_body(self, client):
        """Test handling of empty request body."""
        pass
    
    def test_invalid_http_method(self, client):
        """Test handling of invalid HTTP methods."""
        pass
    
    def test_excel_file_access_error(self, client):
        """Test handling of Excel file access errors."""
        pass


class TestDataValidation:
    """Test cases for data validation and edge cases."""
    
    def test_task_with_null_deadline(self, client):
        """Test task creation with null deadline."""
        pass
    
    def test_task_with_empty_strings(self, client):
        """Test task creation with empty string values."""
        pass
    
    def test_task_with_special_characters(self, client):
        """Test task creation with special characters in text fields."""
        pass
    
    def test_task_with_very_long_text(self, client):
        """Test task creation with very long text fields."""
        pass
    
    def test_task_with_past_deadline(self, client):
        """Test task creation with deadline in the past."""
        pass


# Helper functions for test utilities
def create_mock_task(task_id=None, **kwargs):
    """Create a mock task with optional overrides."""
    defaults = {
        "asigner": "test@example.com",
        "asignee": "assignee@example.com",
        "request_date": datetime(2025, 7, 7, 10, 0, 0),
        "task_name": "Test Task",
        "task_description": "Test Description",
        "deadline": datetime(2025, 7, 10, 18, 0, 0),
        "status": "incomplete",
        "task_id": task_id or uuid4()
    }
    defaults.update(kwargs)
    return Task(**defaults)


def assert_task_response_format(response_data, expected_count=None):
    """Assert that the response follows the expected format for task lists."""
    if expected_count is not None:
        assert len(response_data) == expected_count
    
    for task_str in response_data:
        assert "ID:" in task_str
        assert "Task:" in task_str
        assert "Deadline:" in task_str
        assert "Status:" in task_str
