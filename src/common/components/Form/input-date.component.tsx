import React from "react";
import { EDirection } from "../../constants/input.enum";
import { LabelComponent } from "./label.component";
import { Controller, Control } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { IoCalendarOutline } from "react-icons/io5";

interface IDateProps<T> {
  idInput: string;
  control: Control<any>;
  dateFormat: string;
  className?: string;
  placeholder?: string;
  label?: string | React.JSX.Element;
  classNameLabel?: string;
  direction?: EDirection;
  children?: React.JSX.Element | React.JSX.Element[];
  errors?: any;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  fieldArray?: boolean;
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

export function DatePickerComponent({
  idInput,
  className = "dataPicker-basic",
  placeholder = "DD/MM/AAAA",
  label,
  classNameLabel = "text-main",
  direction = EDirection.column,
  children,
  errors = {},
  maxDate,
  minDate,
  fieldArray,
  control,
  dateFormat,
  disabled,
}: IDateProps<any>): React.JSX.Element {
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
      <div>
        <Controller
          name={idInput}
          control={control}
          render={({ field }) => (
            <Calendar
              id={field.name}
              mask="99/99/9999"
              dateFormat={dateFormat}
              placeholder={placeholder}
              className={`${className} ${messageError() ? "p-invalid" : ""}`}
              showIcon
              icon={
                <span>
                  <IoCalendarOutline />
                </span>
              }
              showButtonBar
              value={field.value && new Date(field.value)}
              onChange={(e) => field.onChange(e.value)}
              inputStyle={{ borderRight: "none" }}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
            />
          )}
        />

        {messageError() && <span className="icon-error"></span>}
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
