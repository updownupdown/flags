import clsx from "clsx";
import { countryList } from "../data/countryList";
import { calculateAverage } from "../utils/utils";
import { Modal } from "./Modal";
import "./Score.scss";
import { Difficulties, DifficultyPops, ISettings } from "./Settings";
import Flag from "react-world-flags";
import { useState } from "react";

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
  const percentage = Math.max(
    10,
    ((confidence + confidenceMag) / (confidenceMag * 2)) * 100
  );

  let background = "var(--K700)";

  if (percentage < 40) {
    background = "var(--incorrect)";
  } else if (percentage < 50) {
    background = "var(--orange)";
  } else if (percentage > 70) {
    background = "var(--correct)";
  }

  return (
    <div className="confidence-bar">
      <div
        className="confidence-bar__indicator"
        style={{
          width: percentage + "%",
          background,
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

  function scoreDisplay(
    correct: number,
    incorrect: number,
    confidence?: number
  ) {
    return (
      <div className="score-details">
        <span className={clsx(correct === 0 && "score-details-pale")}>
          {correct}
        </span>
        <span className={clsx(incorrect === 0 && "score-details-pale")}>
          {incorrect}
        </span>
        <span
          className={clsx(correct + incorrect === 0 && "score-details-pale")}
        >
          {Math.round(calculateAverage(correct, incorrect))}%
        </span>
        {confidence === undefined ? (
          <div className="confidence-placeholder" />
        ) : (
          <ConfidenceBar confidence={confidence} />
        )}
      </div>
    );
  }

  const scoredList = () => {
    const list: {
      name: string;
      code: string;
      correct: number;
      incorrect: number;
      average: number;
      confidence: number;
    }[] = [];

    countryList.forEach((country) => {
      if (country.population < populationThreshold) return;

      const countryScore = score.countries.find((c) => c.x === country.code);

      if (!countryScore) return;

      list.push({
        name: country.name,
        code: country.code,
        correct: countryScore.c,
        incorrect: countryScore.i,
        average: Math.round(calculateAverage(countryScore.c, countryScore.i)),
        confidence: countryScore.s,
      });
    });

    list
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
      .sort((a, b) => {
        if (a.confidence < b.confidence) {
          return -1;
        }
        if (a.confidence > b.confidence) {
          return 1;
        }
        return 0;
      });

    return list;
  };

  const [selected, setSelected] = useState<string | undefined>(undefined);

  return (
    <Modal
      title="Score Details"
      isOpen
      onClose={onClose}
      modalClass="score-modal"
    >
      <div className="modal-message">Click on a country to show its flag.</div>

      <div className="score">
        <div className="score-table">
          <div className="score-table__row score-table__row--total">
            <div className="score-table-cell score-table-cell--title">
              <span>Total</span>
            </div>
            <div className="score-table-cell score-table-cell--score">
              {scoreDisplay(score.correct, score.incorrect)}
            </div>
          </div>

          <hr />

          {scoredList().map((country) => {
            const isSelected = country.code === selected;

            return (
              <div
                key={country.name}
                className={clsx(
                  "score-table__row",
                  isSelected && "score-table__row--selected"
                )}
                onClick={() => setSelected(country.code)}
              >
                {isSelected && (
                  <div className="score-table-info">
                    <Flag code={country.code} />
                  </div>
                )}

                <div className="score-table-cell score-table-cell--title">
                  <span>{country.name}</span>
                </div>
                <div className="score-table-cell score-table-cell--score">
                  {scoreDisplay(
                    country.correct,
                    country.incorrect,
                    country.confidence
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
