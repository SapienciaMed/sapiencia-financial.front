import React from "react";
import { useWidth } from "../../../common/hooks/use-width";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  ButtonComponent,
  DatePickerComponent,
  FormComponent,
  InputComponent,
  SelectComponent,
  TextAreaComponent,
} from "../../../common/components/Form";
import { Controller } from "react-hook-form";
import { useSearchCdp } from "../hooks/useSearchCdp";
import { EDirection } from "../../../common/constants/input.enum";
import TableComponent from "../../../common/components/table.component";

const CdpPage = () => {
  const { width } = useWidth();
  const {
    control,
    register,
    onSubmit,
    isBtnDisable,
    errors,
    reset,
    showTable,
    setShowTable,
    tableComponentRef,
    tableActionsCdp,
    tableColumnsCdp,
    navigate,
    arraySelect,
    initialDate,
    endDate,
  } = useSearchCdp();

  return (
    <div className="main-page">
      <div className="card-table gap-0">
        <section className="title-area">
          <div className="text-black weight-500 extra-large">Consultar CDP</div>
          <div
            className={`${
              width < 800
                ? "display-justify-space-between-pac"
                : "display-align-flex-end"
            } gap-0 gap-05`}
          >
            <div
              className="title-button font-big"
              onClick={() => navigate("./create")}
            >
              Crear CDP
              <AiOutlinePlusCircle />
            </div>
          </div>
        </section>
        <section className="card-user">
          <FormComponent action={onSubmit}>
            <div className="title-area">
              <label className="text-black biggest bold">Consultar CDP</label>
            </div>
            <div className="funcionality-filters-container">
              <Controller
                control={control}
                name={"dateOfCdp"}
                defaultValue={String(new Date().getFullYear())}
                render={({ field }) => {
                  return (
                    <InputComponent
                      id={field.name}
                      idInput={field.name}
                      className="input-basic color-default-value"
                      typeInput="number"
                      register={register}
                      label="Vigencia"
                      classNameLabel="text-black weight-500 biggest text-required"
                      direction={EDirection.column}
                      onChange={field.onChange}
                      errors={errors}
                    />
                  );
                }}
              />
              <Controller
                control={control}
                name={"consecutiveSap"}
                render={({ field }) => {
                  return (
                    <InputComponent
                      id={field.name}
                      idInput={field.name}
                      className="input-basic color-default-value"
                      typeInput="number"
                      register={register}
                      label="Consecutivo CDP SAP"
                      classNameLabel="text-black weight-500 biggest"
                      direction={EDirection.column}
                      onChange={field.onChange}
                      errors={errors}
                    />
                  );
                }}
              />
              <Controller
                control={control}
                name={"consecutiveAurora"}
                render={({ field }) => {
                  return (
                    <InputComponent
                      id={field.name}
                      idInput={field.name}
                      className="input-basic color-default-value"
                      typeInput="number"
                      register={register}
                      label="Consecutivo CDP Aurora"
                      classNameLabel="text-black weight-500 biggest"
                      direction={EDirection.column}
                      onChange={field.onChange}
                      errors={errors}
                    />
                  );
                }}
              />
            </div>
            <div className="funcionality-filters-container">
              <SelectComponent
                idInput="projectId"
                control={control}
                className="select-basic"
                label="Proyecto"
                classNameLabel="text-black weight-500 biggest"
                placeholder={"Seleccionar"}
                data={arraySelect?.projectId}
                direction={EDirection.column}
                filter={true}
                isValidateName={false}
                errors={errors}
              />
              <SelectComponent
                idInput="fundId"
                control={control}
                label="Fondo"
                className="select-basic"
                classNameLabel="text-black weight-500 biggest"
                placeholder={"Seleccionar"}
                data={arraySelect?.fundId}
                direction={EDirection.column}
                filter={true}
                isValidateName={false}
                errors={errors}
              />
              <SelectComponent
                idInput="pospreId"
                control={control}
                label="Pospre"
                className="select-basic"
                classNameLabel="text-black weight-500 biggest"
                placeholder={"Seleccionar"}
                filter={true}
                isValidateName={false}
                data={arraySelect?.pospreId}
                direction={EDirection.column}
                errors={errors}
              />
            </div>
            <div className="two-filters-container">
              <DatePickerComponent
                idInput="initialDate"
                control={control}
                label={"Fecha documento desde"}
                errors={errors}
                classNameLabel="text-black biggest weight-500"
                className="dataPicker-basic"
                placeholder="DD/MM/YYYY"
                dateFormat="dd/mm/yy"
                maxDate={new Date(endDate)}
              />
              <DatePickerComponent
                idInput="endDate"
                control={control}
                label={"Fecha documento hasta"}
                errors={errors}
                classNameLabel="text-black biggest weight-500"
                className="dataPicker-basic"
                placeholder="DD/MM/YYYY"
                dateFormat="dd/mm/yy"
                minDate={new Date(initialDate)}
              />
            </div>
            <div className="funcionality-filters-container">
              <Controller
                control={control}
                name={"contractObject"}
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
                      classNameLabel="text-black weight-500 biggest"
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
                <div className="title-button font-big">
                  Max. 5000 caracteres
                </div>
              </div>
            )}
            <div className="funcionality-buttons-container">
              <ButtonComponent
                form="useQueryForm"
                value="Limpiar campos"
                type="button"
                className="button-clean-fields bold"
                action={() => {
                  reset();
                  if (showTable) {
                    tableComponentRef.current.emptyData();
                    setShowTable(false);
                  }
                }}
              />
              <ButtonComponent
                className="button-main huge hover-three"
                value="Buscar"
                type="submit"
                disabled={!isBtnDisable}
              />
            </div>
          </FormComponent>
        </section>
        {showTable && (
          <div className="card-user mt-2rem">
            <TableComponent
              ref={tableComponentRef}
              url={`${process.env.urlApiFinancial}/api/v1/cdp/search-cdps`}
              columns={tableColumnsCdp}
              actions={tableActionsCdp}
              isShowModal={true}
              titleMessageModalNoResult="No hay resultados"
              secondaryTitle="CDP"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CdpPage;
