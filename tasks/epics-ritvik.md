# Epics for Ritvik - v1

**Project:** Ritvik - Conversational Task Management Bot  
**Phase:** v1  
**Timeline:** 3 Days  
**Primary Owner:** Yeshwanth  
**Stakeholder:** Dinesh  

---

## Epic 1: Google Chat Integration & User Authentication

- **Title:** Google Chat Integration & User Authentication
- **Phase:** v1
- **Description:** This epic covers the initial setup of the Ritvik Google Chat application and ensuring that all interactions can be tied back to a verified Google Workspace user. This is a foundational step to ensure that tasks are assigned and tracked securely.
- **User Stories:**
  - As a user, I want to be able to add the Ritvik bot to a Google Chat space.
  - As a developer, I need to be able to identify the user's Google Workspace email when they interact with the bot.
- **Estimated Effort:** Medium
- **Owner / Stakeholder:** Harshit (Google Chat Integration)
- **Dependencies:** None
- **Risks/Assumptions:** Assumes that the necessary permissions to create and configure a Google Chat app are available.

---

## Epic 2: Core Task Creation (`/task` command)

- **Title:** Core Task Creation (`/task` command)
- **Phase:** v1
- **Description:** This epic focuses on implementing the primary task creation functionality. Users will be able to use the `/task` command to open a form (dialog) and create a new task. The task will be saved to the backend.
- **User Stories:**
  - As a user, I want to be able to type `/task` in Google Chat to open a task creation form.
  - As a user, I want to be able to fill out the task details (e.g., title, description, assignee) in the form and submit it.
  - As a developer, I need an API endpoint that accepts the form data and creates a new task.
- **Estimated Effort:** Large
- **Owner / Stakeholder:** Abhilash (Backend), Harshit (Google Chat Integration)
- **Dependencies:** Epic 1 (Google Chat Integration)
- **Risks/Assumptions:** The design of the task creation form is clear and agreed upon.

---

## Epic 3: Task Update (`/update` command)

- **Title:** Task Update (`/update` command)
- **Phase:** v1
- **Description:** This epic enables users to provide updates on existing tasks. The `/update` command will allow users to change the status of a task or add comments.
- **User Stories:**
  - As a user, I want to be able to use an `/update` command to modify an existing task.
  - As a user, I want to be able to change the status of a task (e.g., "In Progress", "Completed").
  - As a developer, I need an API endpoint to handle task updates.
- **Estimated Effort:** Medium
- **Owner / Stakeholder:** Abhilash (Backend), Harshit (Google Chat Integration)
- **Dependencies:** Epic 2 (Core Task Creation)
- **Risks/Assumptions:** The states a task can be in are well-defined.

---

## Epic 4: Backend & API with Excel Data Store

- **Title:** Backend & API with Excel Data Store
- **Phase:** v1
- **Description:** This epic covers the creation of the initial backend service using FastAPI. For v1, the data will be stored in an Excel file, which will serve as a temporary database. The API will handle reading from and writing to this Excel file.
- **User Stories:**
  - As a developer, I need to set up a FastAPI backend service.
  - As a developer, I need to create functions to read and write task data to an Excel file.
  - As a developer, I need to expose API endpoints for creating and updating tasks.
- **Estimated Effort:** Medium
- **Owner / Stakeholder:** Abhilash (Backend)
- **Dependencies:** None
- **Risks/Assumptions:** Using Excel as a database is sufficient for the v1 user load and functionality. Concurrency issues are not expected to be a major problem in v1.

---

## Epic 5: Deployment to Internal Infrastructure

- **Title:** Deployment to Internal Infrastructure
- **Phase:** v1
- **Description:** This epic is for deploying the FastAPI backend to Diwami's internal infrastructure, making it accessible to the Google Chat application.
- **User Stories:**
  - As a developer, I need to package the backend application for deployment.
  - As a developer, I need to deploy the application to a server within the Diwami network.
- **Estimated Effort:** Small
- **Owner / Stakeholder:** Dev Team
- **Dependencies:** Epic 4 (Backend & API)
- **Risks/Assumptions:** Access to and instructions for deploying to the internal infrastructure are available.

---

## Epic 6: Migrate Data Store to PostgreSQL (Low Priority)

- **Title:** Migrate Data Store to PostgreSQL
- **Phase:** v1 (Low Priority)
- **Description:** This epic covers migrating the data store from an Excel file to a PostgreSQL database. This is a low-priority task for v1 and can be moved to Phase 2 if necessary.
- **User Stories:**
  - As a developer, I need to set up a PostgreSQL database and schema for tasks.
  - As a developer, I need to update the backend to use SQLModel as an ORM to interact with the PostgreSQL database.
  - As a developer, I need to migrate any existing task data from the Excel file to the PostgreSQL database.
- **Estimated Effort:** Medium
- **Owner / Stakeholder:** Abhilash (Backend)
- **Dependencies:** Epic 4 (Backend & API)
- **Risks/Assumptions:** The PostgreSQL instance is available and accessible from the backend service.
