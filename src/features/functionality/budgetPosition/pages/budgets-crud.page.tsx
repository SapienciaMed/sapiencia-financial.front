import React from "react";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
  SelectComponent,
} from "../../../../common/components/Form";
import { EDirection } from "../../../../common/constants/input.enum";
import { useBudgetsCrudData } from "../hooks/budgets-crud.hook";
import { useParams } from "react-router-dom";
import { Controller } from "react-hook-form";
import BudgetViewPage from "./budget-view.page";

interface IAppProps {
  action: "new" | "edit";
}

function BudgetsForm({ action }: IAppProps) {
  const { pospre: budgetsId } = useParams();

  const {
    register,
    errors,
    entitiesData,
    isBtnDisable,
    onSubmitEditBudgets,
    onSubmitNewBudgets,
    confirmClose,
    onCancelNew,
    onCancelEdit,
    upDateVinculationData,
    upDatePospreData,
    controlRegister,
  } = useBudgetsCrudData(budgetsId);

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
                    );
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
                    );
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
              <div className="fund-data-container">
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
                    );
                  }}
                />

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
                    );
                  }}
                />
              </div>
            </div>
            {action == "edit" && (
              <BudgetViewPage
                actions="edit"
                upDatePospreData={upDatePospreData}
                upDateVinculationData={upDateVinculationData}
              />
            )}
            <div className="mobile-actions mobile">
              <span
                className="bold text-center button"
                onClick={() => {
                  confirmClose(
                    action === "new" ? onCancelNew : onCancelEdit,
                    action
                  );
                }}
              >
                Cancelar
              </span>
              <ButtonComponent
                value="Guardar"
                type="submit"
                className="button-main huge"
                disabled={action == "edit" && isBtnDisable}
              />
            </div>
          </FormComponent>
        </div>
      </div>
      <div className="container-button-bot">
        <div className="buttons-bot">
          <span
            className="bold text-center button"
            onClick={() => {
              confirmClose(
                action === "new" ? onCancelNew : onCancelEdit,
                action
              );
            }}
          >
            Cancelar
          </span>
          <ButtonComponent
            className="button-main huge hover-three"
            value="Guardar"
            type="submit"
            form="budgets-form"
            disabled={action == "edit" && isBtnDisable}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(BudgetsForm);
