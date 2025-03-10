import clsx from "clsx";
import { countryList } from "../data/countryList";
import { calculateAverage } from "../utils/utils";
import { Modal } from "./Modal";
import "./Score.scss";
import { Difficulties, DifficultyPops, ISettings } from "./Settings";

interface ScoreCountry {
  x: string;
  c: number;
  i: number;
  s: number;
}

export interface Score {
  correct: number;
  incorrect: number;
  countries: ScoreCountry[];
}

export function defaultScore() {
  const countries = countryList.map((country) => ({
    /** Country code */
    x: country.code,
    /** Correct guesses */
    c: 0,
    /** Incorrect guesses */
    i: 0,
    /** Confidence score */
    s: 0,
  }));

  return {
    correct: 0,
    incorrect: 0,
    countries,
  };
}

interface ConfidenceBarProps {
  confidence: number;
}

export const confidenceMag = 5;

export const ConfidenceBar = ({ confidence }: ConfidenceBarProps) => {
  const confidenceLeft = Math.max(
    10,
    ((confidence + confidenceMag) / (confidenceMag * 2)) * 100
  );

  return (
    <div className="confidence-bar">
      <div
        className="confidence-bar__indicator"
        style={{
          width: confidenceLeft + "%",
          background:
            confidenceLeft > 70
              ? "var(--correct)"
              : confidenceLeft < 30
              ? "var(--incorrect)"
              : "var(--orange)",
        }}
      />
    </div>
  );
};

interface Props {
  onClose: () => void;
  score: Score;
  settings: ISettings;
}

export const ScoreDetails = ({ onClose, score, settings }: Props) => {
  const populationThreshold =
    DifficultyPops[settings.difficulty as Difficulties];
  const showExcluded = false;

  function scoreDisplay(
    correct: number,
    incorrect: number,
    confidence?: number
  ) {
    return (
      <div className="score-details">
        <span>{Math.round(calculateAverage(correct, incorrect))}%</span>
        <span>{correct}</span>
        <span>{correct + incorrect}</span>
        {confidence !== undefined && <ConfidenceBar confidence={confidence} />}
      </div>
    );
  }

  return (
    <Modal
      title="Score Details"
      isOpen
      onClose={onClose}
      modalClass="score-modal"
    >
      <div className="score">
        <div className="score-table">
          <div className="score-table__row">
            <div className="score-table-cell score-table-cell--header score-table-cell--title">
              <span>Country</span>
            </div>
            <div className="score-table-cell score-table-cell--header score-table-cell--score">
              <span>Score</span>
            </div>
          </div>

          <hr />

          <div className="score-table__row">
            <div className="score-table-cell score-table-cell--title">
              <span>Total</span>
            </div>
            <div className="score-table-cell score-table-cell--score">
              {scoreDisplay(score.correct, score.incorrect)}
            </div>
          </div>

          <hr />

          {countryList
            .filter(
              (country) =>
                showExcluded || country.population >= populationThreshold
            )
            .map((country) => {
              if (!score.countries) return null;

              const countryScore = score.countries.find(
                (c) => c.x === country.code
              );

              if (!country || !countryScore) return null;

              return (
                <div key={country.code} className="score-table__row">
                  <div className="score-table-cell score-table-cell--title">
                    <span>{country.name}</span>
                  </div>
                  <div className="score-table-cell score-table-cell--score">
                    {scoreDisplay(
                      countryScore.c,
                      countryScore.i,
                      countryScore.s
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
};
