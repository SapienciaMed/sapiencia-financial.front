import React from "react";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
} from "../../../common/components/Form";
import TabManagerAdditionPage from "./tab-manager-addition.page";
import { useAdditionAreaCrud } from "../hook/addition-area-crud.hook";
import { useNavigate } from "react-router-dom";
import { EDirection } from "../../../common/constants/input.enum";


interface IAppProps {
  actionForm: "new" | "edit";
}

function AdditionAreaCrud({ actionForm }: IAppProps) {
  const navigate = useNavigate();

  const { control, arrayDataSelect, errors, onSubmitTab, showModal, setMessage, getValues, watch, register, invalidCardsAdditionSt, setValue } = useAdditionAreaCrud();
  
  return (
    <div className="crud-page">
      <div className="main-page full-height">
        <p className="text-black extra-large">
          {actionForm === "new" ? "Crear adición" : "Editar adición"}
        </p>
        <div className="card-user" >
          <FormComponent action={onSubmitTab} id="form-acts">
            <div className="card-form">
              <div className="funcionality-filters-container">
                <InputComponent
                    idInput="actAdministrativeDistrict"
                    className="input-basic"
                    typeInput="text"
                    register={register}
                    label="Acto administrativo distrito"
                    classNameLabel="text-black biggest bold text-required"
                    direction={EDirection.column}
                    errors={errors}
                />
                 <InputComponent
                    idInput="actAdministrativeSapiencia"
                    className="input-basic"
                    typeInput="text"
                    register={register}
                    label="Acto administrativo sapiencia"
                    classNameLabel="text-black biggest bold text-required"
                    direction={EDirection.column}
                    errors={errors}
                />
              </div>
            </div>
            <TabManagerAdditionPage        
              controlRegister={control}
              watch={watch}
              showModal={showModal}
              onSubmitTab={onSubmitTab}
              getValues={getValues}
              arrayDataSelect={arrayDataSelect}
              register={register}
              invalidCardsAdditionSt={invalidCardsAdditionSt}
              setValue={setValue}
            />
          </FormComponent>
          <section className="container-button-core mt-24px">
            <div className="display-align-flex-center">
              <ButtonComponent
                form="useQueryForm"
                value="Cancelar"
                type="button"
                className="button-clean-fields bold"
                action={() => {
                  showModal({
                    title: "Cancelar",
                    description: "¿Está segur@ que desea cancelar la adición?",
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                      setMessage({});
                      navigate("/gestion-financiera/centro-gestor/adicion");
                    },
                  });
                }}
              />
              <ButtonComponent
                className="button-search"
                value="Guardar"
                type="submit"
                form='form-acts'
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default React.memo(AdditionAreaCrud);
