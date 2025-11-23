# Quiz Game

An interactive quiz application built with React, TypeScript, and Vite. Test your knowledge with randomized questions and colorful, engaging UI.

![Quiz Game](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?logo=vite) ![Tests](https://img.shields.io/badge/Tests-Passing-success?logo=vitest)

## Features

- 🎯 **Interactive Quizzes** - Multiple choice questions with instant feedback
- 🎨 **Colorful UI** - Vibrant button colors (blue, red, orange, purple)
- 🎊 **Confetti Celebration** - Visual feedback on correct answers
- 🔊 **Sound Effects** - Audio cues for correct/incorrect answers
- 📊 **Progress Tracking** - Real-time score and question counter
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🌙 **Dark Mode Support** - Automatic theme based on system preferences
- 🔀 **Randomization** - Questions and choices shuffled for variety
- 📈 **Grade Summary** - Letter grade (A-F) on 10-point scale
- ❌ **Wrong Answer Review** - See what you missed after completion
- ✅ **Pre-commit Testing** - Automated linting before commits
- 🚀 **CI/CD Pipeline** - Automated testing and deployment

## Demo

Currently includes a **British America** quiz with 31 questions covering colonial history.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/daveginncom/quiz-game.git
cd quiz-game

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Available Scripts

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot reload |
| `npm run build`         | Build for production                     |
| `npm run preview`       | Preview production build locally         |
| `npm run lint`          | Run ESLint on all files                  |
| `npm test`              | Run tests in watch mode                  |
| `npm test -- --run`     | Run tests once (CI mode)                 |
| `npm run test:ui`       | Run tests with UI interface              |
| `npm run test:coverage` | Generate test coverage report            |

## Project Structure

```
src/
├── components/          # React components
│   ├── ChoiceButton.tsx        # Individual answer button
│   ├── FeedbackMessage.tsx     # Correct/incorrect message
│   ├── MainMenu.tsx            # Quiz selection screen
│   ├── QuestionDisplay.tsx     # Question and choices
│   ├── QuizGame.tsx            # Main quiz logic
│   ├── QuizHeader.tsx          # Header with exit button
│   ├── QuizStats.tsx           # Progress/score display
│   └── QuizSummary.tsx         # Results screen
├── data/                # Quiz data (JSON)
│   └── british-america.json
├── models/              # TypeScript interfaces
│   └── Quiz.ts
├── utils/               # Utility functions
│   ├── quizUtils.ts            # Shuffle, grading
│   └── soundEffects.ts         # Web Audio API
├── test/                # Test setup
│   └── setup.ts
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## Testing

This project uses **Vitest** and **React Testing Library** for comprehensive testing.

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

- ✅ 33 passing tests across 5 test files
- ✅ Components: ChoiceButton, FeedbackMessage, MainMenu, QuizStats
- ✅ Utilities: shuffleArray, getLetterGrade, choiceColors

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Adding New Quizzes

1. Create a JSON file in `src/data/`:

```json
{
  "title": "Your Quiz Title",
  "questions": [
    {
      "question": "Your question text?",
      "choices": [
        { "text": "Choice 1", "isCorrect": false },
        { "text": "Choice 2", "isCorrect": true },
        { "text": "Choice 3", "isCorrect": false },
        { "text": "Choice 4", "isCorrect": false }
      ]
    }
  ]
}
```

2. Import and add to the quiz list in `MainMenu.tsx`

## CI/CD

- **GitHub Actions** automatically runs tests on pull requests
- **Linting** enforced via pre-commit hooks with Husky
- **Deployment** to GitHub Pages on push to main (after tests pass)

## Technologies

- **React 19.2** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool & dev server
- **Vitest 4.0** - Testing framework
- **React Testing Library** - Component testing
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **react-confetti** - Celebration effects
- **Web Audio API** - Sound effects

## Browser Support

- Modern browsers with ES6+ support
- Safari (with webkit AudioContext fallback)
- Chrome, Firefox, Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (pre-commit hooks will run automatically)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request (tests will run automatically)

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Quiz content: British America historical facts
- Sound effects: Web Audio API
- Design inspiration: Modern quiz applications
