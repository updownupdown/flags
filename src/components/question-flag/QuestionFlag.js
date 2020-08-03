import React, { useEffect } from "react";
import Flag from "react-world-flags";

function QuestionFlag(props) {
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

  const options = () => {
    var array = [props.answer];

    while (array.length < 6) {
      const randCountry = props.getRandCountry();

      if (!array.includes(randCountry)) {
        array.push(randCountry);
      }
    }

    return shuffleArray(array);
  };

  const shuffledOptions = options();

  return (
    <>
      <div className="question-flag">
        <div className="flag">
          <Flag code={props.answer.code.iso2} />
        </div>
      </div>

      <div className="button-group">
        {shuffledOptions.map((option) => (
          <button
            key={option.name}
            tabIndex={0}
            className="option"
            onClick={() => {
              console.log(option.name);
              props.makeGuess(option.name);
            }}
          >
            {option.name}
          </button>
        ))}
      </div>
    </>
  );
}

export default QuestionFlag;
