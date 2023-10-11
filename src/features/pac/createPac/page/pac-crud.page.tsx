import React, { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useForm, Controller } from 'react-hook-form';
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
import { UploadComponent } from "../components/UploadComponent";



function PacCrud() {

  const { errors, onSubmitPac, showModal, setMessage, register, isAllowSave, control, actualFullYear } = usePacCrud();

  /* let uploadFileRef = useRef<HTMLInputElement>(null) */

  const [visible, setVisible] = useState<boolean>(false);
  const [file, setfile] = useState<File>(null);

  const getFile = (file: File) => {
    setfile(file)

    return file;
  }

  return (
    <div className="crud-page">
      <div className="main-page full-height">
        <p className="text-black extra-large">
          Cargar archivo
        </p>
        <div className="card-user" >
        
          <FormComponent action={onSubmitPac} id="form-pac" className="form-pac">
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
                idInput={`typeSource`}
                control={control}
                label='Tipo de recurso'
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={'Seleccionar'}
                data={[
                  { id: 1, name: "Transferencias distritales", value: "Distrital" },
                  { id: 2, name: "Recursos propios", value: "Propio" }
                ]}
                filter={true}
                fieldArray={true}
                errors={errors}
              />
              <SelectComponent
                idInput={`typePac`}
                control={control}
                label='Tipo PAC'
                className="select-basic medium"
                classNameLabel="text-black big bold text-required"
                placeholder={'Seleccionar'}
                data={[
                  { id: "1", name: "Carga inicial", value: "Carga inicial" },
                  { id: "2", name: "Adición", value: "Adición" },
                  { id: "3", name: "Reducción", value: "Reducción" },
                  { id: "4", name: "Recaudo", value: "Recaudo" },
                  { id: "5", name: "Nueva versión", value: "Nueva versión" }
                ]}

                filter={true}
                fieldArray={true}
                errors={errors}
              />


            </section>
            
            {/* <div className="title-button text-three large" style={{marginTop:'10px'}} onClick={()=>uploadFileRef.current?.click()}> Seleccionar archivo <BiPlusCircle /> </div>
            <input ref={uploadFileRef} type="file" style={{display:'none'}}/> */}

            <div className="div-upload">
              <br />
              <br />
              <label className="upload-label" style={{ display: 'flex', alignItems: 'center' }} htmlFor="modal">Seleccionar archivo <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00008 5.83331V11.1666" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.6666 8.50002H5.33325" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8 14.5V14.5C4.686 14.5 2 11.814 2 8.5V8.5C2 5.186 4.686 2.5 8 2.5V2.5C11.314 2.5 14 5.186 14 8.5V8.5C14 11.814 11.314 14.5 8 14.5Z" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></label>
              {file != undefined ? (<label className='text-red-500'>{file.name}</label>) : (<></>)}

              <Button label="Show" type="button" style={{ display: 'none' }} name='modal' id='modal' onClick={() => setVisible(true)} />
              <Dialog
                header="Si tienes más de un documento, se deben unir en un solo archivo para ser cargados"
                className='text-center div-modal movil'
                visible={visible}
                onHide={() => setVisible(false)}
                pt={{
                  root: { style: { width: '35em' } }
                }}
              >
                <Controller
                  name='file'
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <UploadComponent
                        id={field.name}
                        dataArchivo={(e: File) => field.onChange(getFile(e))}
                        showModal={(e: boolean) => field.onChange(setVisible(e))}
                      />
                    </>
                  )}
                />
                <Button className='mt-8' type="button" style={{ backgroundColor: '533893' }} onClick={() => setVisible(false)} label="Cancelar" rounded />
              </Dialog>
            </div>

            
            <ButtonComponent
              className="button-main huge hover-three"
              value="Guardar"
              form="form-pac"
              type="submit"
              disabled={!isAllowSave}
            />
          </FormComponent>

        </div>
      </div>
    </div>
  );
}

export default React.memo(PacCrud);
