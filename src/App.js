import React, { useState } from "react";
import { useLocallyPersistedReducer } from "./utils/LocalStorage";
// import Autocomplete from "./components/autocomplete/Autocomplete";
// import Flag from "react-world-flags";
import country from "country-list-js";
import QuestionFlag from "./components/question-flag/QuestionFlag";
import AnswerFlag from "./components/answer-flag/AnswerFlag";

function App() {
  const defaultScore = {
    correct: 0,
    incorrect: 0,
    streakCurrent: 0,
    streakLongest: 0,
    lastCorrect: false,
  };

  const [score, setScore] = useLocallyPersistedReducer(
    scoreReducer,
    defaultScore,
    "score"
  );

  function scoreReducer(score, action) {
    switch (action.type) {
      case "reset":
        return defaultScore;
      case "correct":
        return {
          ...score,
          correct: score.correct + 1,
          lastCorrect: true,
          streakCurrent: score.streakCurrent + 1,
          streakLongest:
            score.streakCurrent >= score.streakLongest
              ? score.streakCurrent + 1
              : score.streakLongest,
        };
      case "incorrect":
        return {
          ...score,
          incorrect: score.incorrect + 1,
          lastCorrect: false,
          streakCurrent: 0,
        };
      default:
        throw new Error();
    }
  }

  function getScorePerc() {
    const perc =
      score.correct === 0 && score.correct === 0
        ? 0
        : Math.round((score.correct / (score.correct + score.incorrect)) * 100);
    return perc.toString();
  }

  // =================================== //
  const countriesList = country.ls("name").sort();
  const countriesLength = countriesList.length;

  function getRandCountry() {
    const randCountry = country.findByName(
      countriesList[Math.floor(Math.random() * (countriesLength - 1))]
    );

    return randCountry;
  }

  const [guess, setGuess] = useState("");
  const [answer, setAnswer] = useState(getRandCountry);
  const [isQuestion, setIsQuestion] = useState(true);

  function makeGuess(guess) {
    setGuess(guess);
    setIsQuestion(false);
  }

  function nextQuestion() {
    setAnswer(getRandCountry);
    setIsQuestion(true);
  }

  return (
    <div className="layout">
      <div className="layout-center">
        <div className="layout-top">
          <div className="header">
            <span className="logo">World Flags Quiz</span>
            <a
              className="about"
              href="https://github.com/updownupdown/flags"
              target="_blank"
              rel="noopener noreferrer"
            >
              About
            </a>
          </div>
          <div className="score">
            <div className="score-top">
              <span className="score-perc">Score: {getScorePerc()}%</span>
              <div className="score-tally">
                <span className="score-tally-correct">
                  Correct: {score.correct}
                </span>
                <span className="score-tally-incorrect">
                  Incorrect: {score.incorrect}
                </span>
              </div>
            </div>
            <div className="score-bottom">
              <span className="score-streak-current">
                Current streak: {score.streakCurrent}
              </span>
              <span className="score-streak-longest">
                Longest streak: {score.streakLongest}
              </span>
              <button
                className="score-reset"
                onClick={() => {
                  setScore({ type: "reset" });
                }}
              >
                Reset score
              </button>
            </div>
          </div>
        </div>
        <div className="layout-bottom">
          {isQuestion ? (
            <QuestionFlag
              countriesList={countriesList}
              answer={answer}
              makeGuess={makeGuess}
            />
          ) : (
            <AnswerFlag
              guess={guess}
              answer={answer}
              setScore={setScore}
              nextQuestion={nextQuestion}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
