import "./FlagTable.scss";
import { countryList } from "../data/countryList";
import Flag from "react-world-flags";
import { Difficulties, DifficultyPops, ISettings } from "./Settings";
import clsx from "clsx";
import { Modal } from "./Modal";

interface Props {
  settings: ISettings;
  onClose: () => void;
}

export const FlagTable = ({ settings, onClose }: Props) => {
  const populationThreshold =
    DifficultyPops[settings.difficulty as Difficulties];

  const filteredCountries = countryList
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    .filter((country) => country.population >= populationThreshold);

  const excludedCountries = countryList.length - filteredCountries.length;

  return (
    <Modal title="Flag List" isOpen onClose={onClose} modalClass="flags-modal">
      <div className="flag-table">
        <div className="modal-message">
          {excludedCountries} countries we excluded due to the selected
          difficult level.
        </div>

        {filteredCountries.map((country) => {
          return (
            <div
              key={country.code}
              className={clsx(
                "flag-table__country",
                country.population < populationThreshold &&
                  "flag-table__country--excluded"
              )}
            >
              <Flag code={country.code} />
              <span>{country.name}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
