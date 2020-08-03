import React, { useState, useEffect } from "react";
import { useLocallyPersistedReducer } from "../../utils/LocalStorage";
import country from "country-list-js";
import Flag from "react-world-flags";
import QuestionHeader from "./QuestionHeader";
import Score from "./Score";

function Question(props) {
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

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!isQuestion) return;
    var array = [answer];

    while (array.length < 6) {
      const randCountry = getRandCountry();

      if (!array.includes(randCountry)) {
        array.push(randCountry);
      }
    }

    setOptions(shuffleArray(array));
  }, [isQuestion]);

  function shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  function checkFocus() {
    const activeElement = document.activeElement;
    const inputs = ["input", "select", "textarea"];

    if (
      activeElement &&
      inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1
    ) {
      return true;
    }
  }

  document.body.onkeydown = function (e) {
    // Bail if something important is focused
    if (checkFocus()) return;

    if (e.key === "Enter") {
      if (!isQuestion) {
        nextQuestion();
      }
    }
  };

  function getButtonClass(option) {
    var buttonClass = "option";
    if (option === answer.name) {
      if (guess === answer.name) {
        buttonClass += " correct-guessed";
      } else {
        buttonClass += " correct-not-guessed";
      }
    } else {
      if (option === guess) {
        buttonClass += " incorrect-guess";
      } else {
        buttonClass += " other";
      }
    }

    return buttonClass;
  }

  return (
    <>
      <Score
        answer={answer}
        score={score}
        setScore={setScore}
        guess={guess}
        isQuestion={isQuestion}
      />

      <QuestionHeader answer={answer} questionType={questionType} />

      <div className={`button-group options-${questionType}`}>
        {options.map((option) => (
          <button
            disabled={!isQuestion}
            key={option.name}
            tabIndex={0}
            className={getButtonClass(option.name)}
            onClick={() => {
              makeGuess(option.name);
            }}
          >
            {questionType === "name" && option.name}
            {questionType === "flag" && (
              <div className="flag">
                <Flag code={option.code.iso2} />
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        disabled={isQuestion}
        tabIndex={0}
        className="next-question"
        onClick={() => {
          nextQuestion();
        }}
      >
        Next Question
      </button>
    </>
  );
}

export default Question;
