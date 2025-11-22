import { useState } from "react";
import "./App.css";
import type { Quiz } from "./models/Quiz";
import britishAmericaQuiz from "./data/british-america.json";
import MainMenu from "./components/MainMenu";
import QuizGame from "./components/QuizGame";

const availableQuizzes: Quiz[] = [britishAmericaQuiz as Quiz];

function App() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  if (selectedQuiz) {
    return (
      <QuizGame quiz={selectedQuiz} onExit={() => setSelectedQuiz(null)} />
    );
  }

  return <MainMenu quizzes={availableQuizzes} onQuizSelect={setSelectedQuiz} />;
}

export default App;
