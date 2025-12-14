import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainMenu from "./MainMenu";
import * as quizApi from "../services/quizApi";

vi.mock("../services/quizApi");

describe("MainMenu", () => {
  const mockQuizList = [
    { id: 1, title: "British America" },
    { id: 2, title: "World History" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the main menu title", async () => {
    vi.mocked(quizApi.fetchQuizList).mockResolvedValue(mockQuizList);
    const mockOnQuizSelect = vi.fn();
    render(<MainMenu onQuizSelect={mockOnQuizSelect} />);

    expect(screen.getByText("Quiz Game")).toBeInTheDocument();
  });

  it("should display loading state initially", () => {
    vi.mocked(quizApi.fetchQuizList).mockImplementation(
      () => new Promise(() => {})
    );
    const mockOnQuizSelect = vi.fn();
    render(<MainMenu onQuizSelect={mockOnQuizSelect} />);

    expect(screen.getByText("Loading quizzes...")).toBeInTheDocument();
  });

  it("should render available quizzes after loading", async () => {
    vi.mocked(quizApi.fetchQuizList).mockResolvedValue(mockQuizList);
    const mockOnQuizSelect = vi.fn();
    render(<MainMenu onQuizSelect={mockOnQuizSelect} />);

    await waitFor(() => {
      expect(screen.getByText("British America")).toBeInTheDocument();
      expect(screen.getByText("World History")).toBeInTheDocument();
    });
  });

  it("should call onQuizSelect with quiz id when a quiz is clicked", async () => {
    vi.mocked(quizApi.fetchQuizList).mockResolvedValue(mockQuizList);
    const user = userEvent.setup();
    const mockOnQuizSelect = vi.fn();
    render(<MainMenu onQuizSelect={mockOnQuizSelect} />);

    await waitFor(() => {
      expect(screen.getByText("British America")).toBeInTheDocument();
    });

    const quizButton = screen.getByText("British America");
    await user.click(quizButton);

    expect(mockOnQuizSelect).toHaveBeenCalledTimes(1);
    expect(mockOnQuizSelect).toHaveBeenCalledWith(1);
  });

  it("should display error message when fetch fails", async () => {
    vi.mocked(quizApi.fetchQuizList).mockRejectedValue(
      new Error("Network error")
    );
    const mockOnQuizSelect = vi.fn();
    render(<MainMenu onQuizSelect={mockOnQuizSelect} />);

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });
});
