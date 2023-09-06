import React, { useState } from "react";
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
  max?: number;
  min?:number;
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
  onChange: onChangeProp,
  defaultValue,
  id,
  optionsRegister,
  max,
  min
}): React.JSX.Element {
  
  
  return (
    <input
      {...register(idInput)}
      id={id}
      name={idInput}
      type={typeInput}
      className={className}
      placeholder={placeholder}
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={onChangeProp}
      value={value}
      max={max}
      min={min}
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
  max,
  min
}: IInputProps<any>): React.JSX.Element {
  const messageError = () => {
    console.log({errors})
    const keysError = idInput.split(".");
    let errs = errors;
    if (fieldArray) {
      const errorKey = `${keysError[0]}.${keysError[1]}`;
      return errors[errorKey]?.message;
    } else {
      for (let key of keysError) {
        errs = errs?.[key];
        if (!errs) {
          break;
        }
      }
      return errs?.message ?? null;
    }
  };

  
  return (
    <div
      className={
        messageError() ? `${direction} container-icon_error` : direction
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
          className={messageError() ? `${className} error` : className}
          placeholder={placeholder}
          register={register}
          value={value}
          disabled={disabled}
          onChange={onChange}
          defaultValue={defaultValue}
          id={id}
          optionsRegister={optionsRegister}
          max={max}
          min={min}
        />
        {messageError() && (
          <MdOutlineError
            className="icon-error"
            fontSize={"22px"}
            color="#ff0000"
          />
        )}
      </div>
      {messageError() && (
        <p className="error-message bold not-margin-padding">
          {messageError()}
        </p>
      )}
      {children}
    </div>
  );
}
