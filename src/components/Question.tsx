import { memo, useEffect, useState } from "react";
import {
  CountryData,
  countryList,
  getCountryCodesWithSettings,
  getCountryInfo,
} from "../data/countryList";
import Flag from "react-world-flags";
import "./Question.scss";
import clsx from "clsx";
import { ISettings } from "./Settings";
import { calculateAverage, clamp, shuffleArray } from "../utils/utils";
import { Settings as SettingsIcon } from "../icons/Settings";
import { Score } from "./Layout";

const minSkewedLookupRestriction = 5;
const maxRecentLength = 5;
const delay = {
  correct: 750,
  incorrect: 2000,
};

interface CounterProps {
  theme: "correct" | "incorrect";
  num: number;
}

const Counter = memo(function Counter({ num, theme }: CounterProps) {
  return (
    <div className={`status-count status-count--theme-${theme}`}>
      <span className="status-count__num">{num}</span>
    </div>
  );
});

interface Props {
  settings: ISettings;
  score: Score;
  setScore: (score: Score) => void;
  setIsSettingsModalOpen: (open: boolean) => void;
}

export const Question = ({
  settings,
  score,
  setScore,
  setIsSettingsModalOpen,
}: Props) => {
  const [selectedCountry, setSelectedCountry] = useState<
    CountryData | undefined
  >(undefined);
  const [recentlySelected, setRecentlySelected] = useState<string[]>([]);
  const [eligibleCountries, setElibibleCountries] = useState<string[]>([]);
  const [answerList, setAnswerList] = useState<string[]>([]);
  const [guessCorrect, setGuessCorrect] = useState<boolean | undefined>(
    undefined
  );
  const [guess, setGuess] = useState<string | undefined>(undefined);

  const [previousScoreCorrect, setPreviousScoreCorrect] = useState(
    score.correct
  );
  const [previousScoreIncorrect, setPreviousScoreIncorrect] = useState(
    score.incorrect
  );

  function getRandomCountry() {
    const eligibleCountriesExceptRecent = eligibleCountries.filter(
      (countryCode) => !recentlySelected.includes(countryCode)
    );

    const scoredCountries = score.countries
      .filter((country) => eligibleCountriesExceptRecent.includes(country.x))
      .sort((a, b) => a.s - b.s);

    // Randomly pick a threshold for the random number
    // to favour the lowest scoring countries
    const skewedLookupLength = Math.max(
      minSkewedLookupRestriction,
      Math.floor(Math.random() * scoredCountries.length)
    );

    const randomCountryCode =
      scoredCountries[Math.floor(Math.random() * skewedLookupLength)];

    // Update recently selected countries
    let recentList = recentlySelected;
    if (recentList.length >= maxRecentLength) {
      recentList.shift();
    }
    recentList.push(randomCountryCode.x);
    setRecentlySelected(recentList);

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

  function nextCountry() {
    const country = getRandomCountry();

    if (!country) return;

    setGuess(undefined);
    setGuessCorrect(undefined);
    setSelectedCountry(country);
    getRandomAnswers(country.code);
  }

  // Set list of eligible countries
  useEffect(() => {
    setElibibleCountries(getCountryCodesWithSettings(settings));
  }, [settings]);

  // If has eligible countries, select a random one
  useEffect(() => {
    if (eligibleCountries.length !== 0) {
      nextCountry();
    }
  }, [eligibleCountries]);

  useEffect(() => {
    if (!guess || !selectedCountry) return;

    const correctGuess = guess === selectedCountry.code;

    setGuessCorrect(correctGuess);

    const countries = score.countries.map((country) => {
      if (country.x === selectedCountry.code) {
        const c = country.c + (correctGuess ? 1 : 0);
        const i = country.i + (correctGuess ? 0 : 1);
        const newConfidenceScore = Math.round(
          country.s + (correctGuess ? 2 : -2)
        );
        const s = clamp(newConfidenceScore, 0, 10);
        return { ...country, c, i, s };
      } else {
        return country;
      }
    });

    const correct = score.correct + (correctGuess ? 1 : 0);
    const incorrect = score.incorrect + (correctGuess ? 0 : 1);

    const newScore = {
      ...score,
      countries,
      correct,
      incorrect,
    };

    if (score.correct !== previousScoreCorrect) {
      setPreviousScoreCorrect(score.correct);
    }
    if (score.incorrect !== previousScoreIncorrect) {
      setPreviousScoreIncorrect(score.incorrect);
    }

    setScore(newScore);
  }, [guess]);

  // When showing answer
  useEffect(() => {
    if (guessCorrect === undefined) return;

    setTimeout(nextCountry, guessCorrect ? delay.correct : delay.incorrect);
  }, [guessCorrect]);

  const AnswerButtons = () => {
    return (
      <div
        className={`answer-btns answer-btns--show-${
          guessCorrect !== undefined ? "true" : "false"
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
                guessCorrect !== undefined &&
                  countryName.code === selectedCountry?.code &&
                  "answer-btn--correct",
                guessCorrect !== undefined &&
                  countryName.code === guess &&
                  selectedCountry?.code !== guess &&
                  "answer-btn--incorrect",
                guessCorrect !== undefined &&
                  countryName.code !== selectedCountry?.code &&
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

  const StatusBar = () => {
    const animationDurationMs = guessCorrect ? delay.correct : delay.incorrect;
    const animationDuration = animationDurationMs / 1000 + "s";

    return (
      <div
        className={clsx(
          "status-bar",
          guessCorrect === true && "status-bar--correct",
          guessCorrect === false && "status-bar--incorrect"
        )}
      >
        {guessCorrect !== undefined && (
          <>
            <div
              className="status-bar__progress"
              style={{ animationDuration }}
            />
            <span>{guessCorrect ? "Correct!" : "Incorrect"}</span>
          </>
        )}
      </div>
    );
  };

  if (selectedCountry === undefined) return null;

  return (
    <>
      <div className="question">
        <div className="question__flag-img">
          <Flag code={selectedCountry.code} />
        </div>

        <AnswerButtons />

        <div className="status">
          <div className="status-percentage">
            <span>
              {Math.round(calculateAverage(score.correct, score.incorrect))}%
            </span>
          </div>

          <Counter num={score.correct} theme="correct" />
          <StatusBar />
          <Counter num={score.incorrect} theme="incorrect" />

          <button
            className="settings-btn"
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <SettingsIcon />
          </button>
        </div>
      </div>
    </>
  );
};
