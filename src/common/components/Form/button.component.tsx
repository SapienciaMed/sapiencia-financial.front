import React, { SyntheticEvent } from "react";

interface ILabelProps {
  value: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  action?: Function;
  id?: string;
  form?: string;
  disabled?: boolean;
}

export function ButtonComponent({
  value,
  type = "submit",
  className = "button-main",
  action = () => {},
  id,
  form,
  disabled
}: ILabelProps): React.JSX.Element {
  const handleButtonClick = (event: SyntheticEvent) => {
    if (type !== "submit") event.preventDefault();
    action();
  };

  return (
    <button
      type={type}
      id={id}
      form={form}
      className={className}
      onClick={handleButtonClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
}
