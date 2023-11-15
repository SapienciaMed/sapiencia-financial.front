import React, { useEffect, useState } from "react";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
} from "../../../common/components/Form";
import TabManagerAdditionPage from "./tab-manager-addition.page";
import { useAdditionAreaCrud } from "../hook/addition-area-crud.hook";
import { useNavigate, useParams } from "react-router-dom";
import { EDirection } from "../../../common/constants/input.enum";
import { Controller } from "react-hook-form";
interface IAppProps {
  actionForm: "new" | "edit" | "detail";
  typeMovement: "Adicion" | "Disminucion";
}

function AdditionAreaCrud({ actionForm, typeMovement }: IAppProps) {
  const navigate = useNavigate();
  const { id: idMovement } = useParams();

  const [tabId, setTabId] = useState<string>()
  const tabSelected = (e) => {
    setTabId(e.id)
  }
  const { control, arrayDataSelect, errors, onSubmitTab, showModal, setMessage, getValues, watch, register, invalidCardsAdditionSt, setValue, isAllowSave, isfull } = useAdditionAreaCrud(tabId, typeMovement, actionForm);

  function renderTabManager() {
    if (isfull && actionForm === "edit") {
      return <TabManagerAdditionPage
        controlRegister={control}
        watch={watch}
        showModal={showModal}
        onSubmitTab={onSubmitTab}
        getValues={getValues}
        arrayDataSelect={arrayDataSelect}
        register={register}
        invalidCardsAdditionSt={invalidCardsAdditionSt}
        setValue={setValue}
        tabSelected={tabSelected}
      />
    }
    if (actionForm === "detail") {
      return <TabManagerAdditionPage
        controlRegister={control}
        watch={watch}
        showModal={showModal}
        onSubmitTab={onSubmitTab}
        getValues={getValues}
        arrayDataSelect={arrayDataSelect}
        register={register}
        invalidCardsAdditionSt={invalidCardsAdditionSt}
        setValue={setValue}
        tabSelected={tabSelected}
        detail={true}
      />
    }
    if (actionForm === "new") {
      return <TabManagerAdditionPage
        controlRegister={control}
        watch={watch}
        showModal={showModal}
        onSubmitTab={onSubmitTab}
        getValues={getValues}
        arrayDataSelect={arrayDataSelect}
        register={register}
        invalidCardsAdditionSt={invalidCardsAdditionSt}
        setValue={setValue}
        tabSelected={tabSelected}
      />
    }
    return null;
  }


  return (
    <div className="crud-page">
      <div className="main-page full-height">
        <p className="text-black extra-large">
          {
            actionForm === "new"
              ? (typeMovement === "Adicion" ? "Crear adición" : "Crear disminución")
              : (actionForm === "edit"
                ? (typeMovement === "Adicion" ? "Editar adición" : "Editar disminución")
                : (actionForm === "detail" ? (typeMovement === "Adicion" ? "Detalle adición" : "Detalle disminución") : "")
              )
          }
        </p>


        <div className="card-user" >
          <FormComponent action={onSubmitTab} id="form-acts">
            <div className="card-form">
              <div className="funcionality-filters-container">
               {/*  <InputComponent
                  idInput="actAdministrativeDistrict"
                  className="input-basic"
                  typeInput="text"
                  register={register}
                  label="Acto administrativo distrito"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  errors={errors}
                  disabled={actionForm === "edit" || actionForm === "detail"}
                /> */}
                  <Controller
                    control={control}
                    name={"actAdministrativeDistrict"}
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
                                label="Acto administrativo distrito"
                                classNameLabel="text-black biggest bold text-required"
                                direction={EDirection.column}
                                errors={errors}
                                onChange={field.onChange}
                                disabled={actionForm === "edit" || actionForm === "detail"}
                            /> 
                        )
                    }}
                  />
              {/*   <InputComponent
                  idInput="actAdministrativeSapiencia"
                  className="input-basic"
                  typeInput="text"
                  register={register}
                  label="Acto administrativo sapiencia"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  errors={errors}
                  disabled={actionForm === "edit" || actionForm === "detail"}
                /> */}
                 <Controller
                    control={control}
                    name={"actAdministrativeSapiencia"}
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
                                label="Acto administrativo sapiencia"
                                classNameLabel="text-black biggest bold text-required"
                                direction={EDirection.column}
                                errors={errors}
                                onChange={field.onChange}
                                disabled={actionForm === "edit" || actionForm === "detail"}
                            /> 
                        )
                    }}
                  />
              </div>
            </div>
            {
              renderTabManager()
            }
          </FormComponent>
          <section className="container-button-core-adicion mt-24px">
            <div className="display-align-flex-center">
              {actionForm !== "detail" ? (
                <>
                  <ButtonComponent
                    form="useQueryForm"
                    value="Cancelar"
                    type="button"
                    className="button-clean-fields bold"
                    action={() => {
                      showModal({
                        title: "Cancelar",
                        description: "¿Está segur@ que desea cancelar la información en el sistema?",
                        show: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                          setMessage({});
                          const route = typeMovement === "Adicion"
                            ? "/gestion-financiera/centro-gestor/adicion"
                            : "/gestion-financiera/centro-gestor/disminucion";
                          navigate(route);
                        },
                      });
                    }}
                  />
                  <ButtonComponent
                    className="button-search"
                    value="Guardar"
                    type="submit"
                    form='form-acts'
                    disabled={!isAllowSave}
                  />
                </>
              ) : (
                <ButtonComponent
                  className="button-search"
                  value="Volver"
                  type="button"
                  action={() => {
                    const route = typeMovement === "Adicion"
                    ? "/gestion-financiera/centro-gestor/adicion"
                    : "/gestion-financiera/centro-gestor/disminucion";
                  navigate(route);
                  }}
                />
              )
              }
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default React.memo(AdditionAreaCrud);
