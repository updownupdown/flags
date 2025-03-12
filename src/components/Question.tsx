import React, { useEffect, useRef, useState } from "react";
import {
  CountryData,
  countryList,
  getCountryCodesWithSettings,
  getCountryInfo,
} from "../data/countryList";
import Flag from "react-world-flags";
import "./Question.scss";
import clsx from "clsx";
import { ISettings, Mode } from "./Settings";
import { clamp, formatPopulationNumber, shuffleArray } from "../utils/utils";
import { Globe } from "./Globe";
import { Capital as CapitalIcon } from "../icons/Capital";
import { Flag as FlagIcon } from "../icons/Flag";
import { Population as PopulationIcon } from "../icons/Population";
import { WinRate as WinRateIcon } from "../icons/WinRate";
import { ConfidenceBar, confidenceMag, Score } from "./Score";
import { Close as CloseIcon } from "../icons/Close";

const minSkewedLookupRestriction = 5;
const maxRecentLength = 5;
const delay = {
  correct: 450,
  incorrect: 3000,
};

interface Props {
  settings: ISettings;
  score: Score;
  setScore: (score: Score) => void;
  setSettings: (settings: ISettings) => void;
}

export const Question = ({ settings, score, setScore }: Props) => {
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
    // eslint-disable-next-line
  }, [eligibleCountries]);

  // When showing answer
  useEffect(() => {
    if (answerCorrect === undefined) return;

    setTimeout(pickNextAnswer, answerCorrect ? delay.correct : delay.incorrect);
    // eslint-disable-next-line
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

    // Reset input
    if (settings.mode === Mode.TypeName) {
      resetInput();
    }

    // eslint-disable-next-line
  }, [guess]);

  const AnswerButtons = () => {
    return (
      <div
        className={clsx(
          "answer-btns",
          `answer-btns--show-${answerCorrect !== undefined ? "true" : "false"}`
        )}
      >
        {answerList.map((countryCode) => {
          const countryName = countryList.find(
            (country) => country.code === countryCode
          );

          if (!countryName) return null;

          const isCorrect =
            answerCorrect !== undefined && countryName.code === answer?.code;
          const isIncorrect =
            answerCorrect !== undefined &&
            countryName.code === guess &&
            answer?.code !== guess;
          const isNeither =
            answerCorrect !== undefined &&
            countryName.code !== answer?.code &&
            countryName.code !== guess;

          return (
            <button
              key={countryCode}
              className={clsx(
                "answer-btn",
                isCorrect && "answer-btn--correct",
                isIncorrect && "answer-btn--incorrect",
                isNeither && "answer-btn--neither"
              )}
              onClick={() => setGuess(countryName.code)}
            >
              {isCorrect && answerCorrect && (
                <div
                  className="answer-btn-bar answer-btn-bar--correct"
                  style={{ animationDuration }}
                />
              )}
              {isIncorrect && !answerCorrect && (
                <div
                  className="answer-btn-bar answer-btn-bar--incorrect"
                  style={{ animationDuration }}
                />
              )}
              {settings.mode === Mode.PickName && countryName.name}
              {settings.mode === Mode.PickFlag && <Flag code={countryCode} />}
            </button>
          );
        })}
      </div>
    );
  };

  const Confidence = () => {
    if (!answer) return null;

    const currentCountry = score.countries.find(
      (country) => country.x === answer.code
    );

    if (!currentCountry) return null;

    return <ConfidenceBar confidence={currentCountry.s} />;
  };

  const CountryInfo = () => {
    if (!answer) return null;

    return (
      <div className="country-info">
        <div>
          <FlagIcon />
          {(settings.mode === Mode.PickName ||
            settings.mode === Mode.TypeName) && (
            <span className={clsx(!guess && "country-info-pale")}>
              {!guess ? "???" : answer.name}
            </span>
          )}
          {settings.mode === Mode.PickFlag && (
            <span className="country-info-large">{answer.name}</span>
          )}
        </div>
        <div>
          <CapitalIcon />
          <span className={clsx(!answer.capital && "country-info-pale")}>
            {answer.capital ?? "N/A"}
          </span>
        </div>
        <div>
          <PopulationIcon />
          <span>{formatPopulationNumber(answer.population)}</span>
        </div>
        <div>
          <WinRateIcon />
          <Confidence />
        </div>
      </div>
    );
  };

  const animationDuration =
    (answerCorrect ? delay.correct : delay.incorrect) / 1000 + "s";

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

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [typingMatches, setTypingMatches] = useState<
    { code: string; name: string }[]
  >([]);

  function resetInput(refocus = true) {
    setInputValue("");
    setTypingMatches([]);
    setSelectedMatch(0);

    refocus && inputRef.current?.focus();
  }

  useEffect(() => {
    if (inputValue === "") {
      if (typingMatches.length) setTypingMatches([]);
      return;
    }

    const matches = countryList
      .filter(
        (country) =>
          country.name.substring(0, inputValue.length).toLowerCase() ===
          inputValue.toLowerCase()
      )
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
      .slice(0, 3);

    setTypingMatches(matches);
  }, [inputValue]);

  // useEffect(() => {
  //   if (
  //     typingMatches.length === 1 &&
  //     autoPressMatch &&
  //     inputValue.length >= 3
  //   ) {
  //     setGuess(typingMatches[0].code);
  //   }
  // }, [typingMatches]);

  const [selectedMatch, setSelectedMatch] = useState(0);
  // const [autoPressMatch, setAutoPressMatch] = useState(true);

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setGuess(typingMatches[selectedMatch].code);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newMatch = Math.max(selectedMatch - 1, 0);
      setSelectedMatch(newMatch);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newMatch = Math.min(selectedMatch + 1, typingMatches.length);
      setSelectedMatch(newMatch);
    }
  }

  if (answer === undefined) return null;

  return (
    <>
      <div
        className={clsx(
          "question",
          settings.mode === Mode.PickName && "question--mode-name",
          settings.mode === Mode.PickFlag && "question--mode-flag",
          settings.mode === Mode.TypeName && "question--mode-type"
        )}
      >
        <div className="question__country">
          <div className="question__country__top">
            <div className="question__country__top__left">
              <CountryInfo />
            </div>
            <div className="question__country__top__right">
              <Globe selectedCountry={answer.code} />
            </div>
          </div>

          {(settings.mode === Mode.PickName ||
            settings.mode === Mode.TypeName) && (
            <div className="question__country__bottom">
              <div className="question__country__flag">
                <Flag code={answer.code} />
              </div>

              <WrongGuessFlag />
            </div>
          )}
        </div>

        {(settings.mode === Mode.PickName ||
          settings.mode === Mode.PickFlag) && <AnswerButtons />}

        {settings.mode === Mode.TypeName && (
          <div className="question-typing">
            <div className="question-typing__input">
              {guess && (
                <div
                  className={`question-typing-result question-typing-result--${
                    answerCorrect ? "correct" : "incorrect"
                  }`}
                >
                  <div
                    className={`question-typing-result__bar question-typing-result--${
                      answerCorrect ? "correct" : "incorrect"
                    }`}
                    style={{ animationDuration }}
                  />
                  <span>{answerCorrect ? "Correct" : "Incorrect"}</span>
                </div>
              )}

              {typingMatches.length !== 0 && (
                <div className="question-typing__input__matches">
                  {typingMatches.map((match, i) => (
                    <button
                      key={match.code}
                      onClick={() => setGuess(match.code)}
                      className={
                        selectedMatch === i
                          ? "match-btn--selected"
                          : "match-btn--unselected"
                      }
                    >
                      {match.name}
                    </button>
                  ))}
                </div>
              )}

              <input
                ref={inputRef}
                value={inputValue}
                type="text"
                onKeyDown={(e) => handleInputKeyDown(e)}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
              />

              {inputValue !== "" && (
                <button
                  className="question-typing-clear"
                  onClick={() => {
                    resetInput(false);
                  }}
                >
                  <CloseIcon />
                </button>
              )}
            </div>

            {/* <label className="auto-pick">
              <input
                type="checkbox"
                checked={autoPressMatch}
                onChange={() => setAutoPressMatch(!autoPressMatch)}
              />
              Auto-pick country for unique matches
            </label> */}
          </div>
        )}
      </div>
    </>
  );
};
