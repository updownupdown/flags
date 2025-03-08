import React, { useState } from "react";
import { FlagTable } from "./FlagTable";
import "./Layout.scss";
import { Question } from "./Question";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultSettings, Settings } from "./Settings";
import { countryList } from "../data/countryList";
import { Modal } from "./Modal";

interface ScoreCountry {
  x: string;
  c: number;
  i: number;
  a: number;
}

export interface Score {
  correct: number;
  incorrect: number;
  countries: ScoreCountry[];
}

export function defaultScore() {
  const countries = countryList.map((country) => ({
    x: country.code,
    c: 0,
    i: 0,
    a: 0,
  }));

  return {
    correct: 0,
    incorrect: 0,
    countries,
  };
}

export const Layout = () => {
  const [settings, setSettings] = useLocalStorage<Settings>(
    "settings",
    defaultSettings
  );
  const [score, setScore] = useLocalStorage<Score>("score", defaultScore());

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
        />
      </Modal>

      <Modal
        title="Flags List"
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        modalClass="flags-modal"
      >
        <FlagTable settings={settings} score={score} />
      </Modal>
    </>
  );
};
