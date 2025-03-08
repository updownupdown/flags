import React, { useEffect, useState } from "react";
import "./Settings.scss";
import { defaultScore, Score } from "./Layout";

interface Props {
  settings: ISettings;
  setSettings: (settings: ISettings) => void;
  setScore: (score: Score) => void;
}

export interface ISettings {
  includeMinor: boolean;
}

export const defaultSettings: ISettings = {
  includeMinor: false,
};

export const Settings = ({ settings, setSettings, setScore }: Props) => {
  const [includeMinor, setIncludeMinor] = useState(settings["includeMinor"]);

  useEffect(() => {
    setSettings({ includeMinor });
  }, [includeMinor]);

  return (
    <div className="settings">
      <div className="settings-input">
        <label>
          <input
            type="checkbox"
            checked={includeMinor}
            onChange={() => setIncludeMinor(!includeMinor)}
          />
          <span>Include countries with less than 100,000 population</span>
        </label>
      </div>

      <button
        className="settings-reset-btn"
        onClick={() => {
          if (
            window.confirm(
              "Are you sure you want to reset your score and progress?"
            )
          ) {
            setScore(defaultScore());
          }
        }}
      >
        Reset score
      </button>
    </div>
  );
};
