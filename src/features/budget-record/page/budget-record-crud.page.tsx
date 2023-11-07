import React, { useEffect, useRef, useState } from "react";
import { useBudgeRecordCrud } from "../hook/budget-record-crud";
import { ButtonComponent, ButtonLoadingComponent, DatePickerComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import TableDataPropComponent from "../../../common/components/tableDataProp.component";

function BudgetRecordCrudPage() {
  const {
    errors,
    onSubmitRP,
    register,
    control,
    isVisibleTable,
    tableComponentRef,
    tableColumns,
    isLoading,
    dataAmounts,
    tableActions,
    componentsData,
    dependeciesData,
    contractorsData,
    creditorsData
  } = useBudgeRecordCrud();

  const btnUploadFileRef = useRef(null);


  const [isVisibleErrors, setIsVisibleErrors] = useState(false);

  const [dataTableSt, setDataTableSt] = useState<any>();

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


              <InputComponent
                idInput="contractorDocument"
                className="input-basic medium"
                typeInput="text"
                register={register}
                label="Numero de documento"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                errors={errors}
              />
              <InputComponent
                idInput="supplierName"
                className="input-basic medium"
                typeInput="text"
                register={register}
                label="Nombre"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                disabled={true}
                errors={errors}
              />

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
                classNameLabel="text-black biggest bold text-required"
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

              <InputComponent
                idInput="contractualObject"
                className="input-basic medium"
                typeInput="text"
                register={register}
                label="Actividad del objeto contractual"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                errors={errors}
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
              <InputComponent
                idInput="exercise"
                className="input-basic medium"
                typeInput="number"
                register={register}
                label="Consecutivo CDP SAP"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                errors={errors}
              />
              <InputComponent
                idInput="exercise"
                className="input-basic medium"
                typeInput="number"
                register={register}
                label="Consecutivo CDP Aurora"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                errors={errors}
              />
              <div>

                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                  <ButtonComponent
                    value="Buscar"
                    type="button"
                    className="button-main medium"
                  />
                </div>

              </div>
            </section>
          </div>
          <br />
          <div className="card-user">
            <section className="grid-form-3-container-area mt-5px">
              <TableDataPropComponent
                ref={tableComponentRef}
                dataTable={dataAmounts}
                columns={tableColumns}
                actions={tableActions}
                isShowModal={false}
                titleMessageModalNoResult={"No se encontraron registros"}
                secondaryTitle="CDP"
              />

            </section>
          </div>


          <input
            type="submit"
            style={{ display: "none" }}
            ref={btnUploadFileRef}
          />
        </FormComponent>
        <br />
        {isVisibleErrors && dataTableSt.length > 0 && (
          <div
            className={
              !isVisibleTable ? "card-user isVisible" : "card-user isNotVisible"
            }
          >

          </div>
        )}
      </div>

      <div className="container-button-bot">
        <div className="buttons-bot">
          {/* <span
            className="bold text-center button"
          onClick={() => {
            confirmClose(action === "new" ? onCancelNew : onCancelEdit, action);
          }}
          >
            Cancelar
          </span> */}
          {/* <ButtonComponent
              className="button-main huge hover-three"
              value="Guardar"
              type="submit"
              form="funds-form"
              disabled={true}
            /> */}

          <ButtonLoadingComponent
            className="button-main huge hover-three"
            value="Guardar"
            form="form-pac"
            type="button"
            action={() => {
              btnUploadFileRef.current.click();
              /* setIsUploadFileSt(false) */
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(BudgetRecordCrudPage);
