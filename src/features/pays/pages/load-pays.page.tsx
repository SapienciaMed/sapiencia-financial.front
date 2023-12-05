import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from 'react-hook-form';
import {
  ButtonComponent,
  ButtonLoadingComponent,
  FormComponent,
  InputComponent,
  SelectComponent,
} from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import TableDataPropComponent from "../../../common/components/tableDataProp.component";
import { usePacCrud } from "../../pac/createPac/hook/pac-crud.hook";
import { usePaysCrud } from "../hooks/pays.crud.hook"
import UploadComponent from "../../pac/createPac/components/UploadComponent";
import useStorePays from "../../../store/store-pays";
import { Backdrop, CircularProgress } from '@mui/material';
import '../../../styles/pays.scss';

function LoadPays() {
  const {
    errors,
    onSubmitPagPays,
    // showModal,
    setMessage,
    register,
    isAllowSave,
    control,
    actualFullYear,
    isVisibleTable,
    tableComponentRef,
    tableColumns,
    errorsPac,
    isLoading,
  } = usePaysCrud();

  const btnUploadFileRef = useRef(null);

  /* let uploadFileRef = useRef<HTMLInputElement>(null) */

  const [visible, setVisible] = useState<boolean>(false);
  const [file, setFile] = useState<File>(null);
  const [isVisibleErrors, setIsVisibleErrors] = useState(false);
  const [isUploadFileSt, setIsUploadFileSt] = useState(false);
  const [errorsSt, setErrorsSt] = useState([]);
  const { infoErrors, setInfoErrors, loadingSpinner,fieldErrors } = useStorePays()
  const [defaultExercise, setDefaultExercise] = useState(actualFullYear.toString())
  const [showBtnValidation, setShowBtnValidation] = useState(false)
  const [showTableErrors, setShowTableErrors] = useState(false)
  const getFile = (newFile: File) => {
    setFile(newFile);
    return newFile;
  };

  useEffect(()=>{setInfoErrors([])},[])
  const uploadFileFn = (newFile: any) => {
    if (newFile.name) {
      setIsUploadFileSt(true);
    } else {
      setIsUploadFileSt(false);
    }
  };

  const mesesDelAnio = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const { watch } = useForm();

  const defaultExercise_ = watch('exercise');
  const defaultTipoArchivo = watch('tipoArchivo');
  const defaultMes = watch('mesDelAnio');

  const tipoArchivo = watch('tipoArchivo');

  

  let styleSelects = {
    display: 'none'
  }

  useEffect(() => {
    console.log("este es el vo",tipoArchivo);

  }, [tipoArchivo])

  const mesesOptions = mesesDelAnio.map((mes, index) => ({
    id: index + 1,
    name: mes,
    value: index + 1,
  }));

  const [dataTableSt, setDataTableSt] = useState<any>();

  useEffect(() => {
    errorsPac.sort((a, b) => a.rowError - b.rowError);
    setDataTableSt(errorsPac);
    setErrorsSt(errorsPac);
  }, [errorsPac]);

  useEffect(() => {
    setErrorsSt([]);
    setIsVisibleErrors(false);
  }, [file]);
  var dropdown = document.getElementById('tipoArchivo');


  // useEffect to log 'tipoArchivo' changes
  useEffect(() => {
    console.log(dropdown);
  }, [dropdown]);





  const handleChange = (event) => {
    const enteredValue = event.target.value;
    const maxYearLength = 4;

    if (/^\d*$/.test(enteredValue) && enteredValue.length <= maxYearLength) {
      const enteredYear = parseInt(enteredValue, 10);
      const currentYear = new Date().getFullYear();

      if (enteredValue.length === maxYearLength && !isNaN(enteredYear) && enteredYear < currentYear) {
        setDefaultExercise(currentYear.toString());
      } else {
        setDefaultExercise(enteredValue);
      }
    }
  };

  const handleShowValidation = () => {
    setShowTableErrors(true)
  }

  const handleTipoArchivoChange = (selectedValue) => {
    // Hacer algo con el valor seleccionado (selectedValue)
    console.log("Tipo de archi:", selectedValue);
    };

  useEffect(() => {
    if (infoErrors.length > 0) {
      setShowBtnValidation(true)
    } else {
      setShowTableErrors(false)
      setShowBtnValidation(false)
    }
  }, [infoErrors])

  const styleButtonValidation = {
    width: '152px',
    height: '43px',
    padding: '12px 5px 12px 16px',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius: '100px',
    border: '1px solid #533893',
    background: '#FFF',
    color: '#533893',
    display: showBtnValidation ? 'flex' : 'none'
  }

  return (
    <div className="crud-page">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingSpinner}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="main-page full-height">
        <p className="text-black extra-large">Cargar pagos</p>
        <div className="card-user">
          <FormComponent
            action={onSubmitPagPays}
            id="form-load-pays"
            className="form-load-pays"
          >
            <section className="grid-form-2-container-reverse grid-column-e-proj-operation mt-5px">
              <InputComponent
                idInput="exercise"
                className={`input-basic medium`}
                typeInput="text"
                value={defaultExercise}
                label="Vigencia"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                errors={errors}
                disabled={false}
                onChange={handleChange}
              />

              <SelectComponent
                idInput="tipoArchivo"
                control={control}
                label="Tipo de archivo"
                className={`select-basic medium ${fieldErrors.tipoArchivo ? 'error' : ''}`}
                classNameLabel="text-black big bold text-required"
                placeholder={"Seleccionar"}
                data={[
                  {
                    id: 1,
                    name: "Pagos",
                    value: "Pagos",
                  },
                  {
                    id: 2,
                    name: "Fondos",
                    value: "Funds",
                  },
                  {
                    id: 3,
                    name: "Área funcional",
                    value: "AreaFuncional",
                  },
                  {
                    id: 4,
                    name: "Pospre origen y sapiencia",
                    value: "PospreSapiencia",
                  },
                  {
                    id: 5,
                    name: "Pospre origen y MGA",
                    value: "PospreMGA",
                  },
                  {
                    id: 6,
                    name: "Ruta y Ppto Inicial",
                    value: "RutaPptoInicial",
                  },
                ]}
                filter={true}
                errors={errors}
                direction={EDirection.column}
                onChange={(event) => handleTipoArchivoChange(event.target.value)}
              >
                {fieldErrors.tipoArchivo && (
                  <p className="error-message">Este campo es obligatorio</p>
                )}
              </SelectComponent>
              <SelectComponent
                idInput="mesDelAnio"
                control={control}
                label="Mes"
                className={`select-basic medium ${fieldErrors.mesDelAnio ? 'error' : ''}`}
                classNameLabel="text-black big bold text-required"
                placeholder="Seleccionar"
                data={mesesOptions}
                filter={true}
                errors={errors}
                direction={EDirection.column}
              >
                {fieldErrors.mesDelAnio && (
                  <p className="error-message">Este campo es obligatorio</p>
                )}
              </SelectComponent>
              <div className="div-upload">
                <br />
                <br />

                <div className="display-align-flex-center">
                  <div>
                    <label
                      className="upload-label"
                      style={{ display: "flex", alignItems: "center", color: "#533893" }}
                      htmlFor="modal"
                    >
                      Seleccionar archivo{" "}
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00008 5.83331V11.1666"
                          stroke="#533893"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M10.6666 8.50002H5.33325"
                          stroke="#533893"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8 14.5V14.5C4.686 14.5 2 11.814 2 8.5V8.5C2 5.186 4.686 2.5 8 2.5V2.5C11.314 2.5 14 5.186 14 8.5V8.5C14 11.814 11.314 14.5 8 14.5Z"
                          stroke="#533893"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </label>
                    {file != undefined ? (
                      <label className="text-red-500">{file.name}</label>
                    ) : (
                      <></>
                    )}
                    <Button
                      label="Show"
                      type="button"
                      style={{ display: "none" }}
                      name="modal"
                      id="modal"
                      onClick={() => setVisible(true)}
                    />
                    <Button
                      type="button"
                      style={styleButtonValidation}
                      name="validaciones"
                      id="validaciones"
                      onClick={handleShowValidation}
                    >
                      <span>Validación
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M1.13575 13.498C0.95475 13.193 0.95475 12.807 1.13575 12.502C3.04075 9.279 6.52075 6.5 10.0007 6.5C13.4807 6.5 16.9597 9.279 18.8647 12.501C19.0457 12.807 19.0457 13.194 18.8647 13.5C16.9597 16.721 13.4807 19.5 10.0007 19.5C6.52075 19.5 3.04075 16.721 1.13575 13.498Z" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M12.1218 10.879C13.2938 12.051 13.2938 13.95 12.1218 15.122C10.9498 16.294 9.05076 16.294 7.87876 15.122C6.70676 13.95 6.70676 12.051 7.87876 10.879C9.05076 9.707 10.9508 9.707 12.1218 10.879" stroke="#058CC1" stroke-width="1.4286" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M10.0008 1V3.5" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M3.00076 3L4.68076 5" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M17.0007 3L15.3207 5" stroke="#058CC1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                    </Button>
                  </div>

                  {errorsSt.length > 0 && (
                    <ButtonComponent
                      className="button-clean-fields button-border"
                      value="Validación"
                      type="button"
                      action={() => setIsVisibleErrors(!isVisibleErrors)}
                    />
                  )}
                </div>

                <Dialog
                  header="Si tienes más de un documento, se deben unir en un solo archivo para ser cargados"
                  className="text-center div-modal movil"
                  visible={visible}
                  onHide={() => setVisible(false)}
                  pt={{
                    root: { style: { width: "35em" } },
                  }}
                >
                  <Controller
                    name="filedata"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <UploadComponent
                          id={field.name}
                          dataArchivo={(e: File) => {
                            if (e && e.name) {
                              field.onChange(getFile(e));
                              uploadFileFn(e);
                              setVisible(false)
                            }
                          }}
                          showModal={(e: boolean) => {
                            field.onChange(setVisible(e));
                          }}
                        />
                      </>
                    )}
                  />
                  <div style={{ padding: "1rem" }}>
                    <Button
                      className="mt-8"
                      type="button"
                      style={{ backgroundColor: "533893" }}
                      onClick={() => setVisible(false)}
                      label="Cancelar"
                      rounded
                    />
                  </div>
                </Dialog>
              </div>
            </section>

            <input
              type="submit"
              style={{ display: "none" }}
              ref={btnUploadFileRef}
            />
          </FormComponent>
        </div>
        <br />
        {showTableErrors && (
          <div
            className={
              showTableErrors ? "card-user isVisible" : "card-user isNotVisible"
            }
          >
            <TableDataPropComponent
              ref={tableComponentRef}
              dataTable={infoErrors}
              columns={tableColumns}
              isShowModal={false}
              titleMessageModalNoResult={"No se encontraron registros"}
              secondaryTitle="Validaciones"
            />
          </div>
        )}
      </div>

      <div className="buttons-bot" style={{ position: 'fixed', bottom: 0, right: 0, display: 'flex', justifyContent: 'flex-end', width: '25%', marginBottom: '15px', marginRight: '15px' }}>
        <span
          className="bold text-center button"
          onClick={() => { console.log("gola") }}
          style={{
            marginTop: '10px',
            marginRight: '10px',
          }}
        >
          Cancelar
        </span>
        <ButtonLoadingComponent
          className="button-main huge hover-three"
          value="Guardar"
          form="form-load-pays"
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
  );
}

export default React.memo(LoadPays);