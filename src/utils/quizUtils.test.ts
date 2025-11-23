import { describe, it, expect, vi } from "vitest";
import { shuffleArray, getLetterGrade, choiceColors } from "./quizUtils";

describe("quizUtils", () => {
  describe("shuffleArray", () => {
    it("should return an array of the same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);
      expect(result).toHaveLength(input.length);
    });

    it("should contain all original elements", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);
      expect(result.sort()).toEqual(input.sort());
    });

    it("should not modify the original array", () => {
      const input = [1, 2, 3, 4, 5];
      const original = [...input];
      shuffleArray(input);
      expect(input).toEqual(original);
    });

    it("should handle empty arrays", () => {
      const result = shuffleArray([]);
      expect(result).toEqual([]);
    });

    it("should handle single element arrays", () => {
      const result = shuffleArray([1]);
      expect(result).toEqual([1]);
    });

    it("should shuffle with controlled randomness", () => {
      // Mock Math.random to control shuffle behavior
      const mockRandom = vi.spyOn(Math, "random");
      mockRandom.mockReturnValue(0.5);

      const input = [1, 2, 3];
      const result = shuffleArray(input);

      expect(result).toHaveLength(3);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).toContain(3);

      mockRandom.mockRestore();
    });
  });

  describe("getLetterGrade", () => {
    it("should return A for 90% or above", () => {
      expect(getLetterGrade(90)).toBe("A");
      expect(getLetterGrade(95)).toBe("A");
      expect(getLetterGrade(100)).toBe("A");
    });

    it("should return B for 80-89%", () => {
      expect(getLetterGrade(80)).toBe("B");
      expect(getLetterGrade(85)).toBe("B");
      expect(getLetterGrade(89)).toBe("B");
    });

    it("should return C for 70-79%", () => {
      expect(getLetterGrade(70)).toBe("C");
      expect(getLetterGrade(75)).toBe("C");
      expect(getLetterGrade(79)).toBe("C");
    });

    it("should return D for 60-69%", () => {
      expect(getLetterGrade(60)).toBe("D");
      expect(getLetterGrade(65)).toBe("D");
      expect(getLetterGrade(69)).toBe("D");
    });

    it("should return F for below 60%", () => {
      expect(getLetterGrade(59)).toBe("F");
      expect(getLetterGrade(50)).toBe("F");
      expect(getLetterGrade(0)).toBe("F");
    });

    it("should handle edge cases", () => {
      expect(getLetterGrade(89.9)).toBe("B");
      expect(getLetterGrade(90.1)).toBe("A");
    });
  });

  describe("choiceColors", () => {
    it("should have exactly 4 colors", () => {
      expect(choiceColors).toHaveLength(4);
    });

    it("should contain the correct colors in order", () => {
      expect(choiceColors[0]).toBe("#3498db"); // Blue
      expect(choiceColors[1]).toBe("#e74c3c"); // Red
      expect(choiceColors[2]).toBe("#f39c12"); // Orange
      expect(choiceColors[3]).toBe("#9b59b6"); // Purple
    });
  });
});
