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
  const [exerciseSt, setExerciseSt] = useState(null)
  
  const { errors, onSubmitTab, showModal, setMessage, register, isAllowSave, control, dateFromDefaultSt, dateToDefaultSt,actualFullYear } = useProjectOperationCrud(exerciseSt);

  const [isModifyDateFrom, setIsModifyDateFrom] = useState(false)
  const [isModifyDateTo, setIsModifyDateTo] = useState(false)

  const [dateFromDefaultStValidateDate, setDateFromDefaultStValidateDate] = useState(dateFromDefaultSt)
  const [dateToDefaultStValidateDate, setDateToDefaultStValidateDate] = useState(dateToDefaultSt)
  
  useEffect(() => {
    setIsModifyDateFrom(true)
  }, [dateFromDefaultSt])
  
  useEffect(() => {
    setIsModifyDateTo(true)
  }, [dateToDefaultSt])
  

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
                idInput={`entityId`}
                control={control}
                label='Entidad CP'
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={'Seleccionar'}
                data={[{ id: 1, name: "SAPI", value: 1 }]}
                filter={true}
                fieldArray={true}
                errors={errors}
                disabled={true}
              />
              <SelectComponent
                idInput={`number`}
                control={control}
                label='Proyecto'
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={'Seleccionar'}
                data={[{ id: "1", name: "90000000", value: "1" }]}
                filter={true}
                fieldArray={true}
                errors={errors}
                disabled={true}
              />
              <InputComponent
                idInput="name"
                className="input-basic medium"
                typeInput="text"
                register={register}
                label="Denominación"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                errors={errors}
              />
              <InputComponent
                idInput="exercise"
                className="input-basic medium"
                typeInput="number"
                register={register}
                label="Vigencia"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                errors={errors}
                onChange={(e)=>setExerciseSt(e.target.value)}
                min={actualFullYear}
              />

            </section>
            <section className="grid-form-2-container-reverse grid-column-four mt-5px">
              <SelectComponent
                idInput={`isActivated`}
                control={control}
                label='Estado'
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={'Seleccionar'}
                data={[
                  { id: "1", name: "Activo", value: 1 },
                  { id: "0", name: "Inactivo", value: 0 },
                ]}
                filter={true}
                fieldArray={true}
                errors={errors}
              />

              <InputComponent
                idInput="dateFrom"
                className="input-basic medium"
                typeInput="date"
                register={register}
                value={!isModifyDateFrom ? undefined : dateFromDefaultSt}
                onChange={(e)=>{setIsModifyDateFrom(false);setDateFromDefaultStValidateDate(e.target.value)}}
                label="Validez desde"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                errors={errors}
                max={dateToDefaultStValidateDate}
              />
              <InputComponent
                idInput="dateTo"
                className="input-basic medium"
                typeInput="date"
                register={register}
                value={!isModifyDateTo ? undefined : dateToDefaultSt}
                onChange={(e)=>{setIsModifyDateTo(false);setDateToDefaultStValidateDate(e.target.value);}}
                label="Validez hasta"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                errors={errors}
                min={dateFromDefaultStValidateDate}
              />
            </section>
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
                    description: "¿Está segur@ que desea cancelar el proyecto?",
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                      setMessage({});
                      navigate("/gestion-financiera/presupuesto/proyecto-funcionamiento");
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
