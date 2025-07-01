---
description:
globs:
alwaysApply: false
---
# Rule: Creating Technical Documentation from Completed Tasks

## Goal

To guide an AI assistant in creating comprehensive technical documentation for a feature that has been recently completed based on a task list. The documentation should be clear, structured, and suitable for developers, maintainers, and future team members to understand the implementation.

## Process

1. **Receive Task List Reference:** The user points the AI to a completed task list file (with all tasks marked `[x]`).
2. **Analyze Implementation:** The AI examines the completed task list, relevant files, and actual code implementation to understand:
   - What was built and how it works
   - Key components and their interactions
   - Technical decisions and architecture
   - Dependencies and integrations
3. **Generate Documentation:** Create comprehensive technical documentation following the structure outlined below.
4. **Save Documentation:** Save the generated document in the appropriate location under `/docs/specifications/technical/` with a descriptive name.

## Output

- **Format:** Markdown (`.md`)
- **Location:** `/docs/specifications/technical/`
- **Filename:** `[feature-name].md` or organized in subdirectories like `[feature-name]/overview.md`

## Documentation Structure

The generated technical documentation should include the following sections:

### 1. Feature Overview
- Brief description of what the feature does
- Problem it solves and its purpose
- High-level architecture summary

### 2. Core Components
- List and describe the main components/modules
- Explain the role of each component
- Show how components interact with each other

### 3. Implementation Details
- Key algorithms or logic
- Data structures used
- Important technical decisions and rationale
- Performance considerations

### 4. API/Interface Documentation
- Public APIs, endpoints, or interfaces exposed
- Input/output specifications
- Usage examples
- Error handling

### 5. Dependencies & Integrations
- External libraries or services used
- Internal system integrations
- Configuration requirements
- Environment variables or settings

### 6. File Structure
- List of files created or modified
- Brief description of each file's purpose
- Directory organization rationale

### 7. Testing
- Testing strategy employed
- Types of tests (unit, integration, etc.)
- Test coverage highlights
- How to run tests

### 8. Usage Examples
- Code examples showing how to use the feature
- Common use cases
- Configuration examples

### 9. Deployment & Configuration
- How to deploy the feature
- Configuration steps required
- Environment-specific considerations

### 10. Known Limitations & Future Improvements
- Current limitations or constraints
- Areas for future enhancement
- Technical debt or refactoring opportunities

### 11. Troubleshooting
- Common issues and their solutions
- Debugging tips
- Error messages and their meanings

## Documentation Guidelines

### Writing Style
- Use clear, concise language
- Assume the reader is a developer but may not be familiar with this specific feature
- Include code examples where helpful
- Use proper Markdown formatting

### Code Examples
- Provide runnable code snippets
- Include comments explaining complex logic
- Show both basic and advanced usage patterns
- Use consistent formatting and naming conventions

### Diagrams and Visual Aids
- Include mermaid architecture diagrams where helpful
- Use flowcharts for complex processes
- Consider sequence diagrams for API interactions

### Cross-References
- Link to related documentation
- Reference the original PRD or task list
- Include links to relevant code files in the repository

## Analysis Process

Before writing documentation, the AI should:

1. **Review the completed task list** to understand what was implemented
2. **Examine the "Relevant Files" section** to identify key components
3. **Read the actual implementation** in the listed files
4. **Understand the git commit history** related to the feature
5. **Identify patterns and architectural decisions** made during implementation
6. **Check for any existing tests** to understand expected behavior
7. **Look for configuration files** or environment setup requirements

## Quality Checklist

The documentation should be:
- [ ] **Complete**: Covers all major aspects of the feature
- [ ] **Accurate**: Reflects the actual implementation
- [ ] **Clear**: Easy to understand for the target audience
- [ ] **Actionable**: Provides sufficient detail for usage and maintenance
- [ ] **Well-structured**: Follows the prescribed format
- [ ] **Up-to-date**: Matches the current implementation
- [ ] **Consistent**: Uses consistent terminology and formatting

## Target Audience

The primary audience includes:
- **Developers** who need to maintain or extend the feature
- **New team members** who need to understand the codebase
- **DevOps engineers** who need to deploy or configure the feature
- **Technical leads** who need to understand architectural decisions

## Integration with Existing Docs

- Ensure the new documentation fits within the existing documentation structure
- Update any index files or navigation as needed
- Cross-reference with related documentation
- Follow the same formatting and style conventions as existing docs

## Maintenance Notes

- Documentation should be updated when the feature is modified
- Include a "Last Updated" date or version information
- Consider adding a changelog section for significant updates
- Link to the source task list for historical context