import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeedbackMessage from "./FeedbackMessage";

describe("FeedbackMessage", () => {
  it("should render correct message when answer is correct", () => {
    render(<FeedbackMessage isCorrect={true} />);
    expect(screen.getByText(/Correct! Well done!/i)).toBeInTheDocument();
  });

  it("should render incorrect message when answer is wrong", () => {
    render(
      <FeedbackMessage isCorrect={false} correctAnswerText="Test Answer" />
    );
    expect(screen.getByText(/Incorrect/i)).toBeInTheDocument();
    expect(screen.getByText(/The correct answer is:/i)).toBeInTheDocument();
  });

  it("should apply correct styling class for correct answer", () => {
    const { container } = render(<FeedbackMessage isCorrect={true} />);
    const feedback = container.querySelector(".feedback-message");
    expect(feedback).toHaveClass("correct-feedback");
  });

  it("should apply incorrect styling class for wrong answer", () => {
    const { container } = render(
      <FeedbackMessage isCorrect={false} correctAnswerText="Test Answer" />
    );
    const feedback = container.querySelector(".feedback-message");
    expect(feedback).toHaveClass("incorrect-feedback");
  });

  it("should display the correct answer text when provided", () => {
    render(
      <FeedbackMessage isCorrect={false} correctAnswerText="The Right Answer" />
    );
    expect(screen.getByText("The Right Answer")).toBeInTheDocument();
  });
});
