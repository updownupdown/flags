import React, { useEffect, useState } from "react";
import country from "country-list-js";
import Flag from "react-world-flags";

function AnswerFlag(props) {
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    if (props.guess === props.answer.name) {
      setCorrect(true);
      props.setScore({ type: "correct" });
    } else {
      setCorrect(false);
      props.setScore({ type: "incorrect" });
    }
  }, []);

  console.log(props.answer);

  function guessedFlag() {
    const guessedCountry = country.findByName(props.guess);
    console.log("code = " + guessedCountry.code.iso2);
    return (
      <div className="flag flag-guess">
        <Flag code={guessedCountry.code.iso2} />
      </div>
    );
  }

  function selectMessage() {
    const messagesWrong = [
      "Incorrect.",
      "Sorry, wrong answer.",
      "That’s not it.",
      "No cigar.",
      "Bummer man.",
      "Nah, sorry.",
      "Nope.",
      "Not quite.",
      "What? No.",
    ];

    const messagesRight = [
      "Correct!",
      "Yep!",
      "That’s it!",
      "Good one!",
      "That’s right!",
      "On the money!",
      "Indeed!",
      "Yeppers!",
      "Awesome!",
    ];

    const messages = correct ? messagesRight : messagesWrong;
    const message = messages[Math.floor(Math.random() * (messages.length - 1))];

    return message;
  }

  return (
    <>
      <div className={`result ${correct ? "correct" : "incorrect"}`}>
        <span>{selectMessage()}</span>
      </div>

      {!correct && (
        <div className="wrong-guess">
          {props.guess === "" ? (
            <span className="wrong-guess-text">You passed!</span>
          ) : (
            <>
              <span className="wrong-guess-text">
                You guessed: {props.guess}
              </span>
              {guessedFlag()}
            </>
          )}
        </div>
      )}

      <hr />

      <h1>Info</h1>

      <ul className="info">
        {props.answer.name && <li>Name: {props.answer.name}</li>}
        {props.answer.capital && <li>Capital: {props.answer.capital}</li>}
      </ul>

      <div className="flag flag-info">
        <Flag code={props.answer.code.iso2} />
      </div>

      <div className="button-group">
        <button
          onClick={() => {
            props.nextQuestion();
          }}
        >
          Next Question
        </button>
      </div>
    </>
  );
}

export default AnswerFlag;
