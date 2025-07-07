# Product Requirements Document: Ritvik Web UI

## Introduction/Overview

Ritvik is a task management system that currently operates through a Google Chat bot with Excel-based data storage. This PRD outlines the development of a web-based user interface that will provide a comprehensive dashboard for task management while maintaining synchronization with the existing bot integration. The web UI will serve as the primary interface for users to manage their tasks, with a planned migration from Excel to PostgreSQL database backend.

**Goal:** Create a web-based task management interface that provides real-time synchronization with the existing Google Chat bot, enabling users to efficiently manage tasks assigned to them and tasks they assign to others.

## Goals

1. **Primary Goal:** Develop a responsive web UI for task management accessible via email-based authentication
2. **Data Migration:** Successfully migrate from Excel-based storage to PostgreSQL database
3. **Real-time Synchronization:** Ensure immediate data consistency between web UI and Google Chat bot
4. **User Experience:** Provide an intuitive dashboard-centric interface for task management
5. **Reliability:** Implement comprehensive testing to ensure system reliability during database migration

## User Stories

1. **As a non-developer user**, I want to log into Ritvik.com with my email ID so that I can access my personalized task dashboard.

2. **As a user**, I want to see a sidebar with "Tasks Assigned to Me" and "Tasks Assigned by Me" so that I can quickly navigate between different task views.

3. **As a user**, I want to view my dashboard showing pending task counts so that I can quickly understand my workload.

4. **As a user**, I want to click on a task to view its details in a popup so that I can get more information without leaving the current page.

5. **As a user**, I want to create, update, and delete tasks from the web UI so that I can manage my work efficiently.

6. **As a user**, I want to receive email notifications when tasks are assigned to me, updated, or approaching deadlines so that I stay informed about important changes.

7. **As a user**, I want changes made in the web UI to be immediately reflected in the Google Chat bot so that I have consistent data across all platforms.

## Functional Requirements

### Authentication & Access
1. The system must allow users to authenticate using email-based login
2. The system must restrict access to authenticated users only
3. The system must maintain user sessions securely

### Dashboard & Navigation
4. The system must display a dashboard as the homepage after login
5. The system must show a sidebar with navigation options: "Tasks Assigned to Me" and "Tasks Assigned by Me"
6. The system must display pending task counts on the dashboard
7. The system must allow users to click on task counts to navigate to detailed task lists

### Task Management
8. The system must allow users to create new tasks
9. The system must allow users to view all tasks (both assigned to them and assigned by them)
10. The system must allow users to update existing tasks
11. The system must allow users to delete tasks
12. The system must display task details in a popup when clicked from the dashboard or task lists

### Data Synchronization
13. The system must maintain real-time synchronization between web UI and Google Chat bot
14. The system must use a shared backend API for both web UI and bot integration
15. The system must ensure data consistency across all platforms

### Database Migration
16. The system must support migration from Excel-based storage to PostgreSQL database
17. The system must maintain data integrity during the migration process
18. The system must support both Excel and PostgreSQL backends during transition period

### Notifications
19. The system must send email notifications when tasks are assigned to users
20. The system must send email notifications when tasks are updated by others
21. The system must send email notifications when task deadlines are approaching
22. The system must send email notifications for all other relevant task-related events

## Non-Goals (Out of Scope)

1. **Google Chat Bot Development** - The existing Google Chat bot integration is already implemented and out of scope
2. **Mobile App Development** - Only web UI is included in this phase
3. **Advanced Project Management Features** - No project organization, time tracking, or advanced reporting
4. **Multiple Authentication Providers** - Only email-based authentication is supported
5. **Task Templates or Automation** - Basic CRUD operations only
6. **File Attachments** - No file upload/attachment functionality
7. **Real-time Chat/Comments** - No communication features within tasks
8. **Advanced User Roles** - No admin/manager role differentiation

## Design Considerations

### User Interface
- Dashboard-centric design with sidebar navigation
- Popup-based task detail views for quick access
- Responsive design for desktop and tablet usage
- Clean, minimalist interface focusing on task management essentials

### Technical Architecture
- Shared backend API serving both web UI and Google Chat bot
- RESTful API design for task operations (Create, Read, Update, Delete) using nestjs
- Real-time synchronization using appropriate technology (WebSockets or Server-Sent Events)

## Technical Considerations

### Database Migration Strategy
- **Phase 1:** Implement comprehensive unit tests for existing Excel-based operations
- **Phase 2:** Develop PostgreSQL backend with identical API interface
- **Phase 3:** Migrate data and switch to PostgreSQL backend
- **Testing:** Ensure identical behavior between Excel and PostgreSQL implementations

### Backend Requirements
- Shared API layer for both web UI and Google Chat bot
- PostgreSQL database (Supabase recommended for initial implementation)
- Real-time synchronization capabilities
- Email notification service integration

### Testing Strategy
- **Unit Tests:** Test individual API functions and components
- **Integration Tests:** Test database operations and API-to-database workflows
- **End-to-End Tests:** Test complete user workflows from UI to database
- **Cross-Platform Tests:** Verify synchronization between web UI and bot

## Success Metrics

1. **Migration Success:** 100% data integrity maintained during Excel to PostgreSQL migration
2. **Synchronization Accuracy:** 99.9% real-time sync success rate between web UI and bot
3. **User Adoption:** Target user engagement with web UI within first month
4. **Performance:** Task operations complete within 2 seconds
5. **Reliability:** 99.5% uptime for web application
6. **Test Coverage:** 90% code coverage for critical task management functions

## Open Questions

1. **Database Hosting:** Should we use Supabase for PostgreSQL hosting or set up our own database server?
2. **UI Framework:** Which frontend framework should be used for the web UI development?
3. **Real-time Sync Technology:** Should we use WebSockets, Server-Sent Events, or polling for real-time synchronization?
4. **Email Service:** Which email service provider should be used for notifications?
5. **Error Handling:** What should happen if synchronization between web UI and bot fails?
6. **Data Backup:** What backup strategy should be implemented for the PostgreSQL database?
7. **Performance:** Are there any specific performance requirements for concurrent users?
8. **Deployment:** What are the hosting and deployment requirements for the web UI?
