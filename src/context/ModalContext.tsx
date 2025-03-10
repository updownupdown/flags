import { createContext } from "react";
import { ValueOf } from "../utils/utils";

export const Modals = {
  Settings: "Settings",
  About: "About",
  FlagTable: "Flag Table",
  ScoreDetails: "ScoreD etails",
} as const;

export type ModalType = ValueOf<typeof Modals>;

interface IModalContext {
  openModal: ModalType | undefined;
  setOpenModal: (modal: ModalType | undefined) => void;
}

export const ModalContext = createContext<IModalContext>({
  openModal: undefined,
  setOpenModal: () => {},
});
