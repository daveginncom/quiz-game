import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainMenu from "./MainMenu";

describe("MainMenu", () => {
  const mockQuizzes = [
    {
      title: "British America",
      questions: Array(31).fill({
        question: "Test question",
        choices: [
          { text: "Choice 1", isCorrect: true },
          { text: "Choice 2", isCorrect: false },
        ],
      }),
    },
  ];

  it("should render the main menu title", () => {
    const mockOnQuizSelect = vi.fn();
    render(<MainMenu quizzes={mockQuizzes} onQuizSelect={mockOnQuizSelect} />);

    expect(screen.getByText("Quiz Game")).toBeInTheDocument();
  });

  it("should render available quizzes", () => {
    const mockOnQuizSelect = vi.fn();
    render(<MainMenu quizzes={mockQuizzes} onQuizSelect={mockOnQuizSelect} />);

    expect(screen.getByText("British America")).toBeInTheDocument();
  });

  it("should call onQuizSelect when a quiz is clicked", async () => {
    const user = userEvent.setup();
    const mockOnQuizSelect = vi.fn();
    render(<MainMenu quizzes={mockQuizzes} onQuizSelect={mockOnQuizSelect} />);

    const quizButton = screen.getByText("British America");
    await user.click(quizButton);

    expect(mockOnQuizSelect).toHaveBeenCalledTimes(1);
    expect(mockOnQuizSelect).toHaveBeenCalledWith(mockQuizzes[0]);
  });

  it("should render multiple quizzes", () => {
    const multipleQuizzes = [
      ...mockQuizzes,
      { title: "World History", questions: [] },
    ];
    const mockOnQuizSelect = vi.fn();
    render(
      <MainMenu quizzes={multipleQuizzes} onQuizSelect={mockOnQuizSelect} />
    );

    expect(screen.getByText("British America")).toBeInTheDocument();
    expect(screen.getByText("World History")).toBeInTheDocument();
  });
});
