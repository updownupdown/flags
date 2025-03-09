import { useEffect, useState } from "react";
import {
  CountryData,
  countryList,
  getCountryCodesWithSettings,
  getCountryInfo,
} from "../data/countryList";
import Flag from "react-world-flags";
import "./Question.scss";
import "./StatusBar.scss";
import clsx from "clsx";
import { ISettings } from "./Settings";
import {
  calculateAverage,
  clamp,
  formatPopulationNumber,
  shuffleArray,
} from "../utils/utils";
import { defaultScore, Score } from "./Layout";

const minSkewedLookupRestriction = 5;
const maxRecentLength = 5;
const delay = {
  correct: 750,
  incorrect: 3000,
};
const confidenceMag = 5;

interface Props {
  settings: ISettings;
  score: Score;
  setScore: (score: Score) => void;
  setIsSettingsModalOpen: (open: boolean) => void;
  setIsListModalOpen: (open: boolean) => void;
}

export const Question = ({
  settings,
  score,
  setScore,
  setIsSettingsModalOpen,
  setIsListModalOpen,
}: Props) => {
  const [answer, setAnswer] = useState<CountryData | undefined>(undefined);
  const [recentlySelected, setRecentlySelected] = useState<string[]>([]);
  const [eligibleCountries, setElibibleCountries] = useState<string[]>([]);
  const [answerList, setAnswerList] = useState<string[]>([]);
  const [guess, setGuess] = useState<string | undefined>(undefined);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | undefined>(
    undefined
  );

  function getRandomCountry() {
    const eligibleCountriesExceptRecent = eligibleCountries.filter(
      (countryCode) => !recentlySelected.includes(countryCode)
    );

    let scoredCountries = score.countries.filter((country) =>
      eligibleCountriesExceptRecent.includes(country.x)
    );

    shuffleArray(scoredCountries);

    scoredCountries.sort((a, b) => a.s - b.s);

    // Randomly pick a threshold for the random number
    // to favour the lowest scoring countries
    const skewedLookupLength = Math.max(
      minSkewedLookupRestriction,
      Math.floor(Math.random() * scoredCountries.length)
    );

    const randomCountryCode =
      scoredCountries[Math.floor(Math.random() * skewedLookupLength)];

    return getCountryInfo(randomCountryCode.x);
  }

  function getRandomAnswers(selectecCountryCode: string) {
    if (!selectecCountryCode) return;

    const eligibleCountriesFiltered = eligibleCountries.filter(
      (countryCode) => countryCode !== selectecCountryCode
    );

    // Get random countries
    const shuffled = eligibleCountriesFiltered.sort(() => 0.5 - Math.random());

    let selected = shuffled.slice(0, 3);
    selected.push(selectecCountryCode);
    shuffleArray(selected);

    setAnswerList(selected);
  }

  function pickNextAnswer() {
    const country = getRandomCountry();

    if (!country) return;

    setGuess(undefined);
    setAnswerCorrect(undefined);
    setAnswer(country);
    getRandomAnswers(country.code);
  }

  // Set list of eligible countries
  useEffect(() => {
    setElibibleCountries(getCountryCodesWithSettings(settings));
  }, [settings]);

  // If has eligible countries, select a random one
  useEffect(() => {
    if (eligibleCountries.length) pickNextAnswer();
  }, [eligibleCountries]);

  // When showing answer
  useEffect(() => {
    if (answerCorrect === undefined) return;

    setTimeout(pickNextAnswer, answerCorrect ? delay.correct : delay.incorrect);
  }, [answerCorrect]);

  // React to guess
  useEffect(() => {
    if (!guess || !answer) return;

    const isCorrectGuess = guess === answer.code;

    const countries = score.countries.map((country) => {
      if (country.x === answer.code) {
        const c = country.c + (isCorrectGuess ? 1 : 0);
        const i = country.i + (isCorrectGuess ? 0 : 1);
        const confidenceScore = country.s + (isCorrectGuess ? 1 : -1);
        const s = clamp(
          Math.round(confidenceScore),
          confidenceMag * -1,
          confidenceMag
        );
        return { ...country, c, i, s };
      } else {
        return country;
      }
    });

    const newScore = {
      countries,
      correct: score.correct + (isCorrectGuess ? 1 : 0),
      incorrect: score.incorrect + (isCorrectGuess ? 0 : 1),
    };

    setAnswerCorrect(isCorrectGuess);
    setScore(newScore);

    // Update recently selected countries
    let recentList = recentlySelected;
    if (recentList.length >= maxRecentLength) {
      recentList.shift();
    }
    recentList.push(answer.code);
    setRecentlySelected(recentList);
  }, [guess]);

  const AnswerButtons = () => {
    return (
      <div
        className={`answer-btns answer-btns--show-${
          answerCorrect !== undefined ? "true" : "false"
        }`}
      >
        {answerList.map((countryCode) => {
          const countryName = countryList.find(
            (country) => country.code === countryCode
          );

          if (!countryName) return null;

          return (
            <button
              key={countryCode}
              className={clsx(
                "answer-btn",
                answerCorrect !== undefined &&
                  countryName.code === answer?.code &&
                  "answer-btn--correct",
                answerCorrect !== undefined &&
                  countryName.code === guess &&
                  answer?.code !== guess &&
                  "answer-btn--incorrect",
                answerCorrect !== undefined &&
                  countryName.code !== answer?.code &&
                  countryName.code !== guess &&
                  "answer-btn--neither"
              )}
              onClick={() => setGuess(countryName.code)}
            >
              {countryName.name}
            </button>
          );
        })}
      </div>
    );
  };

  const ConfidenceInfo = () => {
    if (!answer) return null;

    const currentCountry = score.countries.find(
      (country) => country.x === answer.code
    );

    if (!currentCountry) return null;

    const confidenceLeft =
      ((currentCountry.s + confidenceMag) / (confidenceMag * 2)) * 100;

    return (
      <div className="confidence">
        <span>Confidence</span>

        <div className="confidence-bar">
          <div className="confidence-bar__middle" />
          <div
            className="confidence-bar__indicator"
            style={{ width: confidenceLeft + "%" }}
          />
        </div>

        <span className="confidence__guesses">
          Guesses: {currentCountry.c} / {currentCountry.c + currentCountry.i}
        </span>
      </div>
    );
  };

  const CountryInfo = () => {
    if (!answer) return null;

    return (
      <div className="country-stats">
        <span className="country-stats__pop">
          Pop: {formatPopulationNumber(answer.population)}
        </span>
        <span className="country-stats__capital">
          Capital: {answer.capital}
        </span>
      </div>
    );
  };

  const animationDuration =
    (answerCorrect ? delay.correct : delay.incorrect) / 1000 + "s";

  const StatusBar = () => {
    return (
      <div
        className={clsx(
          "status-bar",
          answerCorrect === true && "status-bar--correct",
          answerCorrect === false && "status-bar--incorrect"
        )}
      >
        {answerCorrect !== undefined && (
          <>
            <div
              className="status-bar__progress"
              style={{ animationDuration }}
            />
            <span>{answerCorrect ? "Correct!" : "Incorrect"}</span>
          </>
        )}
      </div>
    );
  };

  const WrongGuessFlag = () => {
    if (guess === undefined || answerCorrect !== false) return null;

    return (
      <div className="other-flag">
        <div className="other-flag__inner">
          <Flag code={guess} />
          <span>{countryList.find((c) => c.code === guess)?.name}</span>
        </div>
      </div>
    );
  };

  if (answer === undefined) return null;

  return (
    <div className="question">
      <div className="status__buttons">
        <button
          onClick={() => {
            setIsSettingsModalOpen(true);
          }}
        >
          Set Difficulty
        </button>
        <button
          onClick={() => {
            setIsListModalOpen(true);
          }}
        >
          Flag List
        </button>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to reset your score and progress?"
              )
            ) {
              setScore(defaultScore());
            }
          }}
        >
          Reset score
        </button>
      </div>

      <div className="status">
        <div className="stat">
          <span>Correct</span>
          <span className="stat-col-correct">{score.correct}</span>
        </div>

        <div className="stat">
          <span>Incorrect</span>
          <span className="stat-col-incorrect">{score.incorrect}</span>
        </div>

        <div className="stat">
          <span>Average</span>
          <span className="stat-col-avg">
            {Math.round(calculateAverage(score.correct, score.incorrect))}%
          </span>
        </div>

        <StatusBar />
      </div>

      <div className="question__country">
        <ConfidenceInfo />

        <div className="question__country__flag">
          <Flag code={answer.code} />
        </div>

        <CountryInfo />

        <WrongGuessFlag />
      </div>

      <AnswerButtons />
    </div>
  );
};
