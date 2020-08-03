import React from "react";
import Flag from "react-world-flags";

const QuestionHeader = (props) => {
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

export default QuestionHeader;
