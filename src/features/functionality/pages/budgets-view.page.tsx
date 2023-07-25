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
import { useParams, useNavigate } from "react-router-dom";
import TableComponent from "../../../common/components/table.component";


function BudgetsForm() {
  const navigate = useNavigate();
  const { id: budgetsId } = useParams();
  const { tableComponentRef, tableColumnsEdit, tableActions, vinculateActivities } =
    useVinculationMGAData(budgetsId);
  const {
    register,
    errors,
    reset,
    setValueRegister,
    entitiesData,
    entitySelected,
    setEntitySelected,
    onSubmitEditBudgets,
    onSubmitNewBudgets,
    confirmClose,
    onCancelNew,
    onCancelEdit,
  } = useBudgetsCrudData(budgetsId);
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
            <div className="card-form">
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
                  direction={EDirection.row}
                  disabled={true}
                  errors={errors}
                />

                <SelectComponent
                  idInput="entity"
                  className="select-basic"
                  register={register}
                  setValueRegister={setValueRegister}
                  errors={errors}
                  label="Entidad CP"
                  classNameLabel="text-black biggest bold"
                  direction={EDirection.row}
                  data={entitiesData}
                  disabled={true}
                  stateProps={{
                    state: entitySelected,
                    setState: setEntitySelected,
                  }}
                  
                />
              </div>
            </div>
            <div className="card-form">
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
                <div>
                  <div className="card-form">
                    <TableComponent
                      ref={tableComponentRef}
                      url={`${process.env.urlApiFinancial}/api/v1/vinculation-mga/get-paginated`}
                      columns={tableColumnsEdit}
                      actions={tableActions}
                      isShowModal={false}
                    />
                  </div>
                </div>
          </FormComponent>
        </div>
        <div className="container-button-bot">
        <div className="buttons-bot">
          <span
            className="bold text-center button" >
          </span>
          <ButtonComponent
            className="button-main huge hover-three"
            value="Guardar"
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
