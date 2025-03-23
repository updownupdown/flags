import clsx from "clsx";
import "./Toggle.scss";
import React from "react";

export interface ToggleGroupProps {
  label: string;
  children: React.ReactNode;
  isVertical?: boolean;
  className?: string;
}

export const ToggleGroup = ({
  label,
  children,
  isVertical,
  className,
}: ToggleGroupProps) => {
  return (
    <div
      className={clsx(
        "toggle-group",
        className,
        isVertical ? "toggle-group--vertical" : "toggle-group--horizontal"
      )}
    >
      <span className="toggle-label">{label}</span>
      <div className="toggle-buttons">{children}</div>
    </div>
  );
};

export interface ToggleProps {
  label: string;
  isCurrent: boolean;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Toggle = ({
  label,
  isCurrent,
  onClick,
  disabled,
  children,
}: ToggleProps) => {
  return (
    <button
      disabled={disabled}
      className={clsx("toggle", isCurrent && "toggle--current")}
      onClick={() => {
        !isCurrent && onClick();
      }}
    >
      {children ?? label}
    </button>
  );
};
