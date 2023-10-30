import React, { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Controller } from 'react-hook-form';
import {
  ButtonComponent,
  ButtonLoadingComponent,
  FormComponent,
  InputComponent,
  SelectComponent,
} from "../../../../common/components/Form";
import { EDirection } from "../../../../common/constants/input.enum";
import { usePacCrud } from "../hook/pac-crud.hook";
import { UploadComponent } from "../components/UploadComponent";
import TableDataPropComponent from "../../../../common/components/tableDataProp.component";



function PacCrud() {

  const { errors, onSubmitPac, showModal, setMessage, register, isAllowSave, control, actualFullYear, isVisibleTable, tableComponentRef, tableColumns, errorsPac, isLoading } = usePacCrud();

  const btnUploadFileRef = useRef(null)

  /* let uploadFileRef = useRef<HTMLInputElement>(null) */

  const [visible, setVisible] = useState<boolean>(false);
  const [file, setfile] = useState<File>(null);
  const [isVisibleErrors, setIsVisibleErrors] = useState(false)
  const [isUploadFileSt, setIsUploadFileSt] = useState(false)
  const [errorsSt, setErrorsSt] = useState([])

  const getFile = (file: File) => {
    setfile(file)
    return file;
  }

  const uploadFileFn = (file: any) => {
    if (file.name) {
      setIsUploadFileSt(true)
    } else {
      setIsUploadFileSt(false)
    }
  }


  const [dataTableSt, setDataTableSt] = useState<any>()

  useEffect(() => {
    errorsPac.sort((a, b) => a.rowError - b.rowError);
    setDataTableSt(errorsPac)
    setErrorsSt(errorsPac)
  }, [errorsPac])

  useEffect(() => {
    setErrorsSt([])
    setIsVisibleErrors(false)
  }, [file])


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
                idInput='typeSource'
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
                errors={errors}
                direction={EDirection.column}
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
                errors={errors}
                direction={EDirection.column}
              />
            </section>

            <div className="div-upload">
              <br />
              <br />

              <div className="display-align-flex-center">
                <div>
                  <label className="upload-label" style={{ display: 'flex', alignItems: 'center' }} htmlFor="modal">Seleccionar archivo <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00008 5.83331V11.1666" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.6666 8.50002H5.33325" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8 14.5V14.5C4.686 14.5 2 11.814 2 8.5V8.5C2 5.186 4.686 2.5 8 2.5V2.5C11.314 2.5 14 5.186 14 8.5V8.5C14 11.814 11.314 14.5 8 14.5Z" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></label>
                  {file != undefined ? (<label className='text-red-500'>{file.name}</label>) : (<></>)}
                  <Button label="Show" type="button" style={{ display: 'none' }} name='modal' id='modal' onClick={() => setVisible(true)} />
                </div>

                {
                  errorsSt.length > 0 && (
                    <ButtonComponent
                      className="button-clean-fields button-border"
                      value="Validación"
                      type="button"
                      action={() => setIsVisibleErrors(!isVisibleErrors)}
                    />
                  )
                }

              </div>


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
                        dataArchivo={(e: File) => { field.onChange(getFile(e)); uploadFileFn(e); }}
                        showModal={(e: boolean) => field.onChange(setVisible(e))}
                      />
                    </>
                  )}
                />
                <div style={{ padding: '1rem' }}>
                  <Button className='mt-8' type="button" style={{ backgroundColor: '533893' }} onClick={() => setVisible(false)} label="Cancelar" rounded />

                </div>
              </Dialog>
            </div>
            <input type="submit" style={{ display: 'none' }} ref={btnUploadFileRef} />
          </FormComponent>
        </div>
        <br />
        {
          isVisibleErrors && dataTableSt.length > 0 && errorsSt.length > 0 && (
            <div
              className={
                !isVisibleTable ? "card-user isVisible" : "card-user isNotVisible"
              }
            >
                  <TableDataPropComponent
                    ref={tableComponentRef}
                    dataTable={dataTableSt}
                    columns={tableColumns}
                    isShowModal={false}
                    titleMessageModalNoResult={"No se encontraron registros"}
                    secondaryTitle="Validaciones"
                  />
          
            </div>
          )
        }
      </div>

      <div className="container-button-bot">
        <div className="buttons-bot" >
          {/* <span
            className="bold text-center button"
          onClick={() => {
            confirmClose(action === "new" ? onCancelNew : onCancelEdit, action);
          }}
          >
            Cancelar
          </span> */}
          {/* <ButtonComponent
              className="button-main huge hover-three"
              value="Guardar"
              type="submit"
              form="funds-form"
              disabled={true}
            /> */}

          <ButtonLoadingComponent
            className="button-main huge hover-three"
            value="Guardar"
            form="form-pac"
            type="button"
            action={() => {
              btnUploadFileRef.current.click();
              /* setIsUploadFileSt(false) */
            }}
            disabled={!isUploadFileSt}
            isLoading={isLoading}
          />
        </div>






      </div>
    </div>
  );
}

export default React.memo(PacCrud);
