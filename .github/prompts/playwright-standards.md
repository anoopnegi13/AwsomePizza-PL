# Playwright Standards

## Locators

Priority order:

1. getByRole
2. getByLabel
3. getByPlaceholder
4. getByText
5. getByTestId

Use CSS selectors only as a last resort.

## Waiting

Use:
- expect()
- locator.waitFor()

Avoid:
- waitForTimeout()

## Assertions

Prefer:
- toHaveText()
- toBeVisible()
- toBeEnabled()

Avoid:
- manual text extraction
- arbitrary sleeps

## Test Design

Tests must:
- be independent
- be deterministic
- be parallel safe
``