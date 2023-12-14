import React, { useEffect, useState } from "react";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
  SelectComponent,
} from "../../../common/components/Form";
import { useNavigate, useParams } from "react-router-dom";
import { EDirection } from "../../../common/constants/input.enum";
import { useProjectOperationCrud } from "../hook/project-operation-crud.hook";
import { Controller } from "react-hook-form";

interface IAppProps {
  action: "new" | "edit";
}

function ProjectOperationCrud({ action }: IAppProps) {
  const { id: projectOperationalId } = useParams();
  const navigate = useNavigate();
  const [exerciseSt, setExerciseSt] = useState(null);
  const {
    errors,
    onSubmitTab,
    showModal,
    setMessage,
    register,
    control,
    actualFullYear,
    isBtnDisabled,
  } = useProjectOperationCrud(projectOperationalId, exerciseSt, action);

  return (
    <div className="crud-page">
      <div className="main-page full-height">
        <p className="text-black extra-large">
          {action === "new" ? "Crear proyecto" : "Editar proyecto"}
        </p>
        <div className="card-user">
          <FormComponent action={onSubmitTab} id="form-acts">
            <section className="grid-form-2-container-reverse grid-column-e-proj-operation mt-5px">
              <SelectComponent
                idInput={`entityId`}
                control={control}
                label="Entidad CP"
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={"Seleccionar"}
                data={[{ id: 1, name: "SAPI", value: 1 }]}
                filter={true}
                fieldArray={true}
                errors={errors}
                disabled={true}
              />
              <SelectComponent
                idInput={`number`}
                control={control}
                label="Proyecto"
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={"Seleccionar"}
                data={[{ id: "1", name: "9000000", value: "1" }]}
                filter={true}
                fieldArray={true}
                errors={errors}
                disabled={true}
              />
              <Controller
                control={control}
                name={"name"}
                render={({ field }) => (
                  <InputComponent
                    id={field.name}
                    idInput={field.name}
                    className="input-basic medium"
                    typeInput="text"
                    register={register}
                    onChange={field.onChange}
                    label="Denominación"
                    classNameLabel="text-black big bold text-required"
                    direction={EDirection.column}
                    errors={errors}
                  />
                )}
              />
              <Controller
                control={control}
                name={"exercise"}
                render={({ field }) => (
                  <InputComponent
                    id={field.name}
                    idInput={field.name}
                    className="input-basic medium"
                    typeInput="number"
                    register={register}
                    label="Vigencia"
                    classNameLabel="text-black big bold text-required"
                    direction={EDirection.column}
                    errors={errors}
                    onChange={(e) => setExerciseSt(e.target.value)}
                    min={actualFullYear}
                    disabled={action === "new" ? false : true}
                  />
                )}
              />
            </section>
            <section className="grid-form-2-container-reverse grid-column-four mt-5px">
              <SelectComponent
                idInput="isActivated"
                control={control}
                label="Estado"
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                data={[
                  { id: "1", name: "Activo", value: "1" },
                  { id: "0", name: "Inactivo", value: "0" },
                ]}
                direction={EDirection.column}
                filter={true}
                fieldArray={true}
                errors={errors}
              />
              <Controller
                control={control}
                name={"dateFrom"}
                render={({ field }) => (
                  <InputComponent
                    id={field.name}
                    idInput={field.name}
                    className="input-basic medium"
                    typeInput="date"
                    register={register}
                    onChange={field.onChange}
                    label="Validez desde"
                    classNameLabel="text-black big bold text-required"
                    direction={EDirection.column}
                    errors={errors}
                  />
                )}
              />
              <Controller
                control={control}
                name={"dateTo"}
                render={({ field }) => (
                  <InputComponent
                    id={field.name}
                    idInput={field.name}
                    className="input-basic medium"
                    typeInput="date"
                    register={register}
                    onChange={field.onChange}
                    label="Validez hasta"
                    classNameLabel="text-black big bold text-required"
                    direction={EDirection.column}
                    errors={errors}
                  />
                )}
              />
            </section>
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
                      description:
                        "¿Está segur@ que desea cancelar el proyecto?",
                      show: true,
                      OkTitle: "Aceptar",
                      cancelTitle: "Cancelar",
                      onOk: () => {
                        setMessage({});
                        navigate(
                          "/gestion-financiera/presupuesto/proyecto-funcionamiento"
                        );
                      },
                      onCancel() {
                        setMessage({});
                      },
                    });
                  }}
                />
                <ButtonComponent
                  className="button-search"
                  value="Guardar"
                  type="submit"
                  form="form-acts"
                  disabled={!isBtnDisabled}
                />
              </div>
            </section>
          </FormComponent>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProjectOperationCrud);
