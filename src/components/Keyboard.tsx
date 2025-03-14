import "./Keyboard.scss";
import { Select as SelectIcon } from "../icons/Select";
import { SpaceBar as SpaceBarIcon } from "../icons/SpaceBar";
import { Backspace as BackspaceIcon } from "../icons/Backspace";
import { TypingMatch } from "./Question";

interface Props {
  inputValue: string;
  setInputValue: (value: string) => void;
  pickSelectedMatch: () => void;
  typingMatches: TypingMatch[];
}

const spaceKey = "Space";
const backspaceKey = "Backspace";
const selectKey = "Select";

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", backspaceKey],
  [spaceKey, selectKey],
];

export const Keyboard = ({
  inputValue,
  setInputValue,
  pickSelectedMatch,
  typingMatches,
}: Props) => {
  return (
    <div className="keyboard-wrap">
      <div className="keyboard">
        {keys.map((row) => (
          <div key={row[0]} className="kb-row">
            {row.map((key) => (
              <button
                key={key}
                className={`kb-key kb-key--${key.toLowerCase()}`}
                disabled={key === selectKey && typingMatches.length === 0}
                onClick={() => {
                  if (key === backspaceKey) {
                    setInputValue(
                      inputValue.substring(0, inputValue.length - 1)
                    );
                  } else if (key === spaceKey) {
                    setInputValue(inputValue + " ");
                  } else if (key === selectKey) {
                    pickSelectedMatch();
                  } else {
                    setInputValue(
                      inputValue +
                        (inputValue.length === 0 ? key.toUpperCase() : key)
                    );
                  }
                }}
              >
                {key === backspaceKey ? (
                  <BackspaceIcon />
                ) : key === spaceKey ? (
                  <SpaceBarIcon />
                ) : key === selectKey ? (
                  <SelectIcon />
                ) : (
                  key
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
