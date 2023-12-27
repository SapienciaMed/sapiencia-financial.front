import React from "react";
import { useParams } from "react-router-dom";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
  SelectComponent,
} from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useBudgetRoutesCrudData } from "../hooks/budget-routes-crud.hook";

interface IAppProps {
  action: "new" | "edit";
}

function BudgetRoutesCrudPage({ action }: IAppProps) {
  const { id } = useParams();
  const {
    register,
    errors,
    controlRegister,
    onSubmitNewBudgetRoute,
    onSubmitEditBudgetRoute,
    onCancelNew,
    onCancelEdit,
    confirmClose,
    projectsData,
    budgetData,
    pospreSapienciaData,
    fundsData,
  } = useBudgetRoutesCrudData(id);
  return (
    <div className="crud-page full-height">
      <div className="main-page full-height">
        <div className="card-table">
          <div className="title-area">
            <div className="text-black extra-large bold">
              {action === "new"
                ? "Crear Ruta Presupuestal"
                : "Editar Ruta Presupuestal"}
            </div>
          </div>

          <FormComponent
            action={
              action === "new"
                ? onSubmitNewBudgetRoute
                : onSubmitEditBudgetRoute
            }
            className="funds-form"
            id="funds-form"
          >
            <div className="card-form">
              <div className="fund-data-container">
                <SelectComponent
                  idInput="idProjectVinculation"
                  className="select-basic span-width"
                  control={controlRegister}
                  errors={errors}
                  label="ID Proyecto"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  data={projectsData}
                  filter={true}
                  disabled={action == "edit"}
                />
                <SelectComponent
                  idInput="managementCenter"
                  className="select-basic"
                  control={controlRegister}
                  errors={errors}
                  label="Centro gestor"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  data={[{ name: "91500000", value: "91500000" }]}
                  filter={true}
                />
                <SelectComponent
                  idInput="div"
                  className="select-basic"
                  control={controlRegister}
                  errors={errors}
                  label="Div"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  data={[{ name: "SAPI", value: "SAPI" }]}
                  filter={true}
                />
                <InputComponent
                  idInput="functionalArea"
                  className="input-basic"
                  typeInput="text"
                  register={register}
                  label="Area funcional"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  errors={errors}
                  disabled={true}
                />
                <SelectComponent
                  idInput="idBudget"
                  className="select-basic"
                  control={controlRegister}
                  errors={errors}
                  label="Pospre origen"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  data={budgetData}
                  filter={true}
                />
                <SelectComponent
                  idInput="idPospreSapiencia"
                  className="select-basic"
                  control={controlRegister}
                  errors={errors}
                  label="Pospre sapiencia"
                  classNameLabel="text-black biggest bold"
                  direction={EDirection.column}
                  data={pospreSapienciaData}
                  filter={true}
                />
                <SelectComponent
                  idInput="idFund"
                  className="select-basic"
                  control={controlRegister}
                  errors={errors}
                  label="Fondo"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  data={fundsData}
                  filter={true}
                />
              </div>
            </div>
            <div className="mobile-actions mobile">
              <span
                className="bold text-center button"
                onClick={() => {
                  confirmClose(action === "new" ? onCancelNew : onCancelEdit);
                }}
              >
                Cancelar
              </span>
              <ButtonComponent
                value="Guardar"
                type="submit"
                className="button-main huge"
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
              confirmClose(action === "new" ? onCancelNew : onCancelEdit);
            }}
          >
            Cancelar
          </span>
          <ButtonComponent
            className="button-main huge hover-three"
            value="Guardar"
            type="submit"
            form="funds-form"
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(BudgetRoutesCrudPage);
