interface FeedbackMessageProps {
  isCorrect: boolean;
  correctAnswerText?: string;
}

export default function FeedbackMessage({
  isCorrect,
  correctAnswerText,
}: FeedbackMessageProps) {
  return (
    <div
      className={`feedback-message ${
        isCorrect ? "correct-feedback" : "incorrect-feedback"
      }`}
    >
      {isCorrect ? (
        <p>✓ Correct! Well done!</p>
      ) : (
        <>
          <p>✗ Incorrect.</p>
          <p className="correct-answer-text">
            The correct answer is: <strong>{correctAnswerText}</strong>
          </p>
        </>
      )}
    </div>
  );
}
