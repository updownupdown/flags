import React from "react";
import country from "country-list-js";
import Flag from "react-world-flags";
import "./study.scss";

const Study = (props) => {
  const countriesList = country.ls("name").sort();

  return (
    <>
      <h1>Study Flags</h1>
      <div className="study">
        {countriesList.map((countryName) => {
          const theCountry = country.findByName(countryName);

          return (
            <div key={countryName} className="country">
              <div className="info">
                <span className="name">{countryName}</span>
                <span className="capital">{theCountry.capital}</span>
              </div>
              <div className="flag">
                <Flag code={theCountry.code.iso2} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Study;
