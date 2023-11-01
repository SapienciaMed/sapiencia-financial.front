import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { EDirection } from "../../constants/input.enum";
import { LabelComponent } from "./label.component";

import { MdOutlineError } from "react-icons/md";

interface IInputProps<T> {
  idInput: string;
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
  rows?: number;
  cols?: number;
  optionsRegister?: {};
  characters?: number;
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

function TextAreaElement({
  idInput,
  className,
  placeholder,
  register,
  value,
  disabled,
  onChange,
  defaultValue,
  id,
  rows,
  cols,
  optionsRegister = {},
  setCount
}): React.JSX.Element {
  return (
    <textarea
      {...(register ? register(idInput, optionsRegister) : {})}
      id={id}
      name={idInput}
      className={className}
      placeholder={placeholder}
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={(event) => {
        onChange(event);
        setCount(event.target.value.length);
      }}
      value={value}
      rows={rows}
      cols={cols}
    />
  );
}

export function TextAreaCountComponent({
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
  disabled,
  onChange,
  defaultValue,
  id,
  fieldArray,
  rows,
  cols,
  optionsRegister = {},
  characters
}: IInputProps<any>): React.JSX.Element {
  const [count, setCount] = useState(0);
  const messageError = () => {
    const keysError = idInput.split(".");
    let errs = errors;
    if (fieldArray) {
      const errorKey = `${keysError[0]}[${keysError[1]}].${keysError[2]}`;
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
        <TextAreaElement
          idInput={idInput}
          className={messageError() ? `${className} error` : className}
          placeholder={placeholder}
          register={register}
          value={value}
          disabled={disabled}
          onChange={onChange}
          defaultValue={defaultValue}
          id={id}
          rows={rows}
          cols={cols}
          optionsRegister={optionsRegister}
          setCount={setCount}
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
      {characters > 0 ? <CharactersComponent characters={characters} count={count} /> : <></>}
      {children}
    </div>
  );
}

const CharactersComponent = ({characters, count}) => {
  return (
    count > 0 ? <label className="label-max-textarea">{characters-count} caracteres restantes</label> : <label className="label-max-textarea">Máx. {characters} caracteres</label>
  )
}
