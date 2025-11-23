import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import QuizStats from "./QuizStats";

describe("QuizStats", () => {
  it("should display current question number and total", () => {
    render(
      <QuizStats
        currentQuestion={1}
        totalQuestions={10}
        correctCount={0}
        answeredCount={0}
      />
    );

    expect(screen.getByText("Question 1 of 10")).toBeInTheDocument();
  });

  it("should display score", () => {
    render(
      <QuizStats
        currentQuestion={6}
        totalQuestions={10}
        correctCount={4}
        answeredCount={5}
      />
    );

    expect(screen.getByText("Score: 4/5")).toBeInTheDocument();
  });

  it("should update when props change", () => {
    const { rerender } = render(
      <QuizStats
        currentQuestion={1}
        totalQuestions={10}
        correctCount={0}
        answeredCount={0}
      />
    );

    expect(screen.getByText("Question 1 of 10")).toBeInTheDocument();
    expect(screen.getByText("Score: 0/0")).toBeInTheDocument();

    rerender(
      <QuizStats
        currentQuestion={6}
        totalQuestions={10}
        correctCount={3}
        answeredCount={5}
      />
    );

    expect(screen.getByText("Question 6 of 10")).toBeInTheDocument();
    expect(screen.getByText("Score: 3/5")).toBeInTheDocument();
  });

  it("should handle last question", () => {
    render(
      <QuizStats
        currentQuestion={10}
        totalQuestions={10}
        correctCount={8}
        answeredCount={9}
      />
    );

    expect(screen.getByText("Question 10 of 10")).toBeInTheDocument();
  });
});
