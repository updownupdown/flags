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
  region: string;
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

export const Region = {
  All: "All",
  Americas: "Americas",
  Asia: "Asia",
  Africa: "Africa",
  Europe: "Europe",
  Oceania: "Oceania",
  Other: "Other",
};

export type Regions = ValueOf<typeof Region>;

export const defaultSettings: ISettings = {
  difficulty: Difficulty.Easy,
  mode: Mode.PickName,
  region: Region.All,
};

export const Settings = ({ settings, setSettings, onClose }: Props) => {
  const [difficulty, setDifficulty] = useState<Difficulties>(
    settings["difficulty"] as Difficulties
  );
  const [mode, setMode] = useState<Modes>(settings["mode"] as Modes);
  const [region, setRegion] = useState<Regions>(settings["region"] as Regions);

  useEffect(() => {
    if (
      difficulty !== settings.difficulty ||
      mode !== settings.mode ||
      region !== settings.region
    ) {
      setSettings({ difficulty, mode, region });
    }
    // eslint-disable-next-line
  }, [difficulty, mode, region]);

  const numCountriesForLevel = getCountryCodesWithDifficulty(
    difficulty,
    region
  ).length;
  const populationForLevel = formatPopulationNumber(DifficultyPops[difficulty]);

  return (
    <Modal
      title="Settings"
      isOpen
      onClose={onClose}
      modalClass="settings-modal"
    >
      <div className="settings">
        <ToggleGroup label="Mode" isVertical className="mode-toggle">
          <Toggle
            label={Mode.PickName}
            isCurrent={mode === Mode.PickName}
            onClick={() => setMode(Mode.PickName)}
          >
            Pick
            <br />
            name
          </Toggle>
          <Toggle
            label={Mode.PickFlag}
            isCurrent={mode === Mode.PickFlag}
            onClick={() => setMode(Mode.PickFlag)}
          >
            Pick
            <br />
            flag
          </Toggle>
          <Toggle
            label={Mode.TypeName}
            isCurrent={mode === Mode.TypeName}
            onClick={() => setMode(Mode.TypeName)}
          >
            Type
            <br />
            name
          </Toggle>
        </ToggleGroup>

        <div className="region-toggle">
          <label>
            <span>Region</span>
            <select
              name="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {Object.keys(Region).map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
        </div>

        {region === Region.All && (
          <ToggleGroup
            label="Difficulty"
            isVertical
            className="difficulty-toggle"
          >
            {Object.values(Difficulty).map((diff) => (
              <Toggle
                key={diff}
                label={diff}
                isCurrent={difficulty === diff}
                onClick={() => setDifficulty(diff as Difficulties)}
              />
            ))}
          </ToggleGroup>
        )}

        <span className="settings-pop-hint">
          {DifficultyPops[difficulty] === 0 ? (
            `Includes all ${countryList.length} countries`
          ) : (
            <>
              <span>{`Includes ${numCountriesForLevel} countries`}</span>
              {region === Region.All ? (
                <span>{`(population of over ${populationForLevel})`}</span>
              ) : (
                <span>
                  (selection "All" region to set difficulty by population level)
                </span>
              )}
            </>
          )}
        </span>
      </div>
    </Modal>
  );
};
