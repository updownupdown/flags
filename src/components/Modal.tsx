import React, { useEffect, useRef } from "react";
import { Close as CloseIcon } from "../icons/Close";
import "./Modal.scss";
import clsx from "clsx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  modalClass?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  modalClass,
}: Props) => {
  const ref = useRef<HTMLDialogElement>(null);

  window.addEventListener("click", (event) => {
    const dialog = document.querySelector("dialog");
    if (event.target === dialog) {
      onClose();
    }
  });

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog ref={ref} onCancel={onClose} className={clsx("modal", modalClass)}>
      <div className="modal-header">
        <h2>{title}</h2>
        <button className="dialog-close-btn" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className="modal-content">{children}</div>
    </dialog>
  );
};
