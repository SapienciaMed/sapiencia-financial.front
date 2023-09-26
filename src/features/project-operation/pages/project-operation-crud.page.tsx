import React, { useEffect, useState } from "react";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
  SelectComponent,
} from "../../../common/components/Form";
import { useNavigate } from "react-router-dom";
import { EDirection } from "../../../common/constants/input.enum";
import { useProjectOperationCrud } from "../hook/project-operation-crud.hook";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";


interface IAppProps {
  action: "new" | "edit";
}

function ProjectOperationCrud({ action }: IAppProps) {
  const navigate = useNavigate();
  const { errors, onSubmitTab, showModal, setMessage, register, isAllowSave, control } = useProjectOperationCrud();

  return (
    <div className="crud-page">
      <div className="main-page full-height">
        <p className="text-black extra-large">
          {action === "new" ? "Crear proyecto" : "Editar proyecto"}
        </p>
        <div className="card-user" >
          <FormComponent action={onSubmitTab} id="form-acts">
            <section className="grid-form-2-container-reverse grid-column-e-proj-operation mt-5px">

              <SelectComponent
                idInput={`managerCenter`}
                control={control}
                label='Entidad CP'
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={'Seleccionar'}
                data={[{ id: "91500000", name: "91500000", value: "91500000" }]}
                filter={true}
                fieldArray={true}
                errors={errors}
              />
              <SelectComponent
                idInput={`projectId`}
                control={control}
                label='Proyecto'
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={'Seleccionar'}
                //data={functionalArea}
                filter={true}
                fieldArray={true}
                errors={errors}
              //optionSelected={optionSelected}
              />
              <InputComponent
                  idInput="actAdministrativeDistrict"
                  className="input-basic medium"
                  typeInput="text"
                  register={register}
                  label="Denominación"
                  classNameLabel="text-black big bold text-required"
                  direction={EDirection.column}
                  errors={errors}
                />
                <InputComponent
                  idInput="actAdministrativeSapiencia"
                  className="input-basic medium"
                  typeInput="text"
                  register={register}
                  label="Vigencia"
                  classNameLabel="text-black big bold text-required"
                  direction={EDirection.column}
                  errors={errors}
                />

            </section>
            <section className="grid-form-2-container-reverse grid-column-four mt-5px">
            <SelectComponent
                  idInput={`projectId`}
                  control={control}
                  label='Estado'
                  className="select-basic medium"
                  classNameLabel="text-black big bold text-required"
                  placeholder={'Seleccionar'}
                  //data={functionalArea}
                  filter={true}
                  fieldArray={true}
                  errors={errors}
                //optionSelected={optionSelected}
                />
            
            <InputComponent
                  idInput="actAdministrativeSapiencia"
                  className="input-basic medium"
                  typeInput="date"
                  register={register}
                  label="Validez desde"
                  classNameLabel="text-black big bold text-required"
                  direction={EDirection.column}
                  errors={errors}
                />
                <InputComponent
                  idInput="actAdministrativeSapiencia"
                  className="input-basic medium"
                  typeInput="date"
                  register={register}
                  label="Validez hasta"
                  classNameLabel="text-black big bold text-required"
                  direction={EDirection.column}
                  errors={errors}
                />

            </section>

            {/* <InputComponent
                  idInput="actAdministrativeDistrict"
                  className="input-basic medium"
                  typeInput="text"
                  register={register}
                  label="Denominación"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  errors={errors}
                />
                <InputComponent
                  idInput="actAdministrativeSapiencia"
                  className="input-basic medium"
                  typeInput="text"
                  register={register}
                  label="Vigencia"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  errors={errors}
                />
                <SelectComponent
                  idInput={`projectId`}
                  control={control}
                  label='Estado'
                  className="select-basic medium"
                  classNameLabel="text-black big bold text-required"
                  placeholder={'Seleccionar'}
                  //data={functionalArea}
                  filter={true}
                  fieldArray={true}
                  errors={errors}
                //optionSelected={optionSelected}
                />
                
                <InputComponent
                  idInput="actAdministrativeSapiencia"
                  className="input-basic medium"
                  typeInput="date"
                  register={register}
                  label="Validez desde"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  errors={errors}
                />
                <InputComponent
                  idInput="actAdministrativeSapiencia"
                  className="input-basic medium"
                  typeInput="date"
                  register={register}
                  label="Validez hasta"
                  classNameLabel="text-black biggest bold text-required"
                  direction={EDirection.column}
                  errors={errors}
                /> */}
            {/* <TabManagerAdditionPage        
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
            /> */}
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
                disabled={!isAllowSave}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProjectOperationCrud);
