import React from "react";
import {
  ButtonComponent,
  FormComponent,
  SelectComponent,
} from "../../../common/components/Form";
import TabManagerAdditionPage from "./tab-manager-addition.page";
import { useAdditionAreaCrud } from "../hooks/addition-area-crud.hook";
import { useManagementCenterAdditional } from "../hooks/management-center-additional.hook";
import { useNavigate } from "react-router-dom";

interface IAppProps {
  action: "new" | "edit";
}

function AdditionAreaCrud({ action }: IAppProps) {
  const navigate = useNavigate();

  const { controlRegisterTabs, onSubmitTab, showModal, setMessage, getValues , watch} =
    useAdditionAreaCrud();

  const {
    controlRegister,
    errors,
    AdditionsByDistrictData,
    AdditionsBySapienciaData,
    onSubmit,
  } = useManagementCenterAdditional();

  return (
    <div className="crud-page">
      <div className="main-page full-height">
        <p className="text-black extra-large">
          {action === "new" ? "Crear adición" : "Editar adición"}
        </p>
        <div className="card-user">
          <FormComponent action={onSubmit}>
            <div className="card-form">
              <div className="funcionality-filters-container">
                <SelectComponent
                  idInput="actAdministrativeDistrict"
                  className="select-basic"
                  label="Acto administrativo distrito"
                  classNameLabel="text-black biggest text-required"
                  errors={errors}
                  control={controlRegister}
                  data={AdditionsByDistrictData}
                  filter={true}
                />
                <SelectComponent
                  idInput="actAdministrativeSapiencia"
                  className="select-basic"
                  label="Acto administrativo sapiencia"
                  classNameLabel="text-black biggest text-required"
                  errors={errors}
                  control={controlRegister}
                  data={AdditionsBySapienciaData}
                  filter={true}
                />
              </div>
            </div>
          </FormComponent>

          <FormComponent action={onSubmitTab} id="form-acts">
            <TabManagerAdditionPage
              controlRegister={controlRegisterTabs}
              watch={watch}
              showModal={showModal}
              onSubmitTab={onSubmitTab}
              getValues={getValues}
            />
          </FormComponent>

          <section className="container-button-core mt-24px">
            <div className="display-justify-space-between">
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
                // form='form-acts'
                // disabled={!isBtnDisable}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default React.memo(AdditionAreaCrud);
