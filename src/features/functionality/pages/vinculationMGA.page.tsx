import { useNavigate, useParams } from "react-router-dom";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
} from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useVinculationMGAData } from "../hooks/vinculation-mga.hook";
import TableComponent from "../../../common/components/table.component";
import { useEffect } from "react";
import { Controller } from "react-hook-form";

function VinculationMGA(): React.JSX.Element {
  const { pospre } = useParams();
  const navigate = useNavigate();
  const {
    register,
    reset,
    errors,
    tableComponentRef,
    tableColumns,
    control,
    tableActionsView,
    isBtnDisable,
    loadTableData,
    onSubmit,
    vinculateActivities,
  } = useVinculationMGAData(pospre);

  useEffect(() => {
    if (Number(pospre)) loadTableData({ budgetId: Number(pospre) });
  }, [pospre]);
  
  return (
    <div>
      <div className="title-area">
        <div className="text-black extra-large bold">Vinculación MGA</div>
      </div>
      <FormComponent action={onSubmit}>
        <div className="card-form">
          <div className="title-area">
            <label className="text-black large bold">
              Consultar Vinculación MGA
            </label>
          </div>
          <div className="funcionality-filters-container">
            <Controller
              control={control}
              name={"inputCodigoMGA"}
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
                    label="Código MGA"
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
            }}
          >
            Limpiar campos
          </span>
          <ButtonComponent
            className="button-main huge hover-three"
            value="Buscar"
            type="submit"
          />
        </div>

        <div className="card-form">
          <TableComponent
            ref={tableComponentRef}
            url={`${process.env.urlApiFinancial}/api/v1/vinculation-mga/get-detailed-activities-api-planning-nouseonpospre/${pospre}`}
            columns={tableColumns}
            actions={tableActionsView}
            isShowModal={false}
            titleMessageModalNoResult="Vinculación MGA"
          />
        </div>
        <div className="container-button-bot">
          <div className="buttons-bot">
            <span
              className="bold text-center button"
              onClick={() => {
                navigate("./../../../");
              }}
            >
              Cancelar
            </span>
            <ButtonComponent
              className="button-main huge hover-three"
              value="Guardar"
              type="button"
              action={() => {
                vinculateActivities(true);
              }}
              disabled={!isBtnDisable}
            />
          </div>
        </div>
      </FormComponent>
    </div>
  );
}

export default VinculationMGA;
