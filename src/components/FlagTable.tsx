import React from "react";
import "./FlagTable.scss";
import {
  countryList,
  getCountryCodesWithSettings,
  getCountryInfo,
} from "../data/countryList";
import Flag from "react-world-flags";
import { calculateAverage, formatPopulationNumber } from "../utils/utils";
import { Settings } from "./Settings";
import { Score } from "./Layout";

interface Props {
  settings: Settings;
  score: Score;
}

export const FlagTable = ({ settings, score }: Props) => {
  const list = getCountryCodesWithSettings(settings);

  return (
    <div className="flag-table">
      {list.map((countryCode) => {
        if (!score.countries) return;

        const country = getCountryInfo(countryCode);
        const countryScore = score.countries.find((c) => c.x === countryCode);

        if (!country || !countryScore) return null;

        return (
          <div key={country.code} className="flag-table__country">
            <div className="flag-table__country__img">
              <Flag code={country.code} />
            </div>

            <div className="flag-table__country__info">
              <span className="flag-table__country__info__name">
                {country.name}
              </span>
              <span className="flag-table__country__info__stats">
                {countryScore.c}/{countryScore.i} ({countryScore.a}%)
              </span>
              <span className="flag-table__country__info__pop">
                Pop: {formatPopulationNumber(country.population)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
