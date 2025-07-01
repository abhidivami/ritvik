# Product Brief

Initiation of “RITVIK” — Conversational Task Management Bot for Google Workspace

The Diwami engineering team convened to formally initiate the planning for RITVIK, an internal chatbot designed to manage task workflows directly within Google Chat. The discussion outlined foundational principles, expected user behaviors, interface modalities, and technical considerations for version one of the project.

The core idea centers around creating a lightweight task management system accessible via chat commands or forms inside Google Chat, abstracting the friction associated with traditional task tools. RITVIK will serve as a conversational interface for task assignment, tracking, updates, and metrics—designed for minimal UI friction and rapid interaction.

Visit [Functional Overview](../functional/overview.md) for detailed specifications and planned system behavior.

## Scope of First Sprint
- Define behavior for `/task` and `/update` including form logic.
- Implement a basic backend with API exposure to read/write from PostgreSQL.
- Google Chat app integration including dialog handling via AppScript or Cloud Functions.
- Host backend in Diwami-controlled infra (non-SaaS).
- Allow for internal user identification via Google Workspace email.

## Phase 2 Aspirations
- LLM-powered task parsing from natural conversations.
- Natural Language Parsing (v2): Planned LLM integration for free-form task creation.
- Email or calendar-linked reminders and deadlines.
- Automatic task summarization and progress reporting.

## Suggested Stack (Under Evaluation)
- **Frontend (UI):** Optional web portal for task visualization.
- **Backend:** FastAPI API layer.
- **Database:** PostgreSQL with SQLModel as ORM.
- **Chat Integration:** Google Chat App with AppScript or Webhook-based handler.
- **Optional LLM Use:** Prompt parsing for free-form text conversion to task schema using Pydantic-AI.

The project intends to minimize meetings by shifting updates into asynchronous task flows, enabling visibility and accountability through structured chat interactions. RITVIK is positioned as a long-term internal tool that evolves into a fully LLM-aware assistant within Diwami’s productivity suite.