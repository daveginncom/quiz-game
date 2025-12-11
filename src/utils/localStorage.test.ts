import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveQuizProgress,
  loadQuizProgress,
  clearQuizProgress,
  saveQuizScore,
  loadQuizHistory,
  getQuizHistory,
  clearQuizHistory,
} from "./localStorage";
import type { QuizProgress, QuizScore } from "./localStorage";

describe("localStorage utilities", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe("Quiz Progress", () => {
    const mockProgress: QuizProgress = {
      quizId: "quiz-1",
      quizTitle: "Test Quiz",
      currentQuestionIndex: 2,
      correctCount: 1,
      answeredCount: 2,
      selectedAnswer: 0,
      showResult: true,
      isCorrectAnswer: true,
      wrongAnswers: [
        {
          question: "What is 2+2?",
          userAnswer: "5",
          correctAnswer: "4",
        },
      ],
      randomizedQuestions: [],
      timestamp: Date.now(),
    };

    it("should save quiz progress to localStorage", () => {
      saveQuizProgress(mockProgress);
      const saved = localStorage.getItem("quiz_progress");
      expect(saved).not.toBeNull();
      expect(JSON.parse(saved!)).toEqual(mockProgress);
    });

    it("should load quiz progress from localStorage", () => {
      localStorage.setItem("quiz_progress", JSON.stringify(mockProgress));
      const loaded = loadQuizProgress();
      expect(loaded).toEqual(mockProgress);
    });

    it("should return null when no progress is saved", () => {
      const loaded = loadQuizProgress();
      expect(loaded).toBeNull();
    });

    it("should clear quiz progress from localStorage", () => {
      localStorage.setItem("quiz_progress", JSON.stringify(mockProgress));
      clearQuizProgress();
      const saved = localStorage.getItem("quiz_progress");
      expect(saved).toBeNull();
    });

    it("should handle corrupted progress data gracefully", () => {
      localStorage.setItem("quiz_progress", "invalid json");
      const loaded = loadQuizProgress();
      expect(loaded).toBeNull();
    });

    it("should handle localStorage errors when saving", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage full");
        });

      // Should not throw
      expect(() => saveQuizProgress(mockProgress)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe("Quiz Score History", () => {
    const mockScore1: QuizScore = {
      quizId: "quiz-1",
      quizTitle: "Test Quiz 1",
      score: 8,
      totalQuestions: 10,
      percentage: 80,
      grade: "B",
      completedAt: Date.now() - 1000,
    };

    const mockScore2: QuizScore = {
      quizId: "quiz-2",
      quizTitle: "Test Quiz 2",
      score: 10,
      totalQuestions: 10,
      percentage: 100,
      grade: "A",
      completedAt: Date.now(),
    };

    it("should save quiz score to history", () => {
      saveQuizScore(mockScore1);
      const history = loadQuizHistory();
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(mockScore1);
    });

    it("should append new scores to existing history", () => {
      saveQuizScore(mockScore1);
      saveQuizScore(mockScore2);
      const history = loadQuizHistory();
      expect(history).toHaveLength(2);
      expect(history).toContainEqual(mockScore1);
      expect(history).toContainEqual(mockScore2);
    });

    it("should load empty array when no history exists", () => {
      const history = loadQuizHistory();
      expect(history).toEqual([]);
    });

    it("should get history for specific quiz", () => {
      saveQuizScore(mockScore1);
      saveQuizScore(mockScore2);
      saveQuizScore({ ...mockScore1, completedAt: Date.now() });

      const quiz1History = getQuizHistory("quiz-1");
      expect(quiz1History).toHaveLength(2);
      expect(quiz1History.every((score) => score.quizId === "quiz-1")).toBe(
        true
      );

      const quiz2History = getQuizHistory("quiz-2");
      expect(quiz2History).toHaveLength(1);
      expect(quiz2History[0].quizId).toBe("quiz-2");
    });

    it("should return empty array for quiz with no history", () => {
      saveQuizScore(mockScore1);
      const history = getQuizHistory("nonexistent-quiz");
      expect(history).toEqual([]);
    });

    it("should clear all quiz history", () => {
      saveQuizScore(mockScore1);
      saveQuizScore(mockScore2);
      clearQuizHistory();
      const history = loadQuizHistory();
      expect(history).toEqual([]);
    });

    it("should handle corrupted history data gracefully", () => {
      localStorage.setItem("quiz_history", "invalid json");
      const history = loadQuizHistory();
      expect(history).toEqual([]);
    });

    it("should handle non-array history data", () => {
      localStorage.setItem("quiz_history", JSON.stringify({ not: "array" }));
      const history = loadQuizHistory();
      expect(history).toEqual([]);
    });

    it("should handle localStorage errors when saving score", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage full");
        });

      // Should not throw
      expect(() => saveQuizScore(mockScore1)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      setItemSpy.mockRestore();
    });

    it("should maintain order of scores as they are added", () => {
      const oldScore = { ...mockScore1, completedAt: Date.now() - 10000 };
      const recentScore = { ...mockScore1, completedAt: Date.now() };

      saveQuizScore(oldScore);
      saveQuizScore(recentScore);

      const history = getQuizHistory("quiz-1");
      expect(history).toHaveLength(2);
      expect(history[0]).toEqual(oldScore);
      expect(history[1]).toEqual(recentScore);
    });
  });

  describe("Edge Cases", () => {
    beforeEach(() => {
      // Ensure all mocks are fully restored before edge case tests
      vi.restoreAllMocks();
      localStorage.clear();
    });

    it("should handle multiple saves and loads", () => {
      const progress1: QuizProgress = {
        quizId: "quiz-1",
        quizTitle: "Quiz 1",
        currentQuestionIndex: 0,
        correctCount: 0,
        answeredCount: 0,
        selectedAnswer: null,
        showResult: false,
        isCorrectAnswer: false,
        wrongAnswers: [],
        randomizedQuestions: [],
        timestamp: Date.now(),
      };

      const progress2: QuizProgress = {
        ...progress1,
        quizId: "quiz-2",
        currentQuestionIndex: 5,
      };

      saveQuizProgress(progress1);
      const loaded1 = loadQuizProgress();
      expect(loaded1?.quizId).toBe("quiz-1");

      saveQuizProgress(progress2);
      const loaded2 = loadQuizProgress();
      expect(loaded2?.quizId).toBe("quiz-2");
      expect(loaded2?.currentQuestionIndex).toBe(5);
    });

    it("should handle null and undefined values gracefully", () => {
      const progress: QuizProgress = {
        quizId: "quiz-1",
        quizTitle: "Test",
        currentQuestionIndex: 0,
        correctCount: 0,
        answeredCount: 0,
        selectedAnswer: null,
        showResult: false,
        isCorrectAnswer: false,
        wrongAnswers: [],
        randomizedQuestions: [],
        timestamp: Date.now(),
      };

      saveQuizProgress(progress);
      const loaded = loadQuizProgress();
      expect(loaded?.selectedAnswer).toBeNull();
    });
  });
});
