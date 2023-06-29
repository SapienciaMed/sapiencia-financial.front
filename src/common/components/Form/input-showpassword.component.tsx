import React, { SyntheticEvent, useState } from "react";
import { EDirection } from "../../constants/input.enum";
import { LabelComponent } from "./label.component";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface IInputProps<T> {
  idInput: string;
  register: UseFormRegister<T>;
  className?: string;
  placeholder?: string;
  value?: string;
  label?: string;
  classNameLabel?: string;
  direction?: EDirection;
  children?: React.JSX.Element | React.JSX.Element[];
  errors?: FieldErrors<any>;
}

function LabelElement({ label, idInput, classNameLabel }): React.JSX.Element {
  if (!label) return <></>;
  return (
    <LabelComponent
      htmlFor={idInput}
      className={classNameLabel}
      value={label}
    />
  );
}

export function InputShowPassword({
  idInput,
  register,
  className = "input-basic",
  placeholder,
  value,
  label,
  classNameLabel = "text-main",
  direction = EDirection.column,
  children,
  errors,
}: IInputProps<any>): React.JSX.Element {
  const [viewPassword, showPassword] = useState<boolean>(false);

  const handleShowPassword = (event: SyntheticEvent) => {
    event.preventDefault();
    showPassword(!viewPassword);
  };

  return (
    <div className={direction}>
      <LabelElement
        label={label}
        idInput={idInput}
        classNameLabel={classNameLabel}
      />
      <div>
        <div className="show-password">
          <input
            {...register(idInput)}
            type={viewPassword ? "text" : "password"}
            id={idInput}
            name={idInput}
            className={errors[idInput] ? `${className} error` : className}
            placeholder={placeholder}
          />

          {viewPassword ? (
            <AiOutlineEyeInvisible
              className="icon-showPassword pointer"
              color="#a71989"
              fontSize={"22px"}
              onClick={handleShowPassword}
            />
          ) : (
            <AiOutlineEye
              className="icon-showPassword pointer"
              color="#a71989"
              fontSize={"22px"}
              onClick={handleShowPassword}
            />
          )}

          {/* <button
            className="button-show_password bold"
            onClick={handleShowPassword}
          >
            Ver
          </button> */}
        </div>
      </div>
      {errors[idInput]?.message && (
        <p className="error-message bold not-margin-padding">
          {errors[idInput]?.message}
        </p>
      )}
      {children}
    </div>
  );
}
