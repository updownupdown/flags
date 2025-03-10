import { useContext, useEffect, useRef } from "react";
import "./Menu.scss";
import { ModalContext, Modals } from "../context/ModalContext";
import { defaultScore, Score } from "./Score";

interface Props {
  onClose: () => void;
  setScore: (score: Score) => void;
}

export const Menu = ({ onClose, setScore }: Props) => {
  const { setOpenModal } = useContext(ModalContext);

  return (
    <div className="menu-wrap">
      <div className="menu-backdrop" onClick={onClose} />

      <div className="menu">
        <div className="menu__buttons">
          <button
            onClick={() => {
              onClose();
              setOpenModal(Modals.Settings);
            }}
          >
            Select difficulty
          </button>
          <button
            onClick={() => {
              onClose();
              setOpenModal(Modals.FlagTable);
            }}
          >
            Flags list
          </button>
          <button
            onClick={() => {
              onClose();
              setOpenModal(Modals.ScoreDetails);
            }}
          >
            Score details
          </button>
          <button
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
          <button
            onClick={() => {
              onClose();
              setOpenModal(Modals.About);
            }}
          >
            About
          </button>
        </div>
      </div>
    </div>
  );
};
