import React, { useEffect, useRef, useState } from "react";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
  SelectComponent,
} from "../../../../common/components/Form";
import { useNavigate, useParams } from "react-router-dom";
import { EDirection } from "../../../../common/constants/input.enum";
import { usePacCrud } from "../hook/pac-crud.hook";
import { BiPlusCircle } from "react-icons/bi";


interface IAppProps {
  action: "new" | "edit";
}

function PacCrud({ action }: IAppProps) {
  
  const { errors, onSubmitTab, showModal, setMessage, register, isAllowSave, control, dateFromDefaultSt, dateToDefaultSt, actualFullYear } = usePacCrud();

  let uploadFileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="crud-page">
      <div className="main-page full-height">
        <p className="text-black extra-large">
          {action === "new" ? "Cargar archivo" : "Editar proyecto"}
        </p>
        <div className="card-user" >
          <FormComponent action={onSubmitTab} id="form-acts">
            <section className="grid-form-2-container-reverse grid-column-e-proj-operation mt-5px">

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
                idInput={`entityId`}
                control={control}
                label='Tipo de recurso'
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={'Seleccionar'}
                data={[
                  { id: 1, name: "Transferencias distritales", value: "Transferencias distritales" },
                  { id: 2, name: "Recursos propios", value: "Recursos propios" }
                ]}
                filter={true}
                fieldArray={true}
                errors={errors}
              />
              <SelectComponent
                idInput={`number`}
                control={control}
                label='Tipo PAC'
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={'Seleccionar'}
                data={[
                  { id: "1", name: "Carga inicial", value: "Carga inicial" },
                  { id: "2", name: "adición", value: "adición" },
                  { id: "3", name: "Reducción", value: "Reducción" },
                  { id: "4", name: "Recaudo, Nueva versión", value: "Recaudo, Nueva versión" },
                  { id: "5", name: "Nueva versión", value: "Nueva versión" }
                ]}
                
                filter={true}
                fieldArray={true}
                errors={errors}
              />
              
              
           </section>
           <div className="title-button text-three large" style={{marginTop:'10px'}} onClick={()=>uploadFileRef.current?.click()}> Seleccionar archivo <BiPlusCircle /> </div>
            <input ref={uploadFileRef} type="file" style={{display:'none'}}/>
          </FormComponent>
          
        </div>
      </div>
    </div>
  );
}

export default React.memo(PacCrud);
