import { useEffect, useState } from "react";
import "./Settings.scss";
import { defaultScore, Score } from "./Layout";
import { Toggle, ToggleGroup } from "./Toggle";
import { formatPopulationNumber, ValueOf } from "../utils/utils";

interface Props {
  settings: ISettings;
  setSettings: (settings: ISettings) => void;
  setScore: (score: Score) => void;
  onClose: () => void;
}

export interface ISettings {
  difficulty: string;
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
  [Difficulty.Moderate]: 100000,
  [Difficulty.Hard]: 10000,
  [Difficulty.VeryHard]: 0,
};

export const defaultSettings: ISettings = {
  difficulty: Difficulty.Easy,
};

export const Settings = ({
  settings,
  setSettings,
  setScore,
  onClose,
}: Props) => {
  const [difficulty, setDifficulty] = useState<Difficulties>(
    settings["difficulty"] as Difficulties
  );

  useEffect(() => {
    setSettings({ difficulty });
  }, [difficulty]);

  return (
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
        {DifficultyPops[difficulty] === 0
          ? "Includes all countries."
          : `Includes countries with a population of at least ${formatPopulationNumber(
              DifficultyPops[difficulty]
            )}.`}
      </span>

      <button
        className="settings-reset-btn"
        onClick={() => {
          if (
            window.confirm(
              "Are you sure you want to reset your score and progress?"
            )
          ) {
            setScore(defaultScore());
            onClose();
          }
        }}
      >
        Reset score
      </button>
    </div>
  );
};
