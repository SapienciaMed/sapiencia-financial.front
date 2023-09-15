import React from "react";
import { useVinculationMGAData } from "../hooks/vinculation-mga.hook";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
  SelectComponent,
} from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useBudgetsCrudData } from "../hooks/budgets-crud.hook";
import { useParams } from "react-router-dom";
import TableComponent from "../../../common/components/table.component";
import { Controller } from "react-hook-form";

interface IAppProps {
  action: "new" | "edit";
}

function BudgetsForm({ action }: IAppProps) {
  const { id: budgetsId } = useParams();

  const {
    tableComponentRef,
    tableColumns,
    tableActions,
    vinculateActivities,
    loadTableData,
  } = useVinculationMGAData(budgetsId);
  const {
    register,
    errors,
    entitiesData,
    onSubmitEditBudgets,
    onSubmitNewBudgets,
    confirmClose,
    onCancelNew,
    onCancelEdit,
    controlRegister,
  } = useBudgetsCrudData(budgetsId, vinculateActivities, loadTableData);
  return (
    <div className="crud-page full-height">
      <div className="main-page full-height">
        <div className="card-table">
          <div className="title-area">
            <div className="text-black extra-large bold">
              {action === "new"
                ? "Crear Posición Presupuestal"
                : "Editar Posición Presupuestal "}
            </div>
          </div>

          <FormComponent
            action={action === "new" ? onSubmitNewBudgets : onSubmitEditBudgets}
            className="funds-form"
            id="budgets-form"
          >
            <div className="card-form">
              <div className="fund-data-container">
                <Controller
                  control={controlRegister}
                  name={"number"}
                  defaultValue=""
                  render={({ field }) => {
                    return (
                      <InputComponent
                        id={field.name}
                        idInput={field.name}
                        value={`${field.value}`}
                        className="input-basic"
                        typeInput="number"
                        register={register}
                        label="Posición Presupuestal"
                        classNameLabel="text-black biggest bold text-required"
                        direction={EDirection.column}
                        errors={errors}
                        onChange={field.onChange}
                        min={0}
                        disabled={action !== "new"}
                      /> 
                    )
                  }}
                />
                 <Controller
                  control={controlRegister}
                  name={"ejercise"}
                  defaultValue=""
                  render={({ field }) => {
                    return (
                      <InputComponent
                        id={field.name}
                        idInput={field.name}
                        className="input-basic"
                        typeInput="number"
                        register={register}
                        label="Ejercicio"
                        classNameLabel="text-black biggest bold text-required"
                        direction={EDirection.column}
                        errors={errors}
                        onChange={field.onChange}
                        disabled={action !== "new"}
                      /> 
                    )
                  }}
                />

                <SelectComponent
                  idInput="entity"
                  className="select-basic"
                  control={controlRegister}
                  errors={errors}
                  label="Entidad CP"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  data={entitiesData}
                  disabled={action !== "new"}
                />
              </div>
            </div>
            <div className="card-form">
              <div className="title-area">
                <div className="text-black biggest bold">Datos básicos</div>
              </div>
              <div className="fund-denomination-container">
                <Controller
                  control={controlRegister}
                  name={"denomination"}
                  defaultValue=""
                  render={({ field }) => {
                    return (
                      <InputComponent
                        id={field.name}
                        idInput={field.name}
                        value={`${field.value}`}
                        className="input-basic"
                        typeInput="text"
                        register={register}
                        label="Denominación"
                        classNameLabel="text-black biggest bold text-required"
                        direction={EDirection.column}
                        errors={errors}
                        onChange={field.onChange}
                      /> 
                    )
                  }}
                />
              </div>

              <div className="fund-denomination-container">
                <Controller
                  control={controlRegister}
                  name={"description"}
                  defaultValue=""
                  render={({ field }) => {
                    return (
                      <InputComponent
                        id={field.name}
                        idInput={field.name}
                        value={`${field.value}`}
                        className="input-basic"
                        typeInput="text"
                        register={register}
                        label="Descripción"
                        classNameLabel="text-black biggest bold text-required"
                        direction={EDirection.column}
                        errors={errors}
                        onChange={field.onChange}
                      /> 
                    )
                  }}
                />
              </div>
            </div>
            {action === "new" ? (
              <></>
            ) : (
              <div>
                <div className={`tabs-component`}>
                  <div className="tabs-selection">
                    <div className={`tab-option active`}>Vinculación MGA</div>
                    <div className={`tab-option`}>ProspeSapiencia</div>
                  </div>
                </div>
                <br />
                <div className="card-form">
                  <TableComponent
                    ref={tableComponentRef}
                    url={`${process.env.urlApiFinancial}/api/v1/vinculation-mga/get-paginated`}
                    columns={tableColumns}
                    actions={tableActions}
                    isShowModal={false}
                    secondaryTitle="Vinculación MGA"
                  />
                </div>
              </div>
            )}
            <div className="mobile-actions mobile">
              <span
                className="bold text-center button"
                onClick={() => {
                  confirmClose(action === "new" ? onCancelNew : onCancelEdit);
                }}
              >
                Cancelar
              </span>
              <ButtonComponent value="Guardar" type="submit" className="button-main huge" />
            </div>
          </FormComponent>
        </div>
      </div>
      <div className="container-button-bot">
        <div className="buttons-bot">
          <span
            className="bold text-center button"
            onClick={() => {
              confirmClose(action === "new" ? onCancelNew : onCancelEdit);
            }}
          >
            Cancelar
          </span>
          <ButtonComponent
            className="button-main huge hover-three"
            value="Guardar"
            type="submit"
            form="budgets-form"
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(BudgetsForm);
