import React, { useContext, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AppContext } from "../../../common/contexts/app.context";
// import { IMessage } from "../../../common/interfaces/global.interface";
import { useNavigate } from "react-router-dom";
import { IPagoDataSave } from "../interfaces/paysInterfaces";
import { ITableElement } from "../../../common/interfaces/table.interfaces";
import { IErrorTablePac } from "../../pac/interface/Pac";
import { usePaysServices } from "./pays-service";
import * as XLSX from "xlsx";
import useStorePays from "../../../store/store-pays";

export function usePaysCrud() {
  const dateToday = new Date();

  const { setMessage, authorization } = useContext(AppContext);
  const navigate = useNavigate();
  const actualFullYear = dateToday.getFullYear();
  const [isAllowSave, setIsAllowSave] = useState(true);
  const [isVisibleTable, setIsVisibleTable] = useState<boolean>(false);
  const tableComponentRef = useRef(null);
  const [errorsPac, setErrorsPac] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorsLoad, setErrorsLoad] = useState([]);
  const {
    infoErrors,
    setInfoErrors,
    setLoadingSpinner,
    setFieldErrors,
    fieldErrors,
    setInfoSearchPays,
    exerciseLoad,
  } = useStorePays();
  const [selection, setSelection] = useState("");
  const [dataEmpty, setDataEmpty] = useState(false);

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
    getValues,
  } = useForm<IPagoDataSave>({
    defaultValues: {
      tipoDocumento: actualFullYear.toString(),
      register: actualFullYear.toString(),
    },
    mode: "onSubmit",
  });

  const tableColumns: ITableElement<IErrorTablePac>[] = [
    {
      fieldName: "rowError",
      header: "Fila",
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
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Error al leer el archivo como Base64."));
        }
      };

      reader.onerror = () => {
        reject(new Error("Error al leer el archivo."));
      };

      reader.readAsDataURL(file);
    });
  };

  async function processExcelFile(base64Data, tipoDocumento) {
    let dataVacia = false;
    setLoadingSpinner(true)
    setDataEmpty(false)
    setSelection(tipoDocumento)
    setInfoErrors([])
    const responseAllAF = await api.getAllAF();
    const responseAllProject = await api.getAllProjects();
    let infoArrAF = responseAllAF.data;
    let infoArrProject = responseAllProject.data;

    return new Promise(async (resolve, reject) => {
      let infoErrors = [];
      const base64Content = base64Data.split(",")[1];
      const binaryData = atob(base64Content);

      const byteArray = new Uint8Array(binaryData.length);

      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: "application/octet-stream" });

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const range = XLSX.utils.decode_range(sheet["!ref"]);
          const titles = [];
          const dataInformationProjects = []

          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = { c: C, r: 0 };
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            titles.push(sheet[cell_ref]?.v || "Undefined Title");
          }

          

          if (tipoDocumento === "PospreSapiencia" || tipoDocumento === "AreaFuncional") {
            const data = [];
            for (let row = range.s.r + 1; row <= range.e.r; row++) {
              const rowData = {};

              for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = { c: col, r: row };
                const cellRef = XLSX.utils.encode_cell(cellAddress);
                const title = titles[col - range.s.c];
                const value = sheet[cellRef] ? sheet[cellRef].v : undefined;
                let titleNew = title.replace(/ /g, "_").toLowerCase();
                rowData[titleNew] = value;
              }
  
              data.push(rowData);
            }

            if(tipoDocumento === "PospreSapiencia" ){
              data.forEach(async (element, index) => {
                let objData = {
                  "pprNumero": element.pospre_origen.toString(),
                  "pprEjercicio": parseInt(element.ejercicio),
                  "ppsPosicion": parseInt(element.consecutivo_pospre_sapiencia),
                }
                let responseVerifyData = await api.getPospreByParams(objData)
                if (responseVerifyData.data.length > 0) {
                  let objErrors = { "rowError": index+1, "message": `El Pospre sapiencia ya existe para esa vigencia` };
                  infoErrors.push(objErrors);
                }
  
              });
            }

            if (tipoDocumento === "AreaFuncional") {
              let arrayFilterProject = [];

              data.forEach((element) => {
                arrayFilterProject.push(element.proyecto.toString());
              });
            
              let objProjectInfo = {
                "codeList": arrayFilterProject
              };
            
              const getInfoProjectsApi = await api.getProjectDataApi(objProjectInfo);
              let arrInformation = getInfoProjectsApi.data;
            
              let arrBpin = arrInformation.map(element => element.bpin);
               
              data.forEach((element, index) => {
                if (!arrBpin.includes(element.proyecto.toString())) {
                  let objErrors = { "rowError": index + 1, "message": `El proyecto no existe` };
                  infoErrors.push(objErrors);
                }
              });
            }
            
          }

       



          // Inicio de validaciones
          let titleDB, titleExcel;

          switch (tipoDocumento) {
            case "Pagos":
              titleDB = [
                "PAG_CODVRP_VINCULACION_RP",
                "POSICION",
                "PAG_VALOR_CAUSADO",
                "PAG_VALOR_PAGADO",
              ];
              titleExcel = [
                "Consecutivo RP SAP",
                "Posicion",
                "Causado",
                "Pagado",
              ];
              break;
            case "Funds":
              titleDB = [
                "FND_CODECP_ENTIDAD",
                "FND_NUMERO",
                "FND_DENOMINACION",
                "FND_DESCRIPCION",
                "FND_VIGENTE_DESDE",
                "FND_VIGENTE_HASTA",
              ];
              titleExcel = [
                "ENTIDAD CP",
                "CODIGO",
                "DENOMINACION",
                "DESCRIPCION",
                "VALIDEZ DE",
                "VALIDEZ A",
              ];

              break;
            case "AreaFuncional":
              titleDB = ["Codigo", "TipoProyecto", "Proyecto"];
              titleExcel = ["Codigo", "Tipo de Proyecto", "Proyecto"];
              break;
            case "PospreSapiencia":
              titleDB = [
                "PospreOrigen",
                "DenominacionOrigen",
                "DescripcionOrigen",
                "ConsecutivoPospreSapiencia",
                "Ejercicio",
                "DescripcionSapiencia",
              ];
              titleExcel = [
                "Pospre Origen",
                "Denominacion Origen",
                "Descripcion Origen",
                "Consecutivo pospre sapiencia",
                "Ejercicio",
                "Descripcion sapiencia",
              ];
              break;
            case "PospreMGA":
              titleDB = [
                "PospreOrigen",
                "Proyecto",
                "CodigoProductoMGA",
                "ProductoMGA",
                "CodigoActividadMGA",
                "NombreActividadDetalleMGA",
              ];
              titleExcel = [
                "Pospre origen",
                "Proyecto",
                "Codigo producto MGA",
                "Producto MGA",
                "Código actividad MGA",
                "Nombre actividad detalle MGA",
              ];
              break;
            case "RutaPptoInicial":
              titleDB = [
                "CentroGestor",
                "PospreOrigen",
                "PospreSapiencia",
                "AreaFuncional",
                "Fondo",
                "Proyecto",
                "ValorInicial",
              ];
              titleExcel = [
                "Centro gestor",
                "Pospre Origen",
                "Pospre Sapiencia",
                "Área funcional",
                "Fondo",
                "Proyecto",
                "Valor Inicial",
              ];
              break;
          }

          const isValidTitles = titles.every((title, index) => {
            const isTitleEmpty = !title.trim();

            if (isTitleEmpty) {
              console.log(`El título en la posición ${index} está vacío.`);
              let objErrors = {
                rowError: 1,
                message: `El archivo no cumple con la estructura`,
              };
              infoErrors.push(objErrors);
              return false;
            } else if (title !== titleExcel[index]) {
              console.log(
                `El título en la posición ${index} no coincide. Título actual: '${title}', Título esperado: '${titleExcel[index]}'`
              );
              let objErrors = {
                rowError: 1,
                message: `El archivo no cumple con la estructura`,
              };
              infoErrors.push(objErrors);
              return false;
            }

            return true;
          });

          if (isValidTitles) {
            const uniqueRows = new Set();

            for (let R = range.s.r + 1; R <= range.e.r; ++R) {
              const merges = sheet["!merges"];
              if (merges !== undefined) {
                const isMergedRow = merges.some(
                  (merge) => R >= merge.s.r && R <= merge.e.r
                );
                if (isMergedRow) {
                  let objErrors = {
                    rowError: R,
                    message: `El archivo no cumple la estructura.`,
                  };
                  infoErrors.push(objErrors);
                  setDataEmpty(true);
                }
              }
              const rowData = {};

              let hasDuplicate = false;
              let isValidValues = true;

              for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = { c: C, r: R };
                const cell_ref = XLSX.utils.encode_cell(cell_address);
                const value = sheet[cell_ref]?.v;

                if (tipoDocumento == "Pagos") {
                  //validamos la existencia del RP
                  switch (titleDB[C]) {
                    case "POSICION":
                      if (
                        typeof value !== "number" ||
                        !Number.isInteger(value)
                      ) {
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "PAG_VALOR_CAUSADO":
                      if (typeof value !== "number") {
                        if (value === undefined) {
                        } else {
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "PAG_VALOR_PAGADO":
                      if (typeof value !== "number") {
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "PAG_CODVRP_VINCULACION_RP":
                      if (typeof value !== "number") {
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                  }
                } else if (tipoDocumento == "Funds") {
                  switch (titleDB[C]) {
                    case "FND_CODECP_ENTIDAD":
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "FND_NUMERO":
                      if (
                        typeof value !== "number" ||
                        !Number.isInteger(value)
                      ) {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es un número entero.`
                        );
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "DENOMINACION":
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "DESCRIPCION":
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "VALIDEZ DE":
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "VALIDEZ A":
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }
                      break;
                  }
                } else if (tipoDocumento == "AreaFuncional") {

                  const validarEstructura = (value) => {
                    const patron = /^\d{8}\.\d{4}\.\d{2}$/;

                    if (!patron.test(value)) {
                      console.log(
                        `Error en la validación de la fila ${R}, columna ${C + 1}: El valor '${value}' no cumple con la estructura esperada.`
                      );
                      let objErrors = {
                        rowError: R,
                        message: `El codigo no cumple con la estructura esperada`,
                      };
                      infoErrors.push(objErrors);
                    }
                  }

                  switch (titleDB[C]) {
                    case "Codigo":

                      validarEstructura(value)
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }

                      infoArrAF.forEach((element) => {
                        if (element.number === value) {
                          infoArrProject.forEach((datosProject) => {
                            if (datosProject.functionalAreaId === element.id) {
                              let objErrors = {
                                rowError: R,
                                message: `El Área funcional ya existe con ese proyecto`,
                              };
                              infoErrors.push(objErrors);
                            }
                          });
                        }
                      });

                      break;
                    case "TipoProyecto":
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }

                      let valueFunction: string = "funcionamiento";
                      let valueInvertion: string = "inversion";
                      if (value == valueInvertion || value == valueFunction) {
                      } else {
                        let objErrors = {
                          rowError: R,
                          message: `El tipo de proyecto solo puede ser: inversion ó funcionamiento`,
                        };
                        infoErrors.push(objErrors);
                      }

                      break;
                    case "Proyecto":
                      if (typeof value !== 'number' || !Number.isInteger(value)) {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.`);
                        if (value === undefined) { } else {
                          let objErrors = { "rowError": R, "message": `el archivo no cumple la estructura` };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                  }
                } else if (tipoDocumento == "PospreSapiencia") {
                  console.log(value);
                  let objTryData = {}
                  let pprN = "";
                  let pprE = 0;
                  let ppsP = 0;
                  if (titleDB[C] == "PospreOrigen") {
                    objTryData['pprN'] = value;
                    pprN = value
                  }
                  if (titleDB[C] == "Ejercicio") {
                    objTryData['pprE'] = value;
                    pprE = value
                  }
                  if (titleDB[C] == "ConsecutivoPospreSapiencia") {
                    objTryData['ppsP'] = value;
                    ppsP = value
                  }



                  console.log(objTryData);

                  /*                   let objData = {
                                      "pprNumero": titleDB["PospreOrigen"].value.toString(),
                                      "pprEjercicio": parseInt(titleDB["PospreOrigen"].value),
                                      "ppsPosicion": parseInt(titleDB["ConsecutivoPospreSapiencia"].value),
                                    }
                                    let responseVerifyData = await api.getPospreByParams(objData) */
                  /*   if (responseVerifyData.data.length > 0) {
                      let objErrors = { "rowError": R, "message": `El Pospre sapiencia ya existe para esa vigencia` };
                      infoErrors.push(objErrors);
                    } */
                  switch (titleDB[C]) {
                    case "PospreOrigen":
                      if (typeof value !== 'number' || !Number.isInteger(value)) {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.`);
                        if (value === undefined) { } else {
                          let objErrors = { "rowError": R, "message": `el archivo no cumple la estructura` };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "DenominacionOrigen":
                      if (typeof value !== 'number' || !Number.isInteger(value)) {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.`);
                        if (value === undefined) { } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = { "rowError": R, "message": `el archivo no cumple la estructura` };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "DescripcionOrigen":
                      if (typeof value !== 'string') {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es una cadena de texto.`);
                        let objErrors = { "rowError": R, "message": `el archivo no cumple la estructura` };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "ConsecutivoPospreSapiencia":
                      if (typeof value !== 'number' || !Number.isInteger(value)) {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.`);
                        if (value === undefined) { } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = { "rowError": R, "message": `el archivo no cumple la estructura` };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "Ejercicio":
                      if (typeof value !== 'number' || !Number.isInteger(value)) {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.`);
                        if (value === undefined) { } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = { "rowError": R, "message": `el archivo no cumple la estructura` };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "DescripcionSapiencia":
                      if (typeof value !== 'string') {
                        console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es una cadena de texto.`);
                        let objErrors = { "rowError": R, "message": `el archivo no cumple la estructura` };
                        infoErrors.push(objErrors);
                      }
                      break;
                  }
                } else if (tipoDocumento == "PospreMGA") {
                  switch (titleDB[C]) {
                    case "PospreOrigen":
                      if (
                        typeof value !== "number" ||
                        !Number.isInteger(value)
                      ) {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es un número entero.`
                        );
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "Proyecto":
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "CodigoProductoMGA":
                      if (
                        typeof value !== "number" ||
                        !Number.isInteger(value)
                      ) {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es un número entero.`
                        );
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "ProductoMGA":
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "CodigoActividadMGA":
                      if (
                        typeof value !== "number" ||
                        !Number.isInteger(value)
                      ) {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es un número entero.`
                        );
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "NombreActividadDetalleMGA":
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }
                      break;
                  }
                } else if (tipoDocumento == "RutaPptoInicial") {
                  switch (titleDB[C]) {
                    case "CentroGestor":
                      if (
                        typeof value !== "number" ||
                        !Number.isInteger(value)
                      ) {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es un número entero.`
                        );
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "PospreOrigen":
                      if (
                        typeof value !== "number" ||
                        !Number.isInteger(value)
                      ) {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es un número entero.`
                        );
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "PospreSapiencia":
                      if (
                        typeof value !== "number" ||
                        !Number.isInteger(value)
                      ) {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es un número entero.`
                        );
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "AreaFuncional":
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }

                      break;
                    case "Fondo":
                      if (
                        typeof value !== "number" ||
                        !Number.isInteger(value)
                      ) {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es un número entero.`
                        );
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                    case "Proyecto":
                      if (typeof value !== "string") {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es una cadena de texto.`
                        );
                        let objErrors = {
                          rowError: R,
                          message: `el archivo no cumple la estructura`,
                        };
                        infoErrors.push(objErrors);
                      }
                      break;
                    case "ValorInicial":
                      if (
                        typeof value !== "number" ||
                        !Number.isInteger(value)
                      ) {
                        console.log(
                          `Error en la fila ${R}, columna ${C + 1
                          }: El valor '${value}' no es un número entero.`
                        );
                        if (value === undefined) {
                        } else {
                          //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                          let objErrors = {
                            rowError: R,
                            message: `el archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                      }
                      break;
                  }
                }

                // Validar si la celda está vacía

                if (merges === undefined) {
                  if (value === null || value === undefined || value === "") {
                    console.log(
                      `Error en la fila ${R}, columna ${C + 1
                      }: La celda está vacía.`
                    );
                    let objErrors = {
                      rowError: R,
                      message: `Algún dato está vacío`,
                    };
                    infoErrors.push(objErrors);
                    setDataEmpty(true);
                    dataVacia = true;
                  }
                }

                rowData[titleDB[C]] = value;
              }

              let rpSapValue, posicionValue;
              if (tipoDocumento == "Pagos") {
                rpSapValue = rowData["PAG_CODVRP_VINCULACION_RP"];
                posicionValue = rowData["POSICION"];
              } else if (tipoDocumento == "Funds") {
                rpSapValue = rowData["FND_NUMERO"];
              }

              if (rpSapValue !== undefined) {
                if (tipoDocumento === "Pagos" && posicionValue !== undefined) {
                  const key = `${rpSapValue}-${posicionValue}`;

                  if (uniqueRows.has(key)) {
                    console.log(
                      `Error en la fila ${R}: Duplicado encontrado para RP SAP '${rpSapValue}' y Posición '${posicionValue}'.`
                    );
                    let objErrors = {
                      rowError: R,
                      message: `Tiene datos duplicados en el archivo`,
                    };
                    infoErrors.push(objErrors);
                    hasDuplicate = true;
                  } else {
                    uniqueRows.add(key);
                  }
                } else if (tipoDocumento === "Funds") {
                  if (uniqueRows.has(rpSapValue)) {
                    console.log(
                      `Error en la fila ${R}: Duplicado encontrado para el codigo${rpSapValue}'.`
                    );
                    let objErrors = {
                      rowError: R,
                      message: `Tiene datos duplicados en el archivo`,
                    };
                    infoErrors.push(objErrors);
                    hasDuplicate = true;
                  } else {
                    uniqueRows.add(rpSapValue);
                  }
                }
              }

              if (tipoDocumento == "Pagos") {
                if (
                  rowData["PAG_VALOR_CAUSADO"] === 0 &&
                  rowData["PAG_VALOR_PAGADO"] === 0
                ) {
                  console.log(
                    `Error en la fila ${R}: Ambos 'PAG_VALOR_CAUSADO' y 'PAG_VALOR_PAGADO' no pueden ser 0.`
                  );
                  // let objErrors = { "rowError": R, "message": `Error en la fila ${R}: Ambos valor causado y valor pagado no pueden ser 0.` };
                  let objErrors = {
                    rowError: R,
                    message: `el archivo no cumple la estructura.`,
                  };
                  infoErrors.push(objErrors);
                }
              }
              if (tipoDocumento === "Pagos") {
                const posicionValue = rowData["POSICION"];
                const rpSapValue = rowData["PAG_CODVRP_VINCULACION_RP"];

                if (!dataVacia) {
                  const responseValidate = await api.validateExitsRp({
                    posicion: posicionValue,
                    consecutivoSap: rpSapValue,
                  });

                  if (responseValidate["operation"]["code"] == "FAIL") {
                    let objErrors = { rowError: R, message: `EL RP no existe` };
                    infoErrors.push(objErrors);
                  } else {
                    let datos = responseValidate["data"]["datas"];
                    let valorFinal = datos.valorFinal;

                    let sumValues =
                      parseInt(rowData["PAG_VALOR_CAUSADO"]) +
                      parseInt(rowData["PAG_VALOR_PAGADO"]);
                    if (sumValues < valorFinal) {
                      let objErrors = {
                        rowError: R,
                        message: `El valor del RP es mayor del valor causado+pagado`,
                      };
                      infoErrors.push(objErrors);
                    }
                  }
                }
              } else if (tipoDocumento === "Funds") {
                console.log(rowData);
                
                let dataVerify = {
                  numero: rowData["FND_NUMERO"].toString(),
                };

                const responseValidate = await api.getAllFunds(dataVerify);
                if (
                  responseValidate["operation"].message ===
                  "Fondo ya existente."
                ) {
                  let objErrors = {
                    rowError: R,
                    message: `el fondo ya existe.`,
                  };
                  infoErrors.push(objErrors);
                }
              }
            }
            console.log("Datos fila de errores:", infoErrors);
            setInfoErrors(infoErrors);
          } else {
            console.log(
              "El archivo Excel no tiene el formato esperado. Detalles:"
            );
            setInfoErrors(infoErrors);
            // Puedes mostrar un mensaje al usuario o manejar la situación de alguna otra manera
          }
          if (infoErrors.length > 0) {
            console.log(infoErrors);

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

  const updateFieldError = (
    fieldName: keyof typeof fieldErrors,
    hasError: string
  ) => {
    setFieldErrors({
      [fieldName]: hasError,
    });
  };

  useEffect(() => {
    async (data: IPagoDataSave) => {
      const { tipoArchivo, mesDelAnio } = data;
      console.log("hola mund", data);
    };
  }, []);

  const onSubmitPagPays = handleSubmit(async (data: IPagoDataSave) => {
    const { tipoArchivo, mesDelAnio, filedata } = data;
    let tryReturn = false;

    // Validar campos
    if (data.tipoArchivo === undefined) {
      updateFieldError("tipoArchivo", "vacio");
      tryReturn = true;
    }


    if (tipoArchivo == "Pagos") {
      if (data.mesDelAnio === undefined) {
        updateFieldError("mesDelAnio", "vacio");
        tryReturn = true;
      }
    }

    if (tryReturn) {
      console.log("no es posible continuar");
      return;
    }

    let formData = new FormData();
    let fileExcel = data.filedata;
    const base64Data = await readFileAsBase64(fileExcel);
    const tipoDocumento = data.tipoArchivo;
    const mes = data.mesDelAnio;
    const ejercicio = exerciseLoad;

    const verification = await processExcelFile(base64Data, tipoDocumento);

    if (verification === true) {
      setLoadingSpinner(false);

      let exercise = ejercicio.toString();
      console.log("entr1", exercise);
      let obInfo = {
        fileContent: base64Data,
        documentType: tipoDocumento,
        usuarioCreo: authorization.user.numberDocument,
        mes: mes,
        ejercicio: ejercicio,
      };

      setMessage({
        title: "Guardar Información",
        description: `¿Estás segur@ de guardar la informacion ?`,
        show: true,
        OkTitle: "Aceptar",
        cancelTitle: "Cancelar",
        onOk: async () => {
          try {
            const response = await api.loadPays(obInfo);
            setTimeout(() => {
              if (response["operation"]["code"] == "OK") {
                setMessage({
                  title: "Confirmación",
                  description: "Guardado Exitosamente!",
                  show: true,
                  OkTitle: "Cerrar",
                  onOk: () => {
                    //onCancelNew();
                    setInfoErrors([]);
                    if (tipoArchivo === "Pagos") {
                      navigate("./../");
                    }
                    setMessage({});
                  },
                  background: true,
                });
              }

              if (response["operation"]["code"] === "FAIL") {
                setMessage({
                  title: "Error al cargar la informacion",
                  description: response["operation"]["message"],
                  show: true,
                  OkTitle: "Aceptar",
                  onOk: () => {
                    onCancelNew();
                    setMessage({});
                  },
                  background: true,
                });
                return;
              }
            }, 1500);
          } catch (error) {
            console.error("Error al enviar los datos:", error);
          }
          setMessage({});
        },
        onCancel() {
          onCancelNew();
          setMessage({});
        },
        background: true,
      });
    } else {
      setLoadingSpinner(false);
      setMessage({
        title: "Carga de archivo",
        description: "El archivo no pudo ser cargado, revisa las validaciones",
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          onCancelNew();
          setMessage({});
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
  };
}
