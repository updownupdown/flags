import React, { useState, useEffect } from "react";
import Flag from "react-world-flags";

export const QuestionHeader = (props) => {
  const contents = () => {
    switch (props.questionType) {
      case "name":
        return (
          <div className="flag">
            <Flag code={props.answer.code.iso2} />
          </div>
        );
      case "flag":
        return <span className="country-name">{props.answer.name}</span>;
      default:
        throw new Error();
    }
  };

  return (
    <div className="question">
      <span className="instructions">
        {props.questionType === "flag" && "Which flag belongs to:"}
        {props.questionType === "name" && "Which country has this flag:"}
      </span>
      {contents()}
    </div>
  );
};

function Question(props) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!props.isQuestion) return;
    var array = [props.answer];

    while (array.length < 6) {
      const randCountry = props.getRandCountry();

      if (!array.includes(randCountry)) {
        array.push(randCountry);
      }
    }

    setOptions(shuffleArray(array));
  }, [props.isQuestion]);

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
      if (!props.isQuestion) {
        props.nextQuestion();
      }
    }
  };

  function getButtonClass(option) {
    var buttonClass = "option";
    if (option === props.answer.name) {
      // Correct answer
      if (props.guess === props.answer.name) {
        // Guessed
        buttonClass += " correct-guessed";
      } else {
        // Got wrong
        buttonClass += " correct-not-guessed";
      }
    } else {
      // Incorrect answer
      if (option === props.guess) {
        // Guessed
        buttonClass += " incorrect-guess";
      } else {
        buttonClass += " other";
      }
    }

    return buttonClass;
  }

  return (
    <>
      <QuestionHeader answer={props.answer} questionType={props.questionType} />

      <div className={`button-group options-${props.questionType}`}>
        {options.map((option) => (
          <button
            disabled={!props.isQuestion}
            key={option.name}
            tabIndex={0}
            className={getButtonClass(option.name)}
            onClick={() => {
              props.makeGuess(option.name);
            }}
          >
            {props.questionType === "name" && option.name}
            {props.questionType === "flag" && (
              <div className="flag">
                <Flag code={option.code.iso2} />
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        disabled={props.isQuestion}
        tabIndex={0}
        className="next-question"
        onClick={() => {
          props.nextQuestion();
        }}
      >
        Next Question
      </button>
    </>
  );
}

export default Question;
