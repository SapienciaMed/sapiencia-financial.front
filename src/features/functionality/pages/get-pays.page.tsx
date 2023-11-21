import { AiOutlinePlusCircle } from "react-icons/ai";
import { FormComponent, InputComponent, DatePickerComponent, SelectComponent, ButtonComponent } from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { EDirection } from "../../../common/constants/input.enum";
import { useFundsData } from "../hooks/funds.hook";
import React from "react";
import { Controller } from "react-hook-form";

interface IAppProps { }

function GetPaysPage(props: IAppProps): React.JSX.Element {
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
    isBtnDisable,
    validateActionAccess
  } = useFundsData();

  return (
    <div className='main-page'>
      <div className='card-table'>
        <div className="title-area">
          <div className="text-black extra-large bold">Consultar pago</div>
        </div>
        <FormComponent action={onSubmit}>
          <div className="card-form">
            <div className="title-area">
              <label className="text-black biggest bold">Consultar pago</label>

              {
                validateActionAccess('PAGOS_CARGAR') && (
                  <div
                    className="title-button text-main biggest"
                    onClick={() => {
                      navigate("./carga-masiva");
                    }}
                  >
                    Cargar pago <AiOutlinePlusCircle />
                  </div>

                )
              }
            </div>
            <div className="funcionality-filters-container">
              <InputComponent
                idInput="exercise"
                className="input-basic medium"
                typeInput="number"
                register={register}
                label="Vigencia"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                errors={errors}
              />

              <SelectComponent
                idInput="mes"
                control={controlRegister}
                label="Mes"
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={"Seleccionar"}
                data={[
                  {
                    id: 1,
                    name: "Enero",
                    value: "1",
                  },
                  {
                    id: 2,
                    name: "Febrero",
                    value: "2",
                  },
                  {
                    id: 3,
                    name: "Marzo",
                    value: "3",
                  },
                  {
                    id: 4,
                    name: "Abril",
                    value: "4",
                  },
                  {
                    id: 5,
                    name: "Mayo",
                    value: "5",
                  },
                  {
                    id: 6,
                    name: "Junio",
                    value: "6",
                  },
                  {
                    id: 7,
                    name: "Julio",
                    value: "7",
                  },
                  {
                    id: 8,
                    name: "Agosto",
                    value: "8",
                  },
                  {
                    id: 9,
                    name: "Septiembre",
                    value: "9",
                  },
                  {
                    id: 10,
                    name: "Octubre",
                    value: "10",
                  },
                  {
                    id: 11,
                    name: "Noviembre",
                    value: "11",
                  },
                  {
                    id: 12,
                    name: "Diciembre",
                    value: "12",
                  },
                ]}
                filter={true}
                errors={errors}
                direction={EDirection.column}
              />
              <InputComponent
                idInput="exercise"
                className="input-basic medium"
                typeInput="number"
                register={register}
                label="Consecutivo RP SAP"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                errors={errors}
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
            titleMessageModalNoResult={"Fondos"}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(GetPaysPage);