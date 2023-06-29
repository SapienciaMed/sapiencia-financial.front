import React from "react";

interface IFormProps {
  action: any;
  children: React.JSX.Element | React.JSX.Element[];
  className?: string;
  id?: string;
}

export function FormComponent({
  action,
  className,
  children,
  id,
}: IFormProps): React.JSX.Element {
  return (
    <form className={className} id={id} onSubmit={action}>
      {children}
    </form>
  );
}
