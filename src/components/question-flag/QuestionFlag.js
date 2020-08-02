import React, { useState, useEffect } from "react";
import Autocomplete from "../autocomplete/Autocomplete";
import Flag from "react-world-flags";

function QuestionFlag(props) {
  const [validGuess, setValidGuess] = useState(false);
  const [guess, setGuess] = useState("");

  useEffect(() => {
    checkValidGuess();
  }, [guess]);

  function checkValidGuess() {
    console.log("checked valid guess: " + guess);
    if (props.countriesList.includes(guess)) {
      setValidGuess(true);
    } else {
      setValidGuess(false);
    }
  }

  return (
    <>
      <h1>Guess the flag!</h1>

      <h3>Guess = {guess}</h3>
      <h3>Valid Guess? = {validGuess ? "yes" : "no"}</h3>

      <div className="question-flag">
        <div className="flag">
          <Flag code={props.answer.code.iso2} />
        </div>
        <p>{props.answer.name}</p>
      </div>

      <Autocomplete
        options={props.countriesList}
        setGuess={setGuess}
        checkValidGuess={checkValidGuess}
      />

      <div className="button-group">
        <button
          onClick={() => {
            props.makeGuess(guess);
          }}
          disabled={!validGuess}
        >
          Answer {guess}
        </button>
        <button
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
