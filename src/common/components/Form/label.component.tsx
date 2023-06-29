import React from "react";

interface ILabelProps {
  value: string;
  className?: string;
  htmlFor?: string;
}

export function LabelComponent({
  value,
  className = "labelcss",
  htmlFor,
}: ILabelProps): React.JSX.Element {
  return (
    <label htmlFor={htmlFor} className={className}>
      {value}
    </label>
  );
}
