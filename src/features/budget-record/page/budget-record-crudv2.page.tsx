import React, { useEffect, useRef, useState } from "react";
import { ButtonComponent, ButtonLoadingComponent, DatePickerComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import TableDataPropComponent from "../../../common/components/tableDataProp.component";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useBudgeRecordCrudv2 } from "../hook/budget-record-crudv2";

function BudgetRecordCrudPagev2() {
  const {
    control,
    errors,
    register,
    onSubmitRP,
    tableComponentRef,
    tableColumns,
    tableActions,
    setMessage,
    componentsData,
    dependeciesData,
    activityObjectContractData,
    dataAmounts,
    isBtnSearchAmountsSt,
    setIsBtnSearchAmountsSt,
    consecutiveCdpSap,
    isAllowSave
  } = useBudgeRecordCrudv2();

  const navigate = useNavigate();
  const btnUploadFileRef = useRef(null);

  return (
    <div className="crud-page">
      <div className="main-page full-height">
        <p className="text-black extra-large">Crear RP</p>
        <FormComponent
          action={onSubmitRP}
          id="form-pac"
          className="form-pac"
        >
          <div className="card-user">
            <section className="grid-form-3-container-area mt-5px"><h3>Tercero</h3></section>
            <section className="grid-form-3-container-area mt-5px">

              <SelectComponent
                idInput="supplierType"
                control={control}
                label="Tipo"
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={"Seleccionar"}
                data={[
                  { id: 1, name: "Contratista", value: "Contratista" },
                  { id: 2, name: "Acreedor", value: "Acreedor" }
                ]}
                filter={true}
                errors={errors}
                direction={EDirection.column}
              />

              <Controller
                control={control}
                name={"contractorDocument"}
                render={({ field }) => (
                  <InputComponent
                    id={field.name}
                    idInput={field.name}
                    className="input-basic medium"
                    typeInput="text"
                    register={register}
                    label="Numero de documento"
                    classNameLabel="text-black big bold text-required"
                    direction={EDirection.column}
                    errors={errors}
                    onBlur={(value) => field.onChange(value)}
                  />
                )} />
              <Controller
                control={control}
                name={"supplierName"}
                render={({ field }) => (
                  <InputComponent
                    id={field.name}
                    idInput={field.name}
                    className="input-basic medium"
                    typeInput="text"
                    register={register}
                    label="Nombre"
                    classNameLabel="text-black big bold text-required"
                    direction={EDirection.column}
                    disabled={true}
                    errors={errors}
                    onChange={(value) => field.onChange(value)}
                  />
                )} />
            </section>

            <section className="grid-form-3-container-area mt-5px">
              <DatePickerComponent
                idInput="documentDate"
                control={control}
                label={"Fecha documento"}
                errors={errors}
                classNameLabel="text-black biggest bold text-required"
                className="dataPicker-basic medium"
                placeholder="DD/MM/YYYY"
                dateFormat="dd/mm/yy"
              />
              <DatePickerComponent
                idInput="dateValidity"
                control={control}
                label={"Fecha vencimiento"}
                errors={errors}
                classNameLabel="text-black biggest bold"
                className="dataPicker-basic medium"
                placeholder="DD/MM/YYYY"
                dateFormat="dd/mm/yy"
              //minDate={new Date(startDate)}
              />
            </section>
            <section className="grid-form-3-container-area mt-5px"><h3>Dependencia</h3></section>
            <section className="grid-form-3-container-area mt-5px">
              <SelectComponent
                idInput="dependencyId"
                control={control}
                label="Dependencia"
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={"Seleccionar"}
                data={dependeciesData}
                filter={true}
                errors={errors}
                direction={EDirection.column}
              />
              <SelectComponent
                idInput="contractualObject"
                control={control}
                label="Actividad del objeto contractual"
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={"Seleccionar"}
                data={activityObjectContractData}
                filter={true}
                errors={errors}
                direction={EDirection.column}
              />

              <SelectComponent
                idInput="componentId"
                control={control}
                label="Componente"
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={"Seleccionar"}
                data={componentsData}
                filter={true}
                errors={errors}
                direction={EDirection.column}
              />

            </section>
          </div>
          <br />
          <div className="card-user">
            <p className="text-black extra-large">Vincular CDP</p>
            <section className="grid-form-3-container-area mt-5px">
              <Controller
                control={control}
                name={"consecutiveCdpSap"}
                render={({ field }) => (
                  <InputComponent
                    id={field.name}
                    idInput={field.name}
                    className="input-basic medium"
                    typeInput="number"
                    register={register}
                    label="Consecutivo CDP SAP"
                    classNameLabel="text-black big bold text-required"
                    direction={EDirection.column}
                    onChange={(value) => field.onChange(value)}
                    errors={errors}
                  />
                )} />

              <Controller
                control={control}
                name={"consecutiveCdpAurora"}
                render={({ field }) => (
                  <InputComponent
                    id={field.name}
                    idInput={field.name}
                    className="input-basic medium"
                    typeInput="number"
                    register={register}
                    label="Consecutivo CDP Aurora"
                    classNameLabel="text-black big bold"
                    direction={EDirection.column}
                    errors={errors}
                    onChange={(value) => field.onChange(value)}
                  />
                )} />
              <div>

                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                  <ButtonComponent
                    value="Buscar"
                    type="button"
                    className="button-main medium"
                    action={() => setIsBtnSearchAmountsSt(!isBtnSearchAmountsSt)}
                    disabled={consecutiveCdpSap > 0 ? false : true}
                  />
                </div>

              </div>
            </section>
          </div>
          <br />
          {
            dataAmounts?.length > 0 && (
              <div className="card-user">

                <TableDataPropComponent
                  ref={tableComponentRef}
                  dataTable={dataAmounts}
                  columns={tableColumns}
                  actions={tableActions}
                  isShowModal={false}
                  titleMessageModalNoResult={"No se encontraron registros"}
                  secondaryTitle="CDP"
                />
              </div>
            )
          }

          <input
            type="submit"
            style={{ display: "none" }}
            ref={btnUploadFileRef}
          />
        </FormComponent>
      </div>
      {
        isAllowSave && (
          <div className="funcionality-buttons-container">
            <span
              className="bold text-center button"
              onClick={() => {
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
                    navigate("/gestion-financiera/rp");
                    setMessage({});
                  },
                  onCancel: () => {
                    setMessage({});
                  },
                });
              }
              }
              style={{
                marginRight: '10px',
              }}
            >
              Cancelar
            </span>

            <div className="buttons-bot">
              <ButtonLoadingComponent
                className="button-main huge hover-three"
                value="Guardar"
                form="form-pac"
                type="button"
                action={() => {
                  btnUploadFileRef.current.click();
                }}
                disabled={!isAllowSave}
              />
            </div>
          </div>
        )
      }

    </div>
  );
}

export default React.memo(BudgetRecordCrudPagev2);