import React from "react";
import { EDirection } from "../../constants/input.enum";
import { LabelComponent } from "./label.component";

import { Control, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { IDropdownProps } from "../../interfaces/select.interface";

interface ISelectProps<T> {
  idInput: string;
  control: Control<any>;
  className?: string;
  placeholder?: string;
  data?: Array<IDropdownProps>;
  label?: string | React.JSX.Element;
  classNameLabel?: string;
  direction?: EDirection;
  children?: React.JSX.Element | React.JSX.Element[];
  errors?: any;
  disabled?: boolean;
  fieldArray?: boolean;
  filter?: boolean;
  emptyMessage?: string;
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

export function SelectComponent({
  idInput,
  control,
  className = "select-basic",
  placeholder = "Seleccione",
  data = [{} as IDropdownProps],
  label,
  classNameLabel = "text-main",
  direction = EDirection.column,
  children,
  errors = {},
  disabled,
  fieldArray,
  filter,
  emptyMessage = "Sin resultados.",
}: ISelectProps<any>): React.JSX.Element {
  if (data) {
    const seleccione: IDropdownProps = { name: "Seleccione", value: null };
    const dataSelect = data.find(
      (item) => item.name === seleccione.name && item.value === seleccione.value
    );
    if (!dataSelect) data.unshift(seleccione);
  }

  const messageError = () => {
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
      <div>
        <Controller
          name={idInput}
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={data ? data.find((row) => row.value === field.value)?.value : null}
              onChange={(e) => field.onChange(e.value)}
              options={data}
              optionLabel="name"
              placeholder={placeholder}
              className={`${className} ${messageError() ? "p-invalid" : ""}`}
              disabled={disabled}
              filter={filter}
              emptyMessage={emptyMessage}
              emptyFilterMessage={emptyMessage}
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
