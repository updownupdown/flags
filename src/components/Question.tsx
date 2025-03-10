import { useEffect, useState } from "react";
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
import { clamp, formatPopulationNumber, shuffleArray } from "../utils/utils";
import { Globe } from "./Globe";
import { Capital as CapitalIcon } from "../icons/Capital";
import { Flag as FlagIcon } from "../icons/Flag";
import { Population as PopulationIcon } from "../icons/Population";
import { WinRate as WinRateIcon } from "../icons/WinRate";
import { ConfidenceBar, confidenceMag, Score } from "./Score";

const minSkewedLookupRestriction = 5;
const maxRecentLength = 5;
const delay = {
  correct: 750,
  incorrect: 3000,
};

interface Props {
  settings: ISettings;
  score: Score;
  setScore: (score: Score) => void;
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
              {countryName.name}
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
          <span className={clsx(!guess && "country-info-pale")}>
            {!guess ? "???" : answer.name}
          </span>
        </div>
        <div>
          <CapitalIcon />
          <span>{answer.capital}</span>
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

  if (answer === undefined) return null;

  return (
    <>
      <div className="question">
        <div className="question__country">
          <div className="question__country__top">
            <div className="question__country__top__left">
              <CountryInfo />
            </div>
            <div className="question__country__top__right">
              <Globe selectedCountry={answer.code} />
            </div>
          </div>

          <div className="question__country__bottom">
            <div className="question__country__flag">
              <Flag code={answer.code} />
            </div>

            <WrongGuessFlag />
          </div>
        </div>

        <AnswerButtons />
      </div>
    </>
  );
};
