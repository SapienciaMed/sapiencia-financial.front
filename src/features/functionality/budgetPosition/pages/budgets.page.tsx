import {
  FormComponent,
  InputComponent,
  ButtonComponent,
} from "../../../../common/components/Form";
import TableComponent from "../../../../common/components/table.component";
import { EDirection } from "../../../../common/constants/input.enum";
import { useBudgetsData } from "../hooks/budgets.hook";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Controller } from "react-hook-form";

function BudgetsPage(): React.JSX.Element {
  const {
    tableActions,
    tableColumns,
    tableComponentRef,
    navigate,
    onSubmit,
    register,
    errors,
    reset,
    isBtnDisable,
    setIsVisibleTable,
    controlRegister,
    isVisibleTable,
  } = useBudgetsData();

  return (
    <div className="main-page">
      <div className="card-table">
        <div className="title-area">
          <div className="text-black extra-large bold">
            Posición Presupuestal
          </div>
        </div>
        <FormComponent action={onSubmit}>
          <div className="card-form">
            <div className="title-area">
              <label className="text-black biggest bold">
                Consultar Posición Presupuestal
              </label>
              <div className="title-button text-three biggest">
                <span
                  style={{ marginRight: "0.5em" }}
                  onClick={() => {
                    navigate("./create");
                  }}
                >
                  {" "}
                  Crear Pospre
                </span>
                {<AiOutlinePlusCircle size={20} color="533893" />}
              </div>
            </div>

            <div className="one-filter-container">
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
                      label="Posición presupuestal"
                      classNameLabel="text-black biggest bold"
                      direction={EDirection.column}
                      errors={errors}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
            </div>
          </div>
          <div className="funcionality-buttons-container">
            <span
              className="bold text-center button"
              onClick={() => {
                reset();
                tableComponentRef.current.emptyData();
                setIsVisibleTable(false);
              }}
            >
              Limpiar campos
            </span>
            <ButtonComponent
              className="button-main huge hover-three"
              value="Buscar"
              type="submit"
              disabled={!isBtnDisable}
            />
          </div>
        </FormComponent>
        {isVisibleTable && (
          <div className="card-form">
            <TableComponent
              ref={tableComponentRef}
              url={`${process.env.urlApiFinancial}/api/v1/budgets/get-paginated`}
              columns={tableColumns}
              actions={tableActions}
              isShowModal={true}
              titleMessageModalNoResult={"Posición Presupuestal"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default BudgetsPage;
