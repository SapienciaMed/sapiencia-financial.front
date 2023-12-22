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
import { useBudgetRoutesService } from "../../budget-routes/hooks/budget-routes-service.hook";
import { useTypesTranfersService } from "../../managementCenter/transfer/hook/types-transfers-service.hook";
import { ValidateRouteAnInitialBudget } from "./validate-route-and-initial-budget";

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
  const [aditionalData, setAditionalData] = useState([]);
  const {
    infoErrors,
    setInfoErrors,
    setLoadingSpinner,
    setFieldErrors,
    fieldErrors,
    setInfoSearchPays,
    exerciseLoad,
  } = useStorePays();

  useEffect(() =>{
    console.log(exerciseLoad);
    
  },[])

  const { GetAllRoutesByExcercise } = useBudgetRoutesService()
  const { GetProjectsStrategicVinculation } = useTypesTranfersService()
  const [getAllPospre, setGetAllPospre] = useState([])
  const [getAllFundsListSt, setGetAllFundsListSt] = useState([])
  const [getAllPospreSapienciaListSt, setGetAllPospreSapienciaListSt] = useState([])

  const [selection, setSelection] = useState("");
  const [dataEmpty, setDataEmpty] = useState(false);

  const { checkBudgetRouteDoesNotExist, dataRoutesToInsertStRef, projectCodeSearchInStrategicRef, checkValueBudgetWithProjectPlanning, dataRoutesToInsertStFixedRef } = ValidateRouteAnInitialBudget()

  const api = usePaysServices('financial');
  const strategicServices = usePaysServices('strategic');

  const onCancelNew = () => {
    navigate("./");
  };

  const [dataBudgetRoutesCreatedSt, setDataBudgetRoutesCreatedSt] = useState([])
  useEffect(() => {
    const getAllRoutesIfExist = async (exercise: number) => {
      let dataRoutesCreated = await GetAllRoutesByExcercise(exercise)
      setDataBudgetRoutesCreatedSt(dataRoutesCreated.data)
    }
    getAllRoutesIfExist(2023)
    api.getAllBudgets().then(res => {
      setGetAllPospre(res.data)
    })
    api.getAllFundsList().then(res => {
      setGetAllFundsListSt(res.data)
    })
    api.getAllPospreSapienciaList().then(res => {
      setGetAllPospreSapienciaListSt(res.data)
    })
  }, [])

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
  let infoSendVPY = [];

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
                "Consecutivo"
              ];
              titleExcel = [
                "Pospre origen",
                "Proyecto",
                "Codigo producto MGA",
                "Producto MGA",
                "Código actividad MGA",
                "Nombre actividad detalle MGA",
                "Consecutivo actividad detallada"
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
  
            if (titles.length != titleExcel.length) {
              let objErrors = {
                rowError: 1,
                message: `El archivo no cumple con la estructura`,
              };
              infoErrors.push(objErrors);
              return false;
            }

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

            if (tipoDocumento === "PospreSapiencia" || tipoDocumento === "AreaFuncional" || tipoDocumento === "PospreMGA") {
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

              if (tipoDocumento === "PospreSapiencia") {
                const allBudget = await api.getAllBudgets();
                let dataBudget = allBudget.data;

                data.forEach(async (element, index) => {
                  const matchingObject = dataBudget.find(obj => parseInt(obj.number) === parseInt(element.pospre_origen));

                  let objData = {
                    "pprNumero": element.pospre_origen.toString(),
                    "pprEjercicio": parseInt(element.ejercicio),
                    "ppsPosicion": element.consecutivo_pospre_sapiencia,
                  }

                  let responseVerifyData = await api.getPospreByParams(objData)

                  if (responseVerifyData.data.length > 0) {
                    let objErrors = { "rowError": index + 1, "message": `El Pospre sapiencia ya existe para esa vigencia` };
                    infoErrors.push(objErrors);
                  }
                });
              }

              if (tipoDocumento === "AreaFuncional") {
                let arrayFilterProject = [];
                data.forEach((element) => {
                  if(element.proyecto !== undefined) {
                    arrayFilterProject.push(element?.proyecto?.toString());
                  }
                });

                let objProjectInfo = {
                  "codeList": arrayFilterProject
                };

                const getInfoProjectsApi = await strategicServices.getProjectDataApi(objProjectInfo);
                let arrInformation = getInfoProjectsApi.data;
                console.log("informacion planecion", arrInformation);

                let arrBpin = arrInformation.map(element => element.bpin);
                console.log("informacion bpin", arrBpin);

                data.forEach((element, index) => {
                  if (!arrBpin.includes(element?.proyecto?.toString())) {
                    let objErrors = { "rowError": index + 1, "message": `El proyecto no existe` };
                    infoErrors.push(objErrors);
                  }
                });

                arrInformation.forEach((element, index) => {
                  let objProjectInfo = { id: element.id, bpin: element.bpin, tipoProyecto: data[index].tipo_de_proyecto }
                  infoSendVPY.push(objProjectInfo)
                });
                console.log("info Push VPY", infoSendVPY);
              }

              if (tipoDocumento === "PospreMGA") {
                const allBudget = await api.getAllBudgets();
                const dataBudget = allBudget.data;

                const arrayFilterProject = data.map(element => element.proyecto.toString());
                const objProjectInfo = { "codeList": arrayFilterProject };

                const getInfoProjectsApi = await strategicServices.getProjectDataApiMga(objProjectInfo);
                const arrInformation = getInfoProjectsApi.data;

                const arrPosPreids = data.map(element => {
                  const matchingObject = dataBudget.find(obj => parseInt(obj.number) === parseInt(element.pospre_origen));
                  return matchingObject ? matchingObject.id : null;
                });

                const infoErrorsTemp = [];

                const arrProjectIds = arrInformation.map(info => info.id);
                for (const [index, element] of data.entries()) {
                  const posPreId = arrPosPreids[index];

                  const getInfoProjectsApiV2 = await strategicServices.getProjectDataApi(objProjectInfo);
                  let arrInformationPlaneacion = getInfoProjectsApiV2.data;

                  let arrIdsPlaneacion = []
                  let arrActivitisId = []
                  let detailsActivityId = []
                  arrInformationPlaneacion.forEach((element, index) => {
                    arrIdsPlaneacion.push(element.id)
                    arrActivitisId.push(element.activities[index].id)
                    // detailsActivityId.push(element.activities.detailActivities[index].id)
                  });

                  let idsPlanning = arrIdsPlaneacion[index]

                  const isPosPreLinked = arrInformation.some(info =>
                    info.pospre === posPreId && info.consecutive === element.consecutivo_actividad_detallada
                  );
                  let objInfoData = {
                    'consecutive': element.consecutivo_actividad_detallada,
                    'pospre': posPreId,
                  }

                  let verificationOne = await api.getVinculationMGAByPosPreVerify(objInfoData)
                  let dataSaved = verificationOne.data;




                  const matchingObjectV1 = arrInformation.find(obj => obj.pospre === posPreId && obj.consecutive === element.consecutivo_actividad_detallada);

                  console.log(matchingObjectV1);

                  // Verificar si se encontró un objeto que coincide
                  if (matchingObjectV1) {
                    console.log("Objeto encontrado:", matchingObjectV1);
                  } else {
                    console.log("No se encontró ningún objeto con los valores proporcionados.");
                  }

                  if (isPosPreLinked) {
                    const objErrors = { "rowError": index + 1, "message": `Ya existe ese MGA vinculado` };
                    infoErrorsTemp.push(objErrors);

                    const matchingInfo = arrInformation.find(info => info.pospre === posPreId && info.consecutive === element.consecutivo_actividad_detallada);
                    console.log("Información relacionada:", matchingInfo);
                  }

                  if (dataSaved.length > 0) {
                    dataSaved.forEach((elementSaved, index) => {
                      const objErrors = { "rowError": index + 1, "message": `Ya existe ese MGA vinculado` };
                      infoErrorsTemp.push(objErrors);
                    });
                  }

                  const isActivityInPlanning = arrInformation.some(info => info.consecutive === element.consecutivo_actividad_detallada);

                  if (!isActivityInPlanning) {
                    const objErrors = { "rowError": index + 1, "message": `No existe la MGA en planeación` };
                    infoErrorsTemp.push(objErrors);
                  } else {
                    arrInformation.forEach(datosPlanningV => {
                      if (datosPlanningV.consecutive === element.consecutivo_actividad_detallada) {
                        let finalObjectMatching = {
                          id: datosPlanningV?.activity?.id,
                          activityMGA: datosPlanningV?.activity?.activityMGA,
                          idProject: datosPlanningV?.activity?.idProject,
                          posePre: posPreId,
                          idDetail: datosPlanningV.id
                        }
                        infoSendVPY.push(finalObjectMatching)
                      }
                    });
                  }
                }

                infoErrors.push(...infoErrorsTemp);
              }
            }
            const uniqueRows = new Set();
            const rowsWithErrors = new Set();
            for (let R = range.s.r + 1; R <= range.e.r; ++R) {
              const merges = sheet["!merges"];
              if (merges !== undefined) {
                const isMergedRow = merges.some(
                  (merge) => R >= merge.s.r && R <= merge.e.r
                );
                if (isMergedRow) {
                  if(tipoDocumento !== "PospreMGA"){
                    let objErrors = {
                      rowError: R,
                      message: `El archivo no cumple la estructura.`,
                    };
                    infoErrors.push(objErrors);
                    
                  }else{
                    if (!rowsWithErrors.has(R)) {
                      let objErrors = {
                        rowError: R,
                        message: `El archivo no cumple la estructura.`,
                      };
                      infoErrors.push(objErrors);
                      rowsWithErrors.add(R);
                    }
                  }
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

                // Validar si la celda está vacía
                if (value === null || value === undefined || value === "") {
                  if (merges === undefined) {
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

                } else {
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
                              message: `El archivo no cumple la estructura`,
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
                              message: `El archivo no cumple la estructura`,
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
                              message: `El archivo no cumple la estructura`,
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
                              message: `El archivo no cumple la estructura`,
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
                            message: `El archivo no cumple la estructura`,
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
                              message: `El archivo no cumple la estructura`,
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
                            message: `El archivo no cumple la estructura`,
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
                            message: `El archivo no cumple la estructura`,
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
                            message: `El archivo no cumple la estructura`,
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
                            message: `El archivo no cumple la estructura`,
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
                            message: `El archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }

                        infoArrAF.forEach((element) => {
                          const matchingProject = infoArrProject.find((datosProject) => datosProject.functionalAreaId === element.id);
                          if (element.number === value && matchingProject?.areaFuntional?.number) {
                            console.log("esta es la coincidencia", element.number, matchingProject?.areaFuntional?.number, value);

                            let objErrors = {
                              rowError: R,
                              message: `El Área funcional ya existe con ese proyecto`,
                            };
                            infoErrors.push(objErrors);
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
                            message: `El archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }

                        let valueFunction: string = "funcionamiento";
                        let valueInvertion: string = "inversion";
                        if (value == valueInvertion || value == valueFunction) {
                        } else {
                          let objErrors = {
                            rowError: R,
                            message: `El tipo de proyecto solo puede ser: Inversion ó Funcionamiento`,
                          };
                          infoErrors.push(objErrors);
                        }

                        break;
                      case "Proyecto":
                        if (typeof value !== 'number' || !Number.isInteger(value)) {
                          console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.`);
                          if (value === undefined) { } else {
                            let objErrors = { "rowError": R, "message": `El archivo no cumple la estructura` };
                            infoErrors.push(objErrors);
                          }
                        }
                        break;
                    }
                  } else if (tipoDocumento == "PospreSapiencia") {

                    switch (titleDB[C]) {
                      case "PospreOrigen":
                        if (typeof value !== 'number' || !Number.isInteger(value)) {
                          console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.`);
                          if (value === undefined) { } else {
                            let objErrors = { "rowError": R, "message": `El archivo no cumple la estructura` };
                            infoErrors.push(objErrors);
                          }
                        }
                        break;
                      case "DenominacionOrigen":
                        if (typeof value !== "string") {
                          console.log(
                            `Error en la fila ${R}, columna ${C + 1
                            }: El valor '${value}' no es una cadena de texto.`
                          );
                          let objErrors = {
                            rowError: R,
                            message: `El archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                        break;
                      case "DescripcionOrigen":
                        if (typeof value !== "string") {
                          console.log(
                            `Error en la fila ${R}, columna ${C + 1
                            }: El valor '${value}' no es una cadena de texto.`
                          );
                          let objErrors = {
                            rowError: R,
                            message: `El archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                        break;
                      case "ConsecutivoPospreSapiencia":
                        if (typeof value !== "string") {
                          console.log(
                            `Error en la fila ${R}, columna ${C + 1
                            }: El valor '${value}' no es una cadena de texto.`
                          );
                          let objErrors = {
                            rowError: R,
                            message: `El archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                        break;
                      case "Ejercicio":
                        if (typeof value !== 'number' || !Number.isInteger(value)) {
                          console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.`);
                          if (value === undefined) { } else {
                            //let objErrors = { "rowError": R, "message": `Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es un número entero.` };
                            let objErrors = { "rowError": R, "message": `El archivo no cumple la estructura` };
                            infoErrors.push(objErrors);
                          }
                        }
                        break;
                      case "DescripcionSapiencia":
                        if (typeof value !== 'string') {
                          console.log(`Error en la fila ${R}, columna ${C + 1}: El valor '${value}' no es una cadena de texto.`);
                          let objErrors = { "rowError": R, "message": `El archivo no cumple la estructura` };
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
                              message: `El archivo no cumple la estructura`,
                            };
                            infoErrors.push(objErrors);
                          }
                        }
                        break;
                      case "Proyecto":
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
                              message: `El archivo no cumple la estructura`,
                            };
                            infoErrors.push(objErrors);
                          }
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
                              message: `El archivo no cumple la estructura`,
                            };
                            infoErrors.push(objErrors);
                          }
                        }
                        break;
                      case "ProductoMGA":
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
                              message: `El archivo no cumple la estructura`,
                            };
                            infoErrors.push(objErrors);
                          }
                        }
                        break;
                      case "CodigoActividadMGA":
                        if (
                          typeof value !== "number" ||
                          !Number.isInteger(value)
                        ) {
                          if (value === undefined) {
                          } else {
                            let objErrors = {
                              rowError: R,
                              message: `El archivo no cumple la estructura`,
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
                            message: `El archivo no cumple la estructura`,
                          };
                          infoErrors.push(objErrors);
                        }
                        break;
                    }
                  } else if (tipoDocumento == "RutaPptoInicial") {
                    if (C % 7 === 0) {
                      await checkBudgetRouteDoesNotExist(dataBudgetRoutesCreatedSt, getAllFundsListSt, getAllPospre, getAllPospreSapienciaListSt, infoErrors, R, sheet[XLSX.utils.encode_cell({ c: 0, r: R })]?.v, sheet[XLSX.utils.encode_cell({ c: 1, r: R })]?.v, sheet[XLSX.utils.encode_cell({ c: 2, r: R })]?.v, sheet[XLSX.utils.encode_cell({ c: 3, r: R })]?.v, sheet[XLSX.utils.encode_cell({ c: 4, r: R })]?.v, sheet[XLSX.utils.encode_cell({ c: 5, r: R })]?.v, sheet[XLSX.utils.encode_cell({ c: 6, r: R })]?.v)
                    }
                  } // end RutaPptoInicial
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
                    message: `El archivo no cumple la estructura.`,
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
                let validezOne = rowData['FND_VIGENTE_DESDE'];
                let validezTwo = rowData['FND_VIGENTE_HASTA'];

                const dateOne = new Date(validezOne);
                const dateTwo = new Date(validezTwo);

                if (dateOne > dateTwo) {
                  let objErrors = {
                    rowError: R,
                    message: `Error en fechas`,
                  };
                  infoErrors.push(objErrors);

                }
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
                    message: `El fondo ya existe.`,
                  };
                  infoErrors.push(objErrors);
                }
              }
            }
            console.log("Datos fila de errores:", infoErrors);
            setTimeout(() =>
              setInfoErrors(infoErrors), 2000);
          } else {
            console.log(
              "El archivo Excel no tiene el formato esperado. Detalles:"
            );
            setTimeout(() =>
              setInfoErrors(infoErrors), 2000);
            // Puedes mostrar un mensaje al usuario o manejar la situación de alguna otra manera
          }
          setTimeout(() => {
            if (infoErrors.length > 0) {
              console.log(infoErrors);

              resolve(false);
            } else {
              resolve(true);
            }
          }, 3000);

        } catch (error) {
          reject(error);
        }
      };

      reader.readAsBinaryString(blob);
    });
  }

  const validaProyectRouteInitialBudget = async () => {
    let proyects = await strategicServices.getProjectDataApi({
      codeList: projectCodeSearchInStrategicRef.current
    })

    let proyectsVinculation = await GetProjectsStrategicVinculation({
      projectsIds: proyects.data.map(e=>e.id)
    })
    return await checkValueBudgetWithProjectPlanning(proyects.data, dataRoutesToInsertStRef.current, proyectsVinculation.data, dataBudgetRoutesCreatedSt)
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

    let errors = [];
    if (tipoDocumento == 'RutaPptoInicial') {

      /* 
      setInfoErrors(prevInfoErrors => [
        ...prevInfoErrors,
        ...errors
      ]) */
      errors = await validaProyectRouteInitialBudget();
      setInfoErrors(prevInfoErrors => {
        // Verificar si infoErrors ya tiene elementos
        if (prevInfoErrors.length === 0) {
          return [...prevInfoErrors, ...errors];
        } else {
          // No añadir errors si prevInfoErrors ya tiene elementos
          return prevInfoErrors;
        }
      });
    }

    if (verification === true && errors.length == 0) {
      setLoadingSpinner(false);

      let exercise = ejercicio.toString();

      let obInfo = {
        fileContent: tipoDocumento == 'RutaPptoInicial' ? dataRoutesToInsertStFixedRef.current : base64Data,
        documentType: tipoDocumento,
        usuarioCreo: authorization.user.numberDocument,
        mes: mes,
        ejercicio: ejercicio,
        aditionalData: infoSendVPY.reverse()
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
