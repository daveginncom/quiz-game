# Testing Guide

This project uses **Vitest** and **React Testing Library** for unit testing.

## Running Tests

```bash
# Run tests in watch mode (default)
npm test

# Run tests once (CI mode)
npm test -- --run

# Run tests with UI
npm test:ui

# Run tests with coverage report
npm test:coverage
```

## Test Structure

Tests are co-located with their source files using the `.test.ts` or `.test.tsx` extension:

```
src/
├── utils/
│   ├── quizUtils.ts
│   └── quizUtils.test.ts          # Unit tests for utilities
├── components/
│   ├── ChoiceButton.tsx
│   ├── ChoiceButton.test.tsx      # Component tests
│   ├── FeedbackMessage.tsx
│   ├── FeedbackMessage.test.tsx
│   ├── MainMenu.tsx
│   ├── MainMenu.test.tsx
│   ├── QuizStats.tsx
│   └── QuizStats.test.tsx
└── test/
    └── setup.ts                    # Test configuration
```

## Test Coverage

Current test files cover:

### Utility Functions (`quizUtils.test.ts`)

- ✅ `shuffleArray()` - Array shuffling with Fisher-Yates algorithm
- ✅ `getLetterGrade()` - 10-point grading scale (A-F)
- ✅ `choiceColors` - Color constants for quiz choices

### Components

- ✅ `ChoiceButton` - Answer button rendering, selection, and feedback
- ✅ `FeedbackMessage` - Correct/incorrect feedback display
- ✅ `MainMenu` - Quiz selection interface
- ✅ `QuizStats` - Progress and score tracking display

### Test Statistics

- **Total Tests:** 33
- **Test Files:** 5
- **All Passing:** ✅

## Writing Tests

### Example: Testing a Component

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent text="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("should handle user interaction", async () => {
    const user = userEvent.setup();
    const mockCallback = vi.fn();
    render(<MyComponent onClick={mockCallback} />);

    await user.click(screen.getByRole("button"));
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
```

### Example: Testing a Utility Function

```ts
import { describe, it, expect } from "vitest";
import { myUtility } from "./myUtility";

describe("myUtility", () => {
  it("should handle edge cases", () => {
    expect(myUtility([])).toEqual([]);
    expect(myUtility([1])).toEqual([1]);
  });
});
```

## Best Practices

1. **Arrange-Act-Assert Pattern:** Structure tests with clear setup, action, and verification steps
2. **Descriptive Test Names:** Use `should` or `it should` to describe expected behavior
3. **Isolated Tests:** Each test should be independent and not rely on others
4. **User-Centric:** Test components from the user's perspective using React Testing Library
5. **Mock External Dependencies:** Use `vi.fn()` to mock callbacks and external modules

## Configuration

### `vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
});
```

### `src/test/setup.ts`

```ts
import "@testing-library/jest-dom";
```

## Dependencies

- `vitest` - Test runner (Vite-native)
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM assertions
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - Browser environment simulation

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
