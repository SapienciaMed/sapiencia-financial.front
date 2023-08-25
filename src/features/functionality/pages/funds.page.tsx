import { AiOutlinePlusCircle } from "react-icons/ai";
import { FormComponent, InputComponent, DatePickerComponent, SelectComponent, ButtonComponent } from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { EDirection } from "../../../common/constants/input.enum";
import { useFundsData } from "../hooks/funds.hook";
import React from "react";

interface IAppProps { }

function FoundsPage(props: IAppProps): React.JSX.Element {
    const {
      tableActions,
      tableColumns,
      tableComponentRef,
      onSubmit,
      navigate,
      register,
      errors,
      reset,
      controlRegister,
      entitiesData,
      isVisibleTable,
      setIsVisibleTable,
      validatorNumber,
      isValid,
  } = useFundsData();
  console.log(isValid);
    return (
      <div>
        <FormComponent action={onSubmit}>
          <div className="card-form">
            <div className="title-area">
              <label className="text-black biggest bold">Consultar Fondo</label>

              <div
                className="title-button text-main biggest"
                onClick={() => {
                  navigate("./create");
                }}
              >
                Crear Fondo <AiOutlinePlusCircle />
              </div>
            </div>
            <div className="funcionality-filters-container">
              <SelectComponent
                idInput="entity"
                className="select-basic"
                errors={errors}
                label="Entidad CP"
                classNameLabel="text-black biggest bold"
                direction={EDirection.row}
                data={entitiesData}
                control={controlRegister}
              />
              <InputComponent
                idInput="number"
                className="input-basic"
                typeInput="number"
                register={register}
                label="Fondos"
                classNameLabel="text-black biggest bold"
                direction={EDirection.row}
                errors={errors}
                onChange={validatorNumber}
              />
              <DatePickerComponent
                idInput="dateFrom"
                control={controlRegister}
                label={"Validez de"}
                errors={errors}
                classNameLabel="text-black biggest bold"
                className="dataPicker-basic"
                placeholder="DD/MM/YYYY"
                dateFormat="dd/mm/yy"
              />
              <DatePickerComponent
                idInput="dateTo"
                control={controlRegister}
                label={"Validez a"}
                errors={errors}
                classNameLabel="text-black biggest bold"
                className="dataPicker-basic"
                placeholder="DD/MM/YYYY"
                dateFormat="dd/mm/yy"
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
              disabled={false}
            />
          </div>
        </FormComponent>
        <div
          className={
            isVisibleTable ? "card-form isVisible" : "card-form isNotVisible"
          }
        >
          <TableComponent
            ref={tableComponentRef}
            url={`${process.env.urlApiFinancial}/api/v1/funds/get-paginated`}
            columns={tableColumns}
            actions={tableActions}
            isShowModal={true}
            titleMessageModalNoResult={"Buscar"}
          />
        </div>
      </div>
    );
}

export default React.memo(FoundsPage);