import React from "react";
import { EDirection } from "../../constants/input.enum";
import { LabelComponent } from "./label.component";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { MdOutlineError } from "react-icons/md";

interface IInputProps<T> {
  idInput: string;
  typeInput: string;
  register?: UseFormRegister<T>;
  className?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  label?: string | React.JSX.Element;
  classNameLabel?: string;
  direction?: EDirection;
  children?: React.JSX.Element | React.JSX.Element[];
  errors?: any;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  fieldArray?: boolean;
  optionsRegister?: {};
  minValue?:number;
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

function InputElement({
  typeInput,
  idInput,
  className,
  placeholder,
  register,
  value,
  disabled,
  onChange,
  defaultValue,
  id,
  optionsRegister,
  minValue
}): React.JSX.Element {
  return (
    <input
      {...register(idInput)}
      name={idInput}
      type={typeInput}
      className={className}
      placeholder={placeholder}
      defaultValue={value}
      onChange={onChange}
      disabled={disabled}
      min={minValue}
    />
  );
}

export function InputComponent({
  idInput,
  typeInput,
  register,
  className = "input-basic",
  placeholder,
  value,
  label,
  classNameLabel = "text-main",
  direction = EDirection.column,
  children,
  errors,
  disabled,
  onChange,
  defaultValue,
  id,
  fieldArray,
  optionsRegister = {},
  minValue
}: IInputProps<any>): React.JSX.Element {

  return (
    <div
      className={
        errors[idInput]?.message  ? `${direction} container-icon_error` : direction
      }
    >
      <LabelElement
        label={label}
        idInput={idInput}
        classNameLabel={classNameLabel}
      />
      <div className="flex-container-input">
        <InputElement
          typeInput={typeInput}
          idInput={idInput}
          className={errors[idInput]?.message  ? `${className} error` : className}
          placeholder={placeholder}
          register={register}
          value={value}
          disabled={disabled}
          onChange={onChange}
          defaultValue={defaultValue}
          id={id}
          optionsRegister={optionsRegister}
          minValue={minValue}
        />
        {errors[idInput]?.message && (
          <MdOutlineError
            className="icon-error"
            fontSize={"22px"}
            color="#ff0000"
          />
        )}
      </div>
      {errors[idInput]?.message  && (
        <p className="error-message bold not-margin-padding">
          {errors[idInput]?.message }
        </p>
      )}
      {children}
    </div>
  );
}
