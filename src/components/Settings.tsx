import { useEffect, useState } from "react";
import "./Settings.scss";
import { Toggle, ToggleGroup } from "./Toggle";
import { formatPopulationNumber, ValueOf } from "../utils/utils";
import {
  countryList,
  getCountryCodesWithDifficulty,
} from "../data/countryList";
import { Modal } from "./Modal";
import { Score } from "./Score";

interface Props {
  settings: ISettings;
  setSettings: (settings: ISettings) => void;
  setScore: (score: Score) => void;
  onClose: () => void;
}

export interface ISettings {
  difficulty: string;
  showExcludedFlags: string;
}

export const Difficulty = {
  VeryEasy: "Very Easy",
  Easy: "Easy",
  Moderate: "Moderate",
  Hard: "Hard",
  VeryHard: "Very Hard",
} as const;

export type Difficulties = ValueOf<typeof Difficulty>;

export const DifficultyPops: Record<Difficulties, number> = {
  [Difficulty.VeryEasy]: 50000000,
  [Difficulty.Easy]: 10000000,
  [Difficulty.Moderate]: 5000000,
  [Difficulty.Hard]: 100000,
  [Difficulty.VeryHard]: 0,
};

export const defaultSettings: ISettings = {
  difficulty: Difficulty.Easy,
  showExcludedFlags: "true",
};

export const Settings = ({ settings, setSettings, onClose }: Props) => {
  const [difficulty, setDifficulty] = useState<Difficulties>(
    settings["difficulty"] as Difficulties
  );

  useEffect(() => {
    setSettings({ ...settings, difficulty });
    // eslint-disable-next-line
  }, [difficulty]);

  const numCountriesForLevel = getCountryCodesWithDifficulty(difficulty).length;
  const populationForLevel = formatPopulationNumber(DifficultyPops[difficulty]);

  return (
    <Modal
      title="Difficulty"
      isOpen
      onClose={onClose}
      modalClass="settings-modal"
    >
      <div className="settings">
        <ToggleGroup label="Difficulty" isVertical>
          {Object.values(Difficulty).map((diff) => (
            <Toggle
              key={diff}
              label={diff}
              isCurrent={difficulty === diff}
              onClick={() => setDifficulty(diff as Difficulties)}
            />
          ))}
        </ToggleGroup>

        <span className="settings-pop-hint">
          {DifficultyPops[difficulty] === 0 ? (
            `Includes all ${countryList.length} countries`
          ) : (
            <>
              <span>{`Includes ${numCountriesForLevel} countries`}</span>
              <span>{`(population of over ${populationForLevel})`}</span>
            </>
          )}
        </span>
      </div>
    </Modal>
  );
};
