import { calculateAverage } from "../utils/utils";
import "./Header.scss";
import { ISettings } from "./Settings";
import { Menu } from "./Menu";
import { Menu as MenuIcon } from "../icons/Menu";
import { useContext, useState } from "react";
import { ModalContext, Modals } from "../context/ModalContext";
import { Score } from "./Score";

interface Props {
  score: Score;
  settings: ISettings;
  setScore: (score: Score) => void;
}

export const Header = ({ score, settings, setScore }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setOpenModal } = useContext(ModalContext);

  return (
    <div className="header">
      <div className="header__left">
        <h2>World Flags Quiz</h2>
        <div className="header__left__info">
          <div className="header__left__info__settings">
            <span>Mode:</span>
            <button onClick={() => setOpenModal(Modals.Settings)}>
              {settings.mode} ({settings.difficulty})
            </button>
          </div>
          <div className="header__left__info__win">
            <span>Win:</span>
            <button onClick={() => setOpenModal(Modals.ScoreDetails)}>
              {Math.round(calculateAverage(score.correct, score.incorrect))}%
            </button>
          </div>
        </div>
      </div>

      <button
        className="header-menu-btn"
        onClick={() => setIsMenuOpen(true)}
        disabled={isMenuOpen}
      >
        <MenuIcon />
      </button>

      {isMenuOpen && (
        <Menu onClose={() => setIsMenuOpen(false)} setScore={setScore} />
      )}
    </div>
  );
};
