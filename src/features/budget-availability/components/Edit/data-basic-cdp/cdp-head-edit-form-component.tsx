import React from "react";
import useEditCdp from "../../../hooks/useEditCdp";
import {
  ButtonComponent,
  DatePickerComponent,
  FormComponent,
  InputComponent,
  TextAreaComponent,
} from "../../../../../common/components/Form";
import { Controller } from "react-hook-form";
import { EDirection } from "../../../../../common/constants/input.enum";
import { monthNames } from "../../../constants";

const CdpEditFormComponent = () => {
  const {
    control,
    errors,
    onSubmit,
    register,
    isBtnDisable,
    dataEdit,
    setMessage,
    navigate,
  } = useEditCdp();
  return (
    <div>
      <FormComponent action={onSubmit}>
        <div className="title-area">
          <label className="text-black biggest bold">Fechas</label>
        </div>
        <div className="funcionality-filters-container">
          <DatePickerComponent
            idInput="date"
            control={control}
            label={"Fecha documento"}
            errors={errors}
            classNameLabel="text-black biggest weight-500 text-required"
            className="dataPicker-basic"
            placeholder="DD/MM/YYYY"
            dateFormat="dd/mm/yy"
          />
          <Controller
            control={control}
            name={"exercise"}
            render={({ field }) => {
              return (
                <InputComponent
                  id={field.name}
                  idInput={field.name}
                  className="input-basic color-default-value"
                  typeInput="string"
                  register={register}
                  label="Vigencia"
                  classNameLabel="text-black weight-500 biggest text-required"
                  direction={EDirection.column}
                  onChange={field.onChange}
                  errors={errors}
                  disabled
                />
              );
            }}
          />
          <Controller
            control={control}
            name={"monthExercise"}
            defaultValue={monthNames[new Date(dataEdit.date).getMonth()]}
            render={({ field }) => {
              return (
                <InputComponent
                  id={field.name}
                  idInput={field.name}
                  className="input-basic color-default-value"
                  typeInput="string"
                  register={register}
                  label="Mes expedición"
                  classNameLabel="text-black weight-500 biggest text-required"
                  direction={EDirection.column}
                  onChange={field.onChange}
                  errors={errors}
                  disabled
                />
              );
            }}
          />
          <Controller
            control={control}
            name={"consecutive"}
            defaultValue={dataEdit.consecutive}
            render={({ field }) => {
              return (
                <InputComponent
                  id={field.name}
                  idInput={field.name}
                  className="input-basic color-default-value"
                  typeInput="number"
                  register={register}
                  label="No. CDP Aurora"
                  classNameLabel="text-black weight-500 biggest text-required"
                  direction={EDirection.column}
                  onChange={field.onChange}
                  errors={errors}
                  disabled
                />
              );
            }}
          />
        </div>
        <div className="funcionality-filters-container">
          <Controller
            control={control}
            name={"contractObject"}
            defaultValue={dataEdit.contractObject}
            render={({ field }) => {
              return (
                <TextAreaComponent
                  id={field.name}
                  idInput={field.name}
                  className="text-area-basic"
                  rows={2}
                  cols={33}
                  register={register}
                  label="Objeto contractual"
                  classNameLabel="text-black weight-500 biggest text-required"
                  direction={EDirection.column}
                  onChange={field.onChange}
                  errors={errors}
                />
              );
            }}
          />
        </div>
        {errors && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div className="title-button font-big">Max. 5000 caracteres</div>
          </div>
        )}
        <div className="one-filter-container">
          <Controller
            control={control}
            name={"sapConsecutive"}
            defaultValue={dataEdit.consecutiveSap}
            render={({ field }) => {
              return (
                <InputComponent
                  id={field.name}
                  idInput={field.name}
                  className="input-basic color-default-value"
                  typeInput="number"
                  register={register}
                  label="No. consecutivo CDP SAP"
                  classNameLabel="text-black weight-500 biggest"
                  direction={EDirection.column}
                  onChange={field.onChange}
                  errors={errors}
                />
              );
            }}
          />
        </div>
        <div className="funcionality-buttons-container">
          <ButtonComponent
            form="useQueryForm"
            value="Cancelar"
            type="button"
            className="button-clean-fields bold"
            action={() => {
              setMessage({
                title: "Cancelar",
                show: true,
                cancelTitle: "Cancelar",
                OkTitle: "Aceptar",
                description: (
                  <div style={{ width: "100%" }}>
                    <label>¿Estas segur@ de cancelar?</label>
                  </div>
                ),
                background: true,
                onOk: () => {
                  navigate("/gestion-financiera/cdp");
                  setMessage({});
                },
                onCancel: () => {
                  setMessage({});
                },
              });
            }}
          />
          <ButtonComponent
            className="button-main huge hover-three"
            value="Guardar"
            type="submit"
            disabled={isBtnDisable}
          />
        </div>
      </FormComponent>
    </div>
  );
};

export default CdpEditFormComponent;
