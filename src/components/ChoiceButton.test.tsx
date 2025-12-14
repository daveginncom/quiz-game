import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChoiceButton from "./ChoiceButton";

describe("ChoiceButton", () => {
  const mockChoice = {
    id: 1,
    text: "Test Choice",
  };

  it("should render choice text", () => {
    const mockOnSelect = vi.fn();
    render(
      <ChoiceButton
        choice={mockChoice}
        index={0}
        onSelect={mockOnSelect}
        isSelected={false}
        showResult={false}
        isCorrect={false}
      />
    );

    expect(screen.getByText("Test Choice")).toBeInTheDocument();
  });

  it("should call onSelect when clicked", async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();
    render(
      <ChoiceButton
        choice={mockChoice}
        index={0}
        onSelect={mockOnSelect}
        isSelected={false}
        showResult={false}
        isCorrect={false}
      />
    );

    await user.click(screen.getByText("Test Choice"));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it("should not call onSelect when result is shown", async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();
    render(
      <ChoiceButton
        choice={mockChoice}
        index={0}
        onSelect={mockOnSelect}
        isSelected={false}
        showResult={true}
        isCorrect={false}
      />
    );

    await user.click(screen.getByText("Test Choice"));
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it("should apply correct styling when selected", () => {
    const mockOnSelect = vi.fn();
    const { container } = render(
      <ChoiceButton
        choice={mockChoice}
        index={0}
        onSelect={mockOnSelect}
        isSelected={true}
        showResult={false}
        isCorrect={false}
      />
    );

    const button = container.querySelector(".choice-button");
    expect(button).toHaveClass("selected");
  });

  it("should show correct feedback styling", () => {
    const mockOnSelect = vi.fn();
    const { container } = render(
      <ChoiceButton
        choice={mockChoice}
        index={0}
        onSelect={mockOnSelect}
        isSelected={true}
        showResult={true}
        isCorrect={true}
      />
    );

    const button = container.querySelector(".choice-button");
    expect(button).toHaveClass("correct");
  });

  it("should show incorrect feedback styling", () => {
    const incorrectChoice = { id: 2, text: "Wrong Choice" };
    const mockOnSelect = vi.fn();
    const { container } = render(
      <ChoiceButton
        choice={incorrectChoice}
        index={0}
        onSelect={mockOnSelect}
        isSelected={true}
        showResult={true}
        isCorrect={false}
      />
    );

    const button = container.querySelector(".choice-button");
    expect(button).toHaveClass("incorrect");
  });
});
