import React from "react";
import { useVinculationMGAData } from "../../hooks/vinculation-mga.hook";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
  SelectComponent,
} from "../../../../common/components/Form";
import { EDirection } from "../../../../common/constants/input.enum";
import { useBudgetsCrudData } from "../hooks/budgets-crud.hook";
import { useParams, useNavigate } from "react-router-dom";
import TableComponent from "../../../../common/components/table.component";
import TabBudgetView from "./tab-budget-view";
import BudgetViewPage from "./budget-view.page";


function BudgetsForm() {
  const navigate = useNavigate();
  const { id: budgetsId } = useParams();
  //TODO: Eliminar?
  const { vinculateActivities } = useVinculationMGAData(budgetsId);

  const { register, errors, entitiesData, budgetsData, controlRegister} = useBudgetsCrudData( budgetsId, vinculateActivities );

  return (
    <div className="crud-page full-height">
      <div className="main-page full-height">
        <div className="card-table">
          <div className="title-area">
            <div className="text-black extra-large bold">
              {"Ver Detalle Posición Presupuestaria "}
            </div>
          </div>

          <FormComponent
            action={"undefined"}
            className="funds-form"
            id="budgets-form"
          >
            <div className="card-form no-box-shadow">
              <div className="fund-data-container">
                <InputComponent
                  idInput="number"
                  register={register}
                  typeInput="number"
                  errors={errors}
                  label="Posicion Presupuestaria"
                  classNameLabel="text-black biggest bold"
                  disabled={true}
                />

                <InputComponent
                  idInput="ejercise"
                  className="input-basic"
                  typeInput="number"
                  register={register}
                  label="Ejercicio"
                  classNameLabel="text-black biggest bold"
                  direction={EDirection.column}
                  disabled={true}
                  errors={errors}
                />

                <SelectComponent
                  idInput="entity"
                  className="select-basic"
                  control={controlRegister}
                  errors={errors}
                  label="Entidad CP"
                  classNameLabel="text-black biggest bold"
                  direction={EDirection.column}
                  data={entitiesData}
                  disabled={true}
                />
              </div>
            </div>
            <div className="card-form no-box-shadow">
              <div className="title-area">
                <div className="text-black biggest bold">Datos básicos</div>
              </div>
              <div className="fund-denomination-container">
                <InputComponent
                  idInput="denomination"
                  register={register}
                  typeInput="text"
                  errors={errors}
                  label="Denominación"
                  classNameLabel="text-black biggest bold"
                  disabled={true}
                />
              </div>
              <div className="fund-denomination-container">
                <InputComponent
                  idInput="description"
                  register={register}
                  typeInput="text"
                  errors={errors}
                  label="Descripción"
                  classNameLabel="text-black biggest bold"
                  disabled={true}
                />
              </div>
            </div>

            <BudgetViewPage budgetsData={budgetsData?.number}/>

          </FormComponent>
        </div>
        <div className="container-button-bot">
        <div className="buttons-bot">
          <span
            className="bold text-center button" >
          </span>
          <ButtonComponent
            className="button-main huge hover-three"
            value="Aceptar"
            type="button"
            form="budgets-form"
            action={() => {
                navigate("./../..")
              }}
          />
        </div>
      </div>
      </div>
    </div>
  );
}

export default React.memo(BudgetsForm);
