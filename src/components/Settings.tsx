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
  mode: string;
}

export const Difficulty = {
  VeryEasy: "Very Easy",
  Easy: "Easy",
  Moderate: "Moderate",
  Hard: "Hard",
  VeryHard: "Very Hard",
} as const;

export type Difficulties = ValueOf<typeof Difficulty>;

export const Mode = {
  PickName: "Pick the name",
  PickFlag: "Pick the flag",
  TypeName: "Type the name",
} as const;

export type Modes = ValueOf<typeof Mode>;

export const DifficultyPops: Record<Difficulties, number> = {
  [Difficulty.VeryEasy]: 50000000,
  [Difficulty.Easy]: 10000000,
  [Difficulty.Moderate]: 5000000,
  [Difficulty.Hard]: 100000,
  [Difficulty.VeryHard]: 0,
};

export const defaultSettings: ISettings = {
  difficulty: Difficulty.Easy,
  mode: Mode.PickName,
};

export const Settings = ({ settings, setSettings, onClose }: Props) => {
  const [difficulty, setDifficulty] = useState<Difficulties>(
    settings["difficulty"] as Difficulties
  );
  const [mode, setMode] = useState<Modes>(settings["mode"] as Modes);

  useEffect(() => {
    if (difficulty !== settings.difficulty || mode !== settings.mode) {
      setSettings({ difficulty, mode });
    }
    // eslint-disable-next-line
  }, [difficulty, mode]);

  const numCountriesForLevel = getCountryCodesWithDifficulty(difficulty).length;
  const populationForLevel = formatPopulationNumber(DifficultyPops[difficulty]);

  return (
    <Modal
      title="Settings"
      isOpen
      onClose={onClose}
      modalClass="settings-modal"
    >
      <div className="settings">
        <ToggleGroup label="Mode" isVertical>
          {Object.values(Mode).map((m) => (
            <Toggle
              key={m}
              label={m}
              isCurrent={mode === m}
              onClick={() => setMode(m as Modes)}
            />
          ))}
        </ToggleGroup>

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
