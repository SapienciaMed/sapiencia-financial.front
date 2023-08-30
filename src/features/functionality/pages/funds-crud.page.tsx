import React from "react";
import { Controller } from "react-hook-form";
import { ButtonComponent, DatePickerComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useFundsCrudData } from "../hooks/funds-crud.hook";
import { useParams } from "react-router-dom";

interface IAppProps {
    action: "new" | "edit";
}

function FundsForm({ action }: IAppProps) {
    const { id: fundId } = useParams();
    const {
      register,
      errors,
      controlRegister,
      entitiesData,
      onSubmitNewFund,
      onSubmitEditFund,
      onCancelNew,
      onCancelEdit,
      confirmClose,
    } = useFundsCrudData(fundId);
    return (
      <div className="crud-page full-height">
        <div className="main-page full-height">
          <div className="card-table">
            <div className="title-area">
              <div className="text-black extra-large bold">
                {action === "new" ? "Crear fondo" : "Editar fondo "}
              </div>
            </div>

            <FormComponent
              action={action === "new" ? onSubmitNewFund : onSubmitEditFund}
              className="funds-form"
              id="funds-form"
            >
              <div className="card-form">
                <div className="fund-data-container">
                  <SelectComponent
                    idInput="entity"
                    className="select-basic"
                    control={controlRegister}
                    errors={errors}
                    label="Entidad CP"
                    classNameLabel="text-black biggest bold text-required"
                    direction={EDirection.row}
                    data={entitiesData}
                    disabled={action === "new" ? false : true}
                  />
                  <Controller
                    control={controlRegister}
                    name={"number"}
                    defaultValue=''
                    render={({ field }) => {
                      return (
                        <InputComponent
                          id={field.name}
                          idInput={field.name}
                          value={`${field.value}`}
                          className="input-basic"
                          typeInput="number"
                          register={register}
                          label="Fondos"
                          classNameLabel="text-black biggest bold text-required"
                          direction={EDirection.row}
                          errors={errors}
                          onChange={field.onChange}
                          min={0}
                          disabled={action === "new" ? false : true}
                        /> 
                      )
                    }}
                  />
                </div>
              </div>
              <div className="card-form">
                <div className="title-area">
                  <div className="text-black biggest bold">Denominaciones</div>
                </div>
                <div className="fund-denomination-container">
                <Controller
                    control={controlRegister}
                    name={"denomination"}
                    defaultValue=''
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
                          direction={EDirection.row}
                          errors={errors}
                          onChange={field.onChange}
                        /> 
                      )
                    }}
                  />
                  <Controller
                    control={controlRegister}
                    name={"description"}
                    defaultValue=''
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
                          direction={EDirection.row}
                          errors={errors}
                          onChange={field.onChange}
                        /> 
                      )
                    }}
                  />
                </div>
              </div>
              <div className="card-form">
                <div className="title-area">
                  <div className="text-black biggest bold">Datos básicos</div>
                </div>
                <div className="fund-data-container">
                  <DatePickerComponent
                    idInput="dateFrom"
                    control={controlRegister}
                    label={"Validez de"}
                    errors={errors}
                    classNameLabel="text-black biggest bold text-required"
                    className="dataPicker-basic"
                    placeholder="DD/MM/YYYY"
                    dateFormat="dd/mm/yy"
                  />
                  <DatePickerComponent
                    idInput="dateTo"
                    control={controlRegister}
                    label={"Validez a"}
                    errors={errors}
                    classNameLabel="text-black biggest bold text-required"
                    className="dataPicker-basic"
                    placeholder="DD/MM/YYYY"
                    dateFormat="dd/mm/yy"
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
              disabled={false}
            />
          </div>
        </div>
      </div>
    );
}

export default React.memo(FundsForm);