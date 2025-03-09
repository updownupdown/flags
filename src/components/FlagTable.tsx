import "./FlagTable.scss";
import {
  countryList,
  getCountryCodesWithSettings,
  getCountryInfo,
} from "../data/countryList";
import Flag from "react-world-flags";
import { calculateAverage, formatPopulationNumber } from "../utils/utils";
import {
  defaultSettings,
  Difficulties,
  DifficultyPops,
  ISettings,
} from "./Settings";
import { Score } from "./Layout";
import clsx from "clsx";
import { Toggle, ToggleGroup } from "./Toggle";
import { useEffect, useState } from "react";

interface Props {
  settings: ISettings;
  setSettings: (settings: ISettings) => void;
  score: Score;
}

export const FlagTable = ({ settings, setSettings, score }: Props) => {
  const [showExcluded, setShowExcluded] = useState(
    settings.showExcludedFlags === "true"
  );

  function handleExcludeChange(exclude: boolean) {
    setShowExcluded(exclude);
    setSettings({ ...settings, showExcludedFlags: exclude.toString() });
  }

  const populationThreshold =
    DifficultyPops[settings.difficulty as Difficulties];

  return (
    <div className="flag-table">
      <div className="flag-table-message">
        <span>
          Countries excluded due to the selected difficult level are greyed-out.
        </span>

        <ToggleGroup label="">
          <Toggle
            label="Show excluded"
            isCurrent={showExcluded}
            onClick={() => handleExcludeChange(true)}
          />
          <Toggle
            label="Hide excluded"
            isCurrent={!showExcluded}
            onClick={() => handleExcludeChange(false)}
          />
        </ToggleGroup>
      </div>

      {countryList
        .filter(
          (country) => showExcluded || country.population >= populationThreshold
        )
        .map((country) => {
          if (!score.countries) return null;

          const countryScore = score.countries.find(
            (c) => c.x === country.code
          );

          if (!country || !countryScore) return null;

          const average = Math.round(
            calculateAverage(countryScore.c, countryScore.i)
          );

          return (
            <div
              key={country.code}
              className={clsx(
                "flag-table__country",
                country.population < populationThreshold &&
                  "flag-table__country--excluded"
              )}
            >
              <div className="flag-table__country__img">
                <Flag code={country.code} />
              </div>

              <div className="flag-table__country__info">
                <span className="flag-table__country__info__name">
                  {country.name}
                </span>
                <span className="flag-table__country__info__pop">
                  Pop: {formatPopulationNumber(country.population)}
                </span>
                <span className="flag-table__country__info__stats">
                  Accuracy: {average}% ({countryScore.c}/
                  {countryScore.i + countryScore.c})
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};
