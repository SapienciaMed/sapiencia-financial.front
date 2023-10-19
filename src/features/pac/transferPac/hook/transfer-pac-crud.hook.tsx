import { useForm } from 'react-hook-form';
import { ICreateTransferPacForm } from '../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface';
import { useContext, useEffect, useState } from 'react';
import { EResponseCodes } from '../../../../common/constants/api.enum';
import { AppContext } from '../../../../common/contexts/app.context';
import { isvalidateTypePac } from '../util/is-validate-type-pac';
import { calculateTotalDestino, calculateTotalOrigen, validateTypeResource, validateTypeResourceServices } from '../util';
import useYupValidationResolver from '../../../../common/hooks/form-validator.hook';
import { validationTransferPac } from '../../../../common/schemas/transfer-schema';
import { usePacTransfersService } from './pac-transfers-service.hook';
import { IArrayDataSelectHead, IArrayDataSelectPac } from '../interfaces/TypeTransferPac';
import { IDropdownProps } from '../../../../common/interfaces/select.interface';
import { validateTypePac } from '../util/validate-type-pac';

export function useTransferPacCrudData() {

  const resolver = useYupValidationResolver( validationTransferPac );
  const { ValidityList, ResourcesTypeList, ListDinamicsRoutes, TransfersOnPac } = usePacTransfersService()
  const { setMessage, authorization } = useContext(AppContext);
  const [ pacTypeState, setPacTypeState ] = useState(1)
  const [ pacTypeState2, setPacTypeState2 ] = useState(1)
  const [ typeValidityState, setTypeValidityState ] = useState(0)
  const [ isActivityAdd, setIsActivityAdd ] = useState<boolean>(false)
  const [ isdataResetState, setIsdataResetState ] = useState<boolean>(false)
  const [ isBtnDisable, setIsBtnDisable] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [ showSpinner,   setShowSpinner ] = useState(false)
  const [ disableBtnAdd, setDisableBtnAdd ] = useState(true)

  const itemsPerPage = 2;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [arrayDataSelect, setArrayDataSelect] = useState<IArrayDataSelectPac>({
    functionalArea: [],
    fundsSapiencia: [],
    pospreSapiencia: [],
  })
  const [ arrayDataSelectHead, setArrayDataSelectHead ] = useState<IArrayDataSelectHead>({
    typeResourceData: [],
    validityData: [],
  })

  const {
    control,
    formState: { errors },
    register,
    setValue,
    watch,
    handleSubmit,
    getValues,
    reset
  } = useForm<ICreateTransferPacForm>({ resolver });

  const tipoPac = watch('pacType')
  const vigencia = watch('validity')
  const tipoRecurso = watch('TypeResource')
  const watchAll = watch()

  const { hasDataBeforeReset, hasNonEmptyAll } = isvalidateTypePac(watchAll);

  //Resetea el formulario, cuando se cambia de pac y algun valor del formulario este lleno
  useEffect(() => {
    if (pacTypeState >= 2 && pacTypeState <= 4 ) {
      if ((hasDataBeforeReset || hasNonEmptyAll) && pacTypeState2 !== pacTypeState) {
        setIsActivityAdd(false)
        setIsdataResetState(true);
        reset()
        setShowSpinner(false)
        setDisableBtnAdd(true)
      } else {
        setPacTypeState2(pacTypeState);
      }
    }
  }, [pacTypeState, hasDataBeforeReset, hasNonEmptyAll, pacTypeState2]);

  useEffect(() => {
    ValidityList().then(response => {
      if (response.operation.code === EResponseCodes.OK) {
        const validityDataServer = response?.data.array || []

        const dataArray: IDropdownProps[] = validityDataServer.map((entity, index) => {
          return { name: String(entity?.exercise), value: entity?.exercise, id: index +1};
      });

        setArrayDataSelectHead(prevState => ({
          ...prevState,
          validityData: dataArray
        }))
        
      }
    })
  },[])

  useEffect(() => {
    //Valida si una vigencia se escogio y hace la peticion de tipo de recurso
    if (typeValidityState > 1 ) {
      const data = { exercise: vigencia }
      setIsdataResetState(true);
      ResourcesTypeList(data).then(response => {
        if (response.operation.code === EResponseCodes.OK) {
          setIsdataResetState(false);
          const validityDataServer = response?.data.array || []
          const dataArray: IDropdownProps[] = validityDataServer.map((entity, index) => {
            const sourType = validateTypeResource(entity?.sourceType)

            return { name: sourType, value: sourType, id: index +1 };
        });
          setArrayDataSelectHead(prevState => ({
            ...prevState,
            typeResourceData: dataArray
          }))
          
        }
      })
    }
  },[typeValidityState])

  //Realiza la peticion para LISTADOS DINÁMICOS DE PROYECTOS, POSPRE SAPI Y FONDOS
  useEffect(() => {
    if (isActivityAdd && watchAll.TypeResource != undefined) {
      const dataListroute = {
        page: '1',
        perPage: '1000',
        exercise: vigencia,
        resourceType: validateTypeResourceServices(String(tipoRecurso)),
        pacType: tipoPac
      }
      setIsdataResetState(true);
      setShowSpinner(true)
      ListDinamicsRoutes(dataListroute)
        .then(response => {
          setShowSpinner(false)
          setDisableBtnAdd(false)
          if (response.operation.code === EResponseCodes.OK) {
            const dinamicData = response?.data;
            setIsdataResetState(false);
            const uniqueProjects = Array.from(new Set(dinamicData.listProjects.map(project => project.projectCode))).map(projectCode => {
              const item = dinamicData.listProjects.find(project => project.projectCode === projectCode);
              return {
                name: item.projectCode,
                value: item.idVinculation,
                id: item.idVinculation,
                nameProject: item.projectName,
                functionalArea: item.numberFunctionalArea,
                idProjectPlanning: item.idProjectPlanning,
                numberFunctionalArea: item.numberFunctionalArea
              };
            });
    
            setArrayDataSelect(prevState => ({
              ...prevState,
              functionalArea: uniqueProjects
            }));
    
            const uniqueFunds = Array.from(new Set(dinamicData.listFunds.map(fund => fund.fundCode))).map(fundCode => {
              const item = dinamicData.listFunds.find(fund => fund.fundCode === fundCode);
              return {
                name: item.fundCode,
                value: item.idFund,
                id: item.idFund
              };
            });
    
            setArrayDataSelect(prevState => ({
              ...prevState,
              fundsSapiencia: uniqueFunds
            }));
    
            const uniquePospreSapi = Array.from(new Set(dinamicData.listPospreSapi.map(pospreSapi => pospreSapi.idPosPreSapi))).map(idPosPreSapi => {
              const item = dinamicData.listPospreSapi.find(pospreSapi => pospreSapi.idPosPreSapi === idPosPreSapi);
              return {
                name: item.numberCodeSapi,
                value: item.idPosPreSapi,
                id: item.idPosPreSapi,
                descriptionSapi: item.descriptionSapi,
                idPosPreOrig: item.idPosPreOrig,
                numberCodeOrig: item.numberCodeOrig
              };
            });
    
            setArrayDataSelect(prevState => ({
              ...prevState,
              pospreSapiencia: uniquePospreSapi
            }));
          }
        });
    }
  },[isActivityAdd, watchAll.TypeResource])

  useEffect(() => {
    watchAll && setIsBtnDisable( calculateTotalOrigen(watchAll) != '0' && calculateTotalDestino(watchAll) != '0' && (calculateTotalOrigen(watchAll) == calculateTotalDestino(watchAll))  )
    watchAll && validateHeader()
  },[watchAll])

  const onSubmit = handleSubmit(async ( data: any) => {
    function removeEmptyFields(obj) {
      for (var key in obj) {
        if (obj[key] === '' || obj[key] === undefined || obj[key] === null) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          removeEmptyFields(obj[key]); // Recursivamente llamamos la función para objetos anidados
        }
      }
      return obj;
    }
  
  const nuevoObjeto = removeEmptyFields(data);
    setMessage({
      title: "Guardar",
      description: "¿Estás segur@ de guardar la información?",
      OkTitle: "Aceptar",
      cancelTitle: "Cancelar",
      show: true,
      onCancel: () => {
        setMessage({});
      },
      onOk: () => {

        const transformData = (ob, type, authorization) => {
          return {
            type,
            jan: ob?.january,
            feb: ob?.february,
            mar: ob?.march,
            abr: ob?.april,
            may: ob?.may,
            jun: ob?.june,
            jul: ob?.july,
            ago: ob?.august,
            sep: ob?.september,
            oct: ob?.october,
            nov: ob?.november,
            dec: ob?.december,
            id: ob?.id,
            pacId: ob?.pacId,
            dateModify: new Date(authorization.user.dateModify).toISOString().split('T')[0],
            dateCreate: new Date(authorization.user.dateCreate).toISOString().split('T')[0]
          };
        };

        const dataTransferpac = {
          headTransfer: {
            pacType: validateTypePac(data.pacType),
            exercise: data.validity,
            resourceType: validateTypeResourceServices(data.TypeResource)
          },
          transferTransaction: {
            origins:  nuevoObjeto.origen.map(use => {
              const newArray = [];
              if (use.hasOwnProperty("collected")) {
                newArray.push({
                  collected: use?.collected
                });
              }
              if (use.hasOwnProperty("programmed")) {
                newArray.push({
                  programmed: use?.programmed
                });
              }
              return {
                managementCenter: use.managerCenter,
                idProjectVinculation: use.projectId,
                idBudget: use.projectId,
                idPospreSapiencia: use.pospreSapiencia,
                idFund: use.fundsSapiencia,
                idCardTemplate: use.cardId,
                annualRoute:  newArray.filter(obj => {
                  return Object.values(obj).some(value => {
                      if (typeof value === 'object') {
                          return Object.values(value).some(subValue => subValue !== 0);
                      }
                      return false;
                  })
                }).map(ob => {
                  if (ob.hasOwnProperty("collected") && !ob.hasOwnProperty("programmed")) {
                    return transformData(ob.collected, "Recaudado", authorization);
                  } else if (ob.hasOwnProperty("programmed") && !ob.hasOwnProperty("collected")) {
                    return transformData(ob.programmed, "Programado", authorization);
                  } else if (ob.hasOwnProperty("collected") && ob.hasOwnProperty("programmed")) {
                    const collectedData = transformData(ob.collected, "Recaudado", authorization);
                    const programmedData = transformData(ob.programmed, "Programado", authorization);
                    return [collectedData, programmedData];
                  }
                })
              }
            }),
            destinities: nuevoObjeto.destino.map(use => {
              const newArray = [];
              if (use.hasOwnProperty("collected")) {
                newArray.push({
                  collected: use?.collected
                });
              }
              if (use.hasOwnProperty("programmed")) {
                newArray.push({
                  programmed: use?.programmed
                });
              }
              return {
                managementCenter: use.managerCenter,
                idProjectVinculation: use.projectId,
                idBudget: use.projectId,
                idPospreSapiencia: use.pospreSapiencia,
                idFund: use.fundsSapiencia,
                idCardTemplate: use.cardId,
                annualRoute:  newArray.filter(obj => {
                  return Object.values(obj).some(value => {
                      if (typeof value === 'object') {
                          return Object.values(value).some(subValue => subValue !== 0);
                      }
                      return false;
                  })
                }).map(ob => {
                  if (ob.hasOwnProperty("collected") && !ob.hasOwnProperty("programmed")) {
                    return transformData(ob.collected, "Recaudado", authorization);
                  } else if (ob.hasOwnProperty("programmed") && !ob.hasOwnProperty("collected")) {
                    return transformData(ob.programmed, "Programado", authorization);
                  } else if (ob.hasOwnProperty("collected") && ob.hasOwnProperty("programmed")) {
                    const collectedData = transformData(ob.collected, "Recaudado", authorization);
                    const programmedData = transformData(ob.programmed, "Programado", authorization);
                    return [collectedData, programmedData];
                  }
                })
              }
            }),
          }
        }

        dataTransferpac && TransfersOnPac(dataTransferpac).then(response => {
          if (response.operation.code === EResponseCodes.OK) {
            setMessage({
                title: "Confirmación",
                description: "¡Guardado exitosamente!",
                show: true,
                OkTitle: "Aceptar",
                onOk: () => {
                  setMessage({});
                  setIsdataResetState(true)
                  setDisableBtnAdd(true)
                  reset()
                },
                background: true,
                onClose: () => {
                  setMessage({});
                  setIsdataResetState(true)
                  setDisableBtnAdd(true)
                  reset()
                },
            });
        } else {
            setMessage({
                title: "Validación de datos",
                description: response.operation.message,
                show: true,
                OkTitle: "Aceptar",
                onOk: () => {
                  setMessage({});
                  setIsdataResetState(true)
                  setDisableBtnAdd(true)
                  reset()
                },
                background: true,
                onClose: () => {
                  setMessage({});
                  setIsdataResetState(true)
                  setDisableBtnAdd(true)
                  reset()
                },
            });
        }

        })
      },
      background: true,
    });
  })

  const onCancelar = () => {
    setMessage({
      title: 'Cancelar Traslado PAC',
      show: true,
      description: '¿Estás segur@ que desea cancelar el Traslado PAC?',
      OkTitle: 'Aceptar',
      background: true,
      onOk: () => {
        setIsdataResetState(true)
        setDisableBtnAdd(true)
        reset()
        setMessage({});
      },
      onClose: () => {
        setIsdataResetState(true)
        setDisableBtnAdd(true)
        reset()
        setMessage({});
      },
  });
  }

  const onPageChange = event => {
    setCurrentPage(event.page + 1);
  };

  //Valida que todos los campos del header esten llenos y habilite los botones de añadir
  const validateHeader = () => {
    const { TypeResource, validity, pacType } = watchAll;
    const isValid = TypeResource !== null && TypeResource !== undefined
    && validity !== null && validity !== undefined
    && pacType !== null && pacType !== undefined;

    setIsActivityAdd(isValid);
  }
  
  return{
    control,
    arrayDataSelect,
    errors,
    pacTypeState,
    isdataResetState,
    currentPage,
    startIndex,
    itemsPerPage,
    watchAll,
    isBtnDisable,
    arrayDataSelectHead,
    showSpinner,
    disableBtnAdd,
    register,
    setValue,
    onSubmit,
    onPageChange,
    getValues,
    onCancelar,
    setPacTypeState,
    setTypeValidityState,
    setIsdataResetState,
  }
}

