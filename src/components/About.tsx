import { Modal } from "./Modal";
import "./About.scss";

interface Props {
  onClose: () => void;
}

export const About = ({ onClose }: Props) => {
  return (
    <Modal title="About" isOpen onClose={onClose} modalClass="about-modal">
      <div className="about">
        <p>Project by James Carmichael</p>

        <a href="https://jamescarmichael.ca" target="_blank" rel="noreferrer">
          See Portfolio
        </a>
        <a
          href="https://github.com/updownupdown/flags"
          target="_blank"
          rel="noreferrer"
        >
          See on GitHub
        </a>
      </div>
    </Modal>
  );
};
