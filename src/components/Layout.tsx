import React, { useState } from "react";
import { FlagTable } from "./FlagTable";
import "./Layout.scss";
import { Question } from "./Question";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultSettings, ISettings, Settings } from "./Settings";
import { countryList } from "../data/countryList";
import { Modal } from "./Modal";

interface ScoreCountry {
  x: string;
  c: number;
  i: number;
  s: number;
}

export interface Score {
  correct: number;
  incorrect: number;
  countries: ScoreCountry[];
}

export function defaultScore() {
  const countries = countryList.map((country) => ({
    /** Country code */
    x: country.code,
    /** Correct guesses */
    c: 0,
    /** Incorrect guesses */
    i: 0,
    /** Confidence score */
    s: 0,
  }));

  return {
    correct: 0,
    incorrect: 0,
    countries,
  };
}

export const Layout = () => {
  const [settings, setSettings] = useLocalStorage<ISettings>(
    "flagSettings",
    defaultSettings
  );
  const [score, setScore] = useLocalStorage<Score>("flagScore", defaultScore());

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  return (
    <>
      <div className="layout">
        <div className="layout__center">
          <Question
            settings={settings}
            score={score}
            setScore={setScore}
            setIsSettingsModalOpen={setIsSettingsModalOpen}
          />

          <button
            className="view-flags-btn"
            onClick={() => {
              setIsListModalOpen(true);
            }}
          >
            View flags and progress
          </button>
        </div>
      </div>

      <Modal
        title="Settings"
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      >
        <Settings
          settings={settings}
          setSettings={setSettings}
          setScore={setScore}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      </Modal>

      <Modal
        title="Flag List"
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        modalClass="flags-modal"
      >
        <FlagTable
          settings={settings}
          score={score}
          setSettings={setSettings}
        />
      </Modal>
    </>
  );
};
