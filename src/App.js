import React, { useState } from "react";
import { useLocallyPersistedReducer } from "./utils/LocalStorage";
import country from "country-list-js";
import Question from "./components/question/Question";

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
      score.correct === 0 && score.incorrect === 0
        ? 50
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

  const [questionType, setQuestionType] = useState("flag");
  const [guess, setGuess] = useState("");
  const [answer, setAnswer] = useState(getRandCountry);
  const [isQuestion, setIsQuestion] = useState(true);

  function makeGuess(userGuess) {
    setGuess(userGuess);
    setIsQuestion(false);

    if (userGuess === answer.name) {
      setScore({ type: "correct" });
    } else {
      setScore({ type: "incorrect" });
    }
  }

  function getNextType(previousType) {
    var nextType = "flag";

    if (previousType === "flag") {
      nextType = "name";
    }

    return nextType;
  }

  function nextQuestion() {
    setAnswer(getRandCountry);
    setQuestionType(getNextType(questionType));
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
              <span className="score-bar">
                <span
                  className={`score-bar-result correct ${
                    !isQuestion &&
                    guess !== "" &&
                    guess === answer.name &&
                    "highlight"
                  }`}
                  style={{ width: `${getScorePerc()}%` }}
                >
                  <span className="score-bar-result-count">
                    {score.correct}
                  </span>
                </span>
                <span
                  className={`score-bar-result incorrect ${
                    !isQuestion &&
                    guess !== "" &&
                    guess !== answer.name &&
                    "highlight"
                  }`}
                  style={{ width: `${100 - getScorePerc()}%` }}
                >
                  <span className="score-bar-result-count">
                    {score.incorrect}
                  </span>
                </span>
              </span>
            </div>
            <div className="score-bottom">
              <span className="score-tally">
                Correct: {score.correct} / {score.correct + score.incorrect}
              </span>
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
          <Question
            questionType={questionType}
            getRandCountry={getRandCountry}
            countriesList={countriesList}
            answer={answer}
            guess={guess}
            makeGuess={makeGuess}
            isQuestion={isQuestion}
            nextQuestion={nextQuestion}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
