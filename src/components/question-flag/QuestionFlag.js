import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "../autocomplete/Autocomplete";
import Flag from "react-world-flags";

function QuestionFlag(props) {
  const [validGuess, setValidGuess] = useState(false);
  const [guess, setGuess] = useState("");

  useEffect(() => {
    checkValidGuess();
  }, [guess]);

  useEffect(() => {
    checkValidGuess();
  }, [guess]);

  function checkValidGuess() {
    if (props.countriesList.includes(guess)) {
      setValidGuess(true);
    } else {
      setValidGuess(false);
    }
  }

  function activateGuess() {
    props.makeGuess(guess);
  }

  const answerButton = useRef(null);

  function readyToAnswer() {
    answerButton.current.focus();
    console.log(answerButton.current);
    console.log("focused on button");
  }

  return (
    <>
      <div className="question-flag">
        <div className="flag">
          <Flag code={props.answer.code.iso2} />
        </div>
        {/* <p>{props.answer.name}</p> */}
      </div>

      <Autocomplete
        options={props.countriesList}
        setGuess={setGuess}
        checkValidGuess={checkValidGuess}
        activateGuess={activateGuess}
      />

      <div className="button-group">
        <button
          tabIndex={0}
          className="answer"
          onClick={() => {
            activateGuess();
          }}
          disabled={!validGuess}
        >
          Answer {guess}
        </button>
        <button
          tabIndex={0}
          className="pass"
          onClick={() => {
            props.makeGuess("");
          }}
        >
          Pass
        </button>
      </div>
    </>
  );
}

export default QuestionFlag;
