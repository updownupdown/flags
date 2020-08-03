import React from "react";
import "./score.scss";

const Score = (props) => {
  function getScorePerc() {
    const perc =
      props.score.correct === 0 && props.score.incorrect === 0
        ? 50
        : Math.round(
            (props.score.correct /
              (props.score.correct + props.score.incorrect)) *
              100
          );
    return perc.toString();
  }

  return (
    <div className="score">
      <div className="score-top">
        <span className="score-perc">Score: {getScorePerc()}%</span>
        <span className="score-bar">
          <span
            className={`score-bar-result correct ${
              !props.isQuestion &&
              props.guess !== "" &&
              props.guess === props.answer.name &&
              "highlight"
            }`}
            style={{ width: `${getScorePerc()}%` }}
          >
            <span className="score-bar-result-count">
              {props.score.correct}
            </span>
          </span>
          <span
            className={`score-bar-result incorrect ${
              !props.isQuestion &&
              props.guess !== "" &&
              props.guess !== props.answer.name &&
              "highlight"
            }`}
            style={{ width: `${100 - getScorePerc()}%` }}
          >
            <span className="score-bar-result-count">
              {props.score.incorrect}
            </span>
          </span>
        </span>
      </div>
      <div className="score-bottom">
        <span className="score-tally">
          Correct
          <br />
          {props.score.correct} / {props.score.correct + props.score.incorrect}
        </span>
        <span className="score-streak-current">
          Current streak
          <br />
          {props.score.streakCurrent}
        </span>
        <span className="score-streak-longest">
          Longest streak
          <br />
          {props.score.streakLongest}
        </span>
        <button
          className="score-reset"
          onClick={() => {
            props.setScore({ type: "reset" });
          }}
        >
          Reset score
        </button>
      </div>
    </div>
  );
};

export default Score;
