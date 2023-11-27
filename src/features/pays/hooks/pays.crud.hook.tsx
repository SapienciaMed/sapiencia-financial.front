import React, { useContext, useState, useRef } from "react";
import { useForm } from 'react-hook-form';
import { AppContext } from "../../../common/contexts/app.context";
import { IMessage } from "../../../common/interfaces/global.interface";
import { useNavigate } from "react-router-dom";
import { IPagoDataSave } from "../interfaces/paysInterfaces";
import { ITableElement } from "../../../common/interfaces/table.interfaces";
import { IErrorTablePac } from "../../pac/interface/Pac";
import { usePaysServices } from "./pays-service";
import * as XLSX from 'xlsx';
import useStorePays from "../../../store/store-pays";

export function usePaysCrud() {
  const dateToday = new Date()

  const { setMessage, authorization } = useContext(AppContext);
  const navigate = useNavigate();
  const actualFullYear = dateToday.getFullYear();
  const [isAllowSave, setIsAllowSave] = useState(true)
  const [isVisibleTable, setIsVisibleTable] = useState<boolean>(false);
  const tableComponentRef = useRef(null);
  const [errorsPac, setErrorsPac] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorsLoad, setErrorsLoad] = useState([])
  const { infoErrors, setInfoErrors } = useStorePays()


  const api = usePaysServices();

  const onCancelNew = () => {
    navigate("./");
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setValue: setValueRegister,
    reset,
    control,
    watch,
    getValues
  } = useForm<IPagoDataSave>({
    defaultValues: {
      tipoDocumento: actualFullYear.toString(),
      register: actualFullYear.toString(),
    },
    mode: 'onSubmit'
  });

  const tableColumns: ITableElement<IErrorTablePac>[] = [
    {
      fieldName: "rowError",
      header: "Fila"
    },
    {
      fieldName: "message",
      header: "Validación",
    },

  ];


  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Error al leer el archivo como Base64.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo.'));
      };

      reader.readAsDataURL(file);
    });
  };

  async function processExcelFile(base64Data, tipoDocumento) {
    return new Promise((resolve, reject) => {
      let infoErrors = []
      const base64Content = base64Data.split(',')[1];
      const binaryData = atob(base64Content);

      const byteArray = new Uint8Array(binaryData.length);

      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: 'application/octet-stream' });

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const range = XLSX.utils.decode_range(sheet['!ref']);
          const titles = [];

          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = { c: C, r: 0 };
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            titles.push(sheet[cell_ref]?.v || 'Undefined Title');
          }

          // Inicio de validaciones
          let titleDB, titleExcel;

          switch (tipoDocumento) {
            case "Pagos":
              titleDB = ["POSICION", "PAG_VALOR_CAUSADO", "PAG_VALOR_PAGADO", "PAG_CODVRP_VINCULACION_RP"];
              titleExcel = ['Posicion', 'Causado', 'Pagado', 'Consecutivo RP SAP'];
              break;
            case "Funds":
              titleDB = ["FND_DENOMINACION", "FND_DESCRIPCION", "FND_VIGENTE_DESDE", "FND_VIGENTE_HASTA"];
              titleExcel = ['DENOMINACION', 'DESCRIPCION', 'VALIDEZ DE', 'VALIDEZ A'];

              break;
            // Agrega otros casos según sea necesario

          }

          const isValidTitles = titles.every((title, index) => {
            const isTitleEmpty = !title.trim();

            if (isTitleEmpty) {
              console.log(`El título en la posición ${index} está vacío.`);
              return false;
            } else if (title !== titleExcel[index]) {
              console.log(`El título en la posición ${index} no coincide. Título actual: '${title}', Título esperado: '${titleExcel[index]}'`);
              return false;
            }

            return true;
          });

          if (isValidTitles) {
            console.log('Los títulos coinciden. Procede con el procesamiento del archivo Excel.');
            const merges = sheet['!merges'];
            const uniqueRows = new Set();

            for (let R = range.s.r + 1; R <= range.e.r; ++R) {
              const rowData = {};
              if (merges !== undefined) {
                const isMergedRow = merges.some((merge) => R >= merge.s.r && R <= merge.e.r);
                let objErrors = { "rowError": R, "message": `Error en la fila ${R}: La fila está combinada.` };
                infoErrors.push(objErrors);
              }

              let hasDuplicate = false;
              let isValidValues = true;

              for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = { c: C, r: R };
                const cell_ref = XLSX.utils.encode_cell(cell_address);
                const value = sheet[cell_ref]?.v;

                if (tipoDocumento == "Pagos") {
                  switch (titleDB[C]) {
                    case "POSICION":
                      if (typeof value !== 'number' || !Number.isInteger(value)) {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.`);
                        let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "PAG_VALOR_CAUSADO":
                      if (typeof value !== 'number') {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número.`);
                        let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "PAG_VALOR_PAGADO":
                      if (typeof value !== 'number') {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número.`);
                        let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "PAG_CODVRP_VINCULACION_RP":
                      if (typeof value !== 'number') {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número.`);
                        let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                        infoErrors.push(objErrors);
                      }
                      break;

                  }

                } else if (tipoDocumento == "Funds") {
                  switch (titleDB[C]) {
                    case "FND_CODECP_ENTIDAD":
                      if (typeof value !== 'string') {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es una cadena de texto.`);
                        let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "FND_CODIGO":
                      if (typeof value !== 'number' || !Number.isInteger(value)) {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.`);
                        let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "DENOMINACION":
                      if (typeof value !== 'string') {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es una cadena de texto.`);
                        let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "DESCRIPCION":
                      if (typeof value !== 'string') {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es una cadena de texto.`);
                        let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "VALIDEZ DE":
                      if (typeof value !== 'string') {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es una cadena de texto.`);
                        let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "VALIDEZ A":
                      if (typeof value !== 'string') {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es una cadena de texto.`);
                        let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                        infoErrors.push(objErrors);
                      }
                      break;

                  }

                }

                // Validar si la celda está vacía
                if (value === null || value === undefined || value === "") {
                  console.log(`Error en la fila ${R}, columna ${C + 1}: La celda está vacía.`);
                  let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: La celda está vacía.` };
                  infoErrors.push(objErrors);
                }

                rowData[titleDB[C]] = value;
              }

              let rpSapValue, posicionValue
              if (tipoDocumento == "Pagos") {
                rpSapValue = rowData['PAG_CODVRP_VINCULACION_RP'];
                posicionValue = rowData['POSICION'];
              } else if (tipoDocumento == "Funds") {
                rpSapValue = rowData['FND_CODIGO'];

              }


              if (rpSapValue !== undefined) {
                if (tipoDocumento === "Pagos" && posicionValue !== undefined) {
                  const key = `${rpSapValue}-${posicionValue}`;

                  if (uniqueRows.has(key)) {
                    console.log(`Error en la fila ${R}: Duplicado encontrado para RP SAP '${rpSapValue}' y Posición '${posicionValue}'.`);
                    let objErrors = { "rowError": R, "message": `Error en la fila ${R}: Duplicado encontrado para RP SAP '${rpSapValue}' y Posición '${posicionValue}'.` };
                    infoErrors.push(objErrors);
                    hasDuplicate = true;
                  } else {
                    uniqueRows.add(key);
                  }
                } else if (tipoDocumento === "Funds") {
                  if (uniqueRows.has(rpSapValue)) {
                    console.log(`Error en la fila ${R}: Duplicado encontrado para el codigo${rpSapValue}'.`);
                    let objErrors = { "rowError": R, "message": `Error en la fila ${R}: Duplicado encontrado para el CODIGO'${rpSapValue}'.` };
                    infoErrors.push(objErrors);
                    hasDuplicate = true;
                  } else {
                    uniqueRows.add(rpSapValue);
                  }
                }
              }
              /* 
                            if (rpSapValue !== undefined && posicionValue !== undefined) {
                              const key = `${rpSapValue}-${posicionValue}`;
              
                              if (uniqueRows.has(key)) {
                                console.log(`Error en la fila ${R}: Duplicado encontrado para RP SAP '${rpSapValue}' y Posición '${posicionValue}'.`);
                                let objErrors = { "rowError": R, "message": `Error en la fila ${R}: Duplicado encontrado para RP SAP '${rpSapValue}' y Posición '${posicionValue}'.` };
                                infoErrors.push(objErrors);
                                hasDuplicate = true;
                              } else {
                                uniqueRows.add(key);
                              }
              
                            } */
              if (tipoDocumento == "Pagos") {
                if (rowData['PAG_VALOR_CAUSADO'] === 0 && rowData['PAG_VALOR_PAGADO'] === 0) {
                  console.log(`Error en la fila ${R}: Ambos 'PAG_VALOR_CAUSADO' y 'PAG_VALOR_PAGADO' no pueden ser 0.`);
                  let objErrors = { "rowError": R, "message": `Error en la fila ${R}: Ambos valor causado y valor pagado no pueden ser 0.` };
                  infoErrors.push(objErrors);
                }
              }


              console.log('Datos de la fila:', rowData);
            }
            console.log('Datos fila de errores:', infoErrors);
            setInfoErrors(infoErrors)
          } else {
            console.log('El archivo Excel no tiene el formato esperado. Detalles:');
            // Puedes mostrar un mensaje al usuario o manejar la situación de alguna otra manera
          }
          if (infoErrors.length > 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.readAsBinaryString(blob);
    });
  }


  const onSubmitPagPays = handleSubmit(async (data: IPagoDataSave) => {
    let formData = new FormData();
    let fileExcel = data.filedata;
    const base64Data = await readFileAsBase64(fileExcel);
    const tipoDocumento = data.tipoArchivo;
    const mes = data.mesDelAnio;

    const verification = await processExcelFile(base64Data, tipoDocumento);
    if (verification) {
      let obInfo = {
        fileContent: base64Data,
        documentType: tipoDocumento,
        usuarioCreo: authorization.user.numberDocument,
        mes: mes
      }
      setMessage({
        title: "Guardar Información",
        description: `¿Estás segur@ de guardar la informacion ?`,
        show: true,
        OkTitle: "Aceptar",
        cancelTitle: "Cancelar",
        onOk: async () => {
          try {
            const response = await api.loadPays(obInfo)
            setTimeout(() => {
              if (response['operation']['code'] == "OK") {
                setMessage({
                  title: "Confirmación",
                  description: "Guardado Exitosamente!",
                  show: true,
                  OkTitle: "Cerrar",
                  onOk: () => {
                    //onCancelNew();
                    navigate("./../");
                    setMessage({})
                  },
                  background: true,
                });
              }


              if (response['operation']['code'] === "FAIL") {
                setMessage({
                  title: "Error al crear CDP",
                  description: response['operation']['message'],
                  show: true,
                  OkTitle: "Aceptar",
                  onOk: () => {
                    onCancelNew();
                    setMessage({});
                  },
                  background: true,
                });
                return
              }
            }, 1500);

          } catch (error) {
            console.error("Error al enviar los datos:", error);
          }
          setMessage({});
        }, onCancel() {
          onCancelNew();
          setMessage({})
        },
        background: true,
      });
    }

  });

  function loadTableData(searchCriteria?: object): void {
    if (tableComponentRef.current) {
      tableComponentRef.current.loadData(searchCriteria);
    }
  }

  return {
    onSubmitPagPays,
    errors,
    //showModal,
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
  }
}