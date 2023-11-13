import React, { useRef, useState } from "react";
import { useBudgeRecordCrud } from "../hook/budget-record-crud";
import { ButtonComponent, ButtonLoadingComponent, DatePickerComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import TableDataPropComponent from "../../../common/components/tableDataProp.component";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
    setContractorDocumentSt,
    setContractualObjectSt,
    setFindAmountsSt,
    isAllowSave,
    setMessage
  } = useBudgeRecordCrud();

  const navigate = useNavigate();

  const btnUploadFileRef = useRef(null);

  const [consecutiveSapSt, setConsecutiveSapSt] = useState(null)
  const [consecutiveAuroraSt, setConsecutiveAuroraSt] = useState(null)
  const [isSeachAmountActive, setIsSeachAmountActive] = useState(false)

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
                    onBlur={(e) => setContractorDocumentSt(Object(e).target.value)}
                    onChange={(value) => field.onChange(value)}
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
              <Controller
                control={control}
                name={"contractualObject"}
                render={({ field }) => (
                  <InputComponent
                    id={field.name}
                    idInput={field.name}
                    className={'input-basic medium'}
                    typeInput="text"
                    register={register}
                    label="Actividad del objeto contractual"
                    classNameLabel="text-black big bold text-required"
                    direction={EDirection.column}
                    errors={errors}
                    onBlur={(e) => setContractualObjectSt(Object(e).target.value)}
                    onChange={(value) => field.onChange(value)}
                  />
                )} />

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
                    onChange={(e) => setConsecutiveSapSt(e.target.value)}
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
                    onChange={(e) => setConsecutiveAuroraSt(e.target.value)}
                  />
                )} />
              <div>

                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>

                  <ButtonComponent
                    value="Buscar"
                    type="button"
                    className="button-main medium"
                    action={() => setFindAmountsSt({ sab: consecutiveSapSt, aurora: consecutiveAuroraSt })}
                    disabled={consecutiveSapSt?.length > 0 ? false : true}
                  />
                </div>

              </div>
            </section>
          </div>
          <br />
          {
            dataAmounts?.length > 0 && (
              <div className="card-user">
                {/* <section className="grid-form-3-container-area mt-5px"> */}
                  <TableDataPropComponent
                    ref={tableComponentRef}
                    dataTable={dataAmounts}
                    columns={tableColumns}
                    actions={tableActions}
                    isShowModal={false}
                    titleMessageModalNoResult={"No se encontraron registros"}
                    secondaryTitle="CDP"
                  />

                {/* </section> */}
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

      <div className="container-button-bot">
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
                navigate("/gestion-financiera/rp");
                setMessage({});
              },
              onCancel: () => {
                setMessage({});
              },
            });
          }}
        />

        <div className="buttons-bot">
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
            disabled={!isAllowSave}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(BudgetRecordCrudPage);
