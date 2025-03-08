import React, { memo, useEffect, useState } from "react";
import {
  CountryData,
  countryList,
  getCountryCodesWithSettings,
  getCountryInfo,
} from "../data/countryList";
import Flag from "react-world-flags";
import "./Question.scss";
import clsx from "clsx";
import { Settings } from "./Settings";
import { calculateAverage, shuffleArray } from "../utils/utils";
import { Settings as SettingsIcon } from "../icons/Settings";
import { Score } from "./Layout";

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
  settings: Settings;
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
    const eligibleCountriesFiltered = eligibleCountries.filter(
      (countryCode) => !recentlySelected.includes(countryCode)
    );

    const randomCountryCode =
      eligibleCountriesFiltered[
        Math.floor(Math.random() * eligibleCountries.length)
      ];

    let recentList = recentlySelected;
    if (recentList.length >= maxRecentLength) {
      recentList.shift();
    }
    recentList.push(randomCountryCode);

    setRecentlySelected(recentList);

    return getCountryInfo(randomCountryCode);
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

    setGuessCorrect(undefined);
    setSelectedCountry(country);
    getRandomAnswers(country.code);
  }

  // Set list of eligible countries
  useEffect(() => {
    setElibibleCountries(getCountryCodesWithSettings(settings));
  }, []);

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
        const a = calculateAverage(c, i);
        return { ...country, c, i, a };
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

    setTimeout(
      () => {
        nextCountry();
      },
      guessCorrect ? delay.correct : delay.incorrect
    );
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
