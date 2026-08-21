# Framework Skill

## Purpose

Provide framework-specific guidance for the Awesome Pizza Playwright automation framework.

## Framework Architecture

### tests/

Contains test scenarios and orchestration only.

Must not contain:

- Selectors
- Assertions
- Business logic

### pages/

Contains Page Objects and UI interactions.

Must not contain:

- Assertions
- Test logic

### steps/

Contains business workflows and user actions.

Must not contain:

- Assertions

### verifications/

Contains assertions and validations.

Must not contain:

- Business actions
- Navigation logic

### utils/

Contains reusable framework utilities.

## Architecture Rules

- Never place business logic in tests.
- Tests should orchestrate workflow execution through Steps classes and perform only minimal orchestration logic.
- Complex validations belong in Verification classes.Simple assertions may remain in tests when they improve readability and do not create duplication.
- Page interactions belong in Page Objects.
- Reuse existing code before creating new functionality.

## When Generating Tests

Always perform these checks:

1. Read existing tests.
2. Read existing Pages.
3. Read existing Steps.
4. Read existing Verifications.
5. Reuse existing code.
6. Generate only missing functionality.

## UI Automation Standards

- Use TypeScript.
- Use Playwright Test.
- Prefer getByRole().
- Prefer accessible locators.
- Avoid brittle CSS selectors.
- Follow the AAA (Arrange, Act, Assert) pattern.
- Keep tests independent and deterministic.

## New Feature Development Process

For every new scenario:

1. Inspect existing Pages.
2. Reuse existing methods where possible.
3. Create only missing Page methods.
4. Create Step methods that orchestrate Page actions.
5. Create Verification methods for assertions.
6. Create or update Tests that call Steps and Verifications.

Always prefer extending existing files before creating new files.

## File Reuse Rules

Before creating a file:

- Search for an existing Page object.
- Search for an existing Steps class.
- Search for an existing Verification class.

Only create a new file when responsibility does not belong to an existing component.

## Review Guidelines

When reviewing automation:

- Identify framework violations.
- Identify code duplication.
- Verify compliance with the framework architecture.
- Preserve existing framework conventions.

### components/

Reusable UI sections.

Examples:
- HeaderComponent
- CartComponent
- MenuComponent

Must not contain:
- Assertions
- Test logic

### fixtures/

Contains:

- Page object fixtures
- Test data fixtures
- Shared setup

Must be reused before introducing new setup logic.

## Page Object Standards

Page Objects must:

- Expose business-friendly methods
- Hide locator details
- Avoid assertions
- Avoid test-specific logic

## Step Standards

Steps should represent business capabilities.

Examples:

menu.steps.ts
order.steps.ts
theme.steps.ts

Avoid creating large generic step classes.

## Verification Standards

Verification classes should:

- Group related assertions
- Reuse common validation methods
- Avoid UI actions
- Avoid navigation

## Anti Patterns

Do not:

- Duplicate existing methods
- Create unnecessary wrappers
- Place assertions inside pages
- Place locators inside tests
- Use waitForTimeout()
- Use brittle CSS selectors
- Create tests that depend on execution order

