import React from "react";
import { EDirection } from "../../constants/input.enum";
import { LabelComponent } from "./label.component";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface IInputProps<T> {
  idInput: string;
  typeInput: string;
  register: UseFormRegister<T>;
  className?: string;
  placeholder?: string;
  value?: string;
  label?: string;
  classNameLabel?: string;
  direction?: EDirection;
  children?: React.JSX.Element | React.JSX.Element[];
  errors?: FieldErrors<any>;
  iconLegend?: React.JSX.Element | string;
  containerClassname?:string;
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
  iconLegend,
  containerClassname
}): React.JSX.Element {
  return (
    <div className={containerClassname? `container-input-group ${containerClassname}` : "container-input-group"}>
    <span className="input-group-addon text-black bold">{iconLegend}</span>
    <input
      {...register(idInput)}
      name={idInput}
      type={typeInput}
      className={className}
      placeholder={placeholder}
      defaultValue={value}
    />
    </div>
  );
}

export function InputGroupComponent({
  idInput,
  typeInput,
  register,
  className = "input-group-basic",
  placeholder,
  value,
  label,
  classNameLabel = "text-main",
  direction = EDirection.column,
  children,
  errors,
  iconLegend,
  containerClassname,
}: IInputProps<any>): React.JSX.Element {
  return (
    <div
      className={
        errors[idInput]?.message
          ? `${direction} container-icon_error`
          : direction
      }
    >
      <LabelElement
        label={label}
        idInput={idInput}
        classNameLabel={classNameLabel}
      />
      <div>
        <InputElement
          typeInput={typeInput}
          idInput={idInput}
          className={errors[idInput] ? `${className} error` : className}
          placeholder={placeholder}
          register={register}
          value={value}
          iconLegend={iconLegend}
          containerClassname = {containerClassname}
        />
        {errors[idInput]?.message && <span className="icon-error"></span>}
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
