import { Modal } from "./Modal";
import "./About.scss";

interface Props {
  onClose: () => void;
}

export const About = ({ onClose }: Props) => {
  return (
    <Modal title="About" isOpen onClose={onClose} modalClass="about-modal">
      <div className="about">
        <h3>
          Project by <b>James Carmichael</b>
        </h3>

        <div className="about-links">
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
      </div>
    </Modal>
  );
};
