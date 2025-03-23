import { useEffect, useState } from "react";
import { FlagTable } from "./FlagTable";
import "./Layout.scss";
import { Question } from "./Question";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultSettings, ISettings, Settings } from "./Settings";
import { Header } from "./Header";
import { ModalContext, Modals, ModalType } from "../context/ModalContext";
import { defaultScore, Score, ScoreDetails } from "./Score";
import { About } from "./About";

export const Layout = () => {
  const [settings, setSettings] = useLocalStorage<ISettings>(
    "flagSettings",
    defaultSettings
  );
  const [score, setScore] = useLocalStorage<Score>("flagScore", defaultScore());
  const [openModal, setOpenModal] = useState<ModalType | undefined>(undefined);

  useEffect(() => {
    setSettings({
      difficulty: settings.difficulty ?? defaultSettings.difficulty,
      mode: settings.mode ?? defaultSettings.mode,
      region: settings.region ?? defaultSettings.region,
    });
    // eslint-disable-next-line
  }, []);

  function onCloseModal() {
    setOpenModal(undefined);
  }

  return (
    <ModalContext.Provider
      value={{
        openModal,
        setOpenModal,
      }}
    >
      <div className="layout">
        <div className="layout__center">
          <Header score={score} settings={settings} setScore={setScore} />

          <Question
            settings={settings}
            score={score}
            setScore={setScore}
            setSettings={setSettings}
          />
        </div>
      </div>

      {openModal === Modals.Settings && (
        <Settings
          settings={settings}
          setSettings={setSettings}
          setScore={setScore}
          onClose={onCloseModal}
        />
      )}
      {openModal === Modals.FlagTable && (
        <FlagTable settings={settings} onClose={onCloseModal} />
      )}
      {openModal === Modals.ScoreDetails && (
        <ScoreDetails
          onClose={onCloseModal}
          score={score}
          settings={settings}
        />
      )}
      {openModal === Modals.About && <About onClose={onCloseModal} />}
    </ModalContext.Provider>
  );
};
