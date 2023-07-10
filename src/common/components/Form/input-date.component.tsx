import React, { ChangeEvent, useEffect, useState } from "react";
import { EDirection } from "../../constants/input.enum";
import { LabelComponent } from "./label.component";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { IoCalendarOutline } from "react-icons/io5";
import { DateTime } from "luxon";

interface IDateProps<T> {
  id?: string;
  idInput: string;
  register?: UseFormRegister<T>;
  className?: string;
  placeholder?: string;
  value?: string | Date | Date[];
  label?: string | React.JSX.Element;
  classNameLabel?: string;
  direction?: EDirection;
  children?: React.JSX.Element | React.JSX.Element[];
  errors?: FieldErrors<any>;
  setValueRegister?: UseFormSetValue<T>;
  setValue?: React.Dispatch<any>;
  stateProps?: {
    state: any;
    setState: React.Dispatch<any>;
  };
  disabled?: boolean;
  onchange?: (e: string | Date | Date[]) => void;
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

function CalendarElement({
  idInput,
  id,
  className,
  placeholder,
  value,
  register,
  setValueRegister,
  setValue,
  stateProps,
  disabled,
  onchange,
}: IDateProps<any>): React.JSX.Element {
  const [date, setDate] = useState<DateTime>(value);
  const registerProp = register ? register : () => {};

  useEffect(() => {
    const setValueRegisterProp = setValueRegister ? setValueRegister : () => {};
    setValueRegisterProp(idInput, date);
    console.log(date);
  }, [date]);
  return (
    <div {...registerProp(idInput)}>
      <Calendar
        id={id}
        mask="99/99/9999"
        dateFormat="dd/mm/yy"
        name={idInput}
        value={date}
        onChange={(e) => {
          if (setValue) {
            setValue(e.value);
          }
          if (onchange) {
            onchange(e.value);
          } else {
            setDate(e.value);
          }
        }}
        placeholder={placeholder}
        className={className}
        showIcon
        icon={
          <span>
            <IoCalendarOutline />
          </span>
        }
        showButtonBar
        disabled={disabled}
        inputStyle={{ borderRight: "none" }}
      />
    </div>
  );
}

export function DatePickerComponent({
  id,
  idInput,
  register,
  setValueRegister,
  className = "dataPicker-basic",
  placeholder = "DD/MM/AAAA",
  value = null,
  label,
  classNameLabel = "text-main",
  direction = EDirection.column,
  children,
  errors = {},
  stateProps,
  setValue,
  disabled,
  onchange,
}: IDateProps<any>): React.JSX.Element {
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
        <CalendarElement
          id={id}
          idInput={idInput}
          className={className}
          setValue={setValue}
          placeholder={placeholder}
          value={value}
          register={register}
          setValueRegister={setValueRegister}
          stateProps={stateProps}
          disabled={disabled}
          onchange={onchange}
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
