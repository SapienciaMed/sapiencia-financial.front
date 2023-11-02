import { useForm } from 'react-hook-form';
import { ICreateTransferPacForm } from '../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface';
import { useContext, useEffect, useState } from 'react';
import { EResponseCodes } from '../../../../common/constants/api.enum';
import { AppContext } from '../../../../common/contexts/app.context';
import { calcularTotalOrigenLocation, calculateTotalDestino, calculateTotalDestinoLocation, calculateTotalOrigen, isvalidateTypePac, processUseData, validateTypeResource, validateTypeResourceServices } from '../util';
import useYupValidationResolver from '../../../../common/hooks/form-validator.hook';
import { validationTransferPac } from '../../../../common/schemas/transfer-schema';
import { usePacTransfersService } from './pac-transfers-service.hook';
import { IArrayDataSelectHead, IArrayDataSelectPac } from '../interfaces/TypeTransferPac';
import { IDropdownProps } from '../../../../common/interfaces/select.interface';
import { validateTypePac } from '../util/validate-type-pac';
import { IAnnualRoute } from '../../interface/Pac';
import { useNavigate } from 'react-router-dom';

export function useTransferPacCrudData() {

  const navigate = useNavigate();
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
  const [ originalDestinationValueOfService, setOriginalDestinationValueOfService ] = useState([{
    annualRouteService: [] as IAnnualRoute[],
    ubicacion: ''
  }])
  
  const [ annualDataRoutesOriginal, setAnnualDataRoutesOriginal ] = useState([{
    annualRouteService: [] as IAnnualRoute[],
  }])
  const [ annualDataRoutesBoth, setAnnualDataRoutesBoth ] = useState<IAnnualRoute[]>([])

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

  useEffect(() => {
    if (originalDestinationValueOfService.some(e => e.annualRouteService.length > 0)) {
      setValue('totalOrigenActual', calcularTotalOrigenLocation(originalDestinationValueOfService))
      setValue('totalDestinoActual', calculateTotalDestinoLocation(originalDestinationValueOfService))
    }
  },[originalDestinationValueOfService])

  useEffect(() => {
    if (annualDataRoutesOriginal.length > 1) {
      /*Determina que cadId del servicio es igual al annualDataRoutesOriginal.annualRouteService cadId y le agrega una prop nueva al arreglo llamado ubicacion 
        con el fin de determinar que la suma original del origen o del destino sigan iguales sin sufrir cambios.
      */
      const originalDataAnnualRouteswithLocations = annualDataRoutesOriginal.map(item => {
        const annualRouteService = item.annualRouteService;
        const origenMatch = watchAll.origen.some(origen => annualRouteService.some(routeService => routeService.cardId === origen.cardId));
        const destinoMatch = watchAll.destino.some(destino => annualRouteService.some(routeService => routeService.cardId === destino.cardId));
        
        if (origenMatch) {
          return { ...item, ubicacion: "origen" };
        } 
        if (destinoMatch) {
          return { ...item, ubicacion: "destino" };
        } else {
          return item;
        }
      });

      const updateOrAddAnnualRoute = (newAnnualRoute) => {
        setOriginalDestinationValueOfService((prevData) => {
          const newData = [...prevData];
          // Busca si ya existe un objeto con el mismo cardId en annualRouteService
          const index = newData.findIndex((item) => {
            return item.annualRouteService.some(
              (route) => route.cardId === newAnnualRoute.annualRouteService[0]?.cardId
            );
          });

          if (index !== -1) {
            // Si existe, actualiza el objeto
            newData[index].annualRouteService = newAnnualRoute.annualRouteService;
          } else {
            // Si no existe, agrega el nuevo objeto
            newData.push(newAnnualRoute);
          }

          return newData;
        });
      };

      originalDataAnnualRouteswithLocations.forEach((item) => {
        console.log("🚀 ~ item:", item)
        if (item.annualRouteService.length > 0) {
          updateOrAddAnnualRoute(item);
        }
      });
    }
  },[annualDataRoutesOriginal])

  useEffect(() => {
    if (pacTypeState >= 2 && pacTypeState <= 4 ) {
      if ((hasDataBeforeReset || hasNonEmptyAll) && pacTypeState2 !== pacTypeState) {
        setIsActivityAdd(false)
        setIsdataResetState(true);
        reset()
        setShowSpinner(false)
        setDisableBtnAdd(true)
        setOriginalDestinationValueOfService([])
        setAnnualDataRoutesBoth([])
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
    watchAll && setIsBtnDisable( originalDestinationValueOfService.some(objeto => objeto.ubicacion === 'destino') && originalDestinationValueOfService.some(objeto => objeto.ubicacion === 'origen')) 
    watchAll && validateHeader()
  },[watchAll])

  const onSubmit = handleSubmit(async ( data: any) => {
    
    function removeEmptyFields(obj) {
      for (var key in obj) {
        if (obj[key] === '' || obj[key] === undefined || obj[key] === null) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          removeEmptyFields(obj[key]);
        }
      }
      return obj;
    }

    if( (watchAll.totalDestinoActual + watchAll.totalOrigenActual) != (calculateTotalOrigen(watchAll) + calculateTotalDestino(watchAll))){
      setMessage({
        title: 'Validación',
        show: true,
        description: 'La sumatoria de valor actual y La sumatoria del valor nuevo debe coincidir',
        OkTitle: 'Aceptar',
        background: true,
        onOk: () => {
          setMessage({});
        },
        onClose: () => {
          setMessage({});
        },
      });
    }else{
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
            const dataTransferpac = {
              headTransfer: {
                pacType: validateTypePac(data.pacType),
                exercise: parseInt(data.validity),
                resourceType: validateTypeResourceServices(data.TypeResource)
              },
              transferTransaction: {
                origins: nuevoObjeto.origen.map(use => processUseData(use, arrayDataSelect, authorization, annualDataRoutesBoth, nuevoObjeto.origen)),
                destinities: nuevoObjeto.destino.map(use => processUseData(use, arrayDataSelect, authorization, annualDataRoutesBoth, nuevoObjeto.destino)),
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
                      setOriginalDestinationValueOfService([])
                      navigate(-1)
                    },
                    background: true,
                    onClose: () => {
                      setMessage({});
                      setIsdataResetState(true)
                      setDisableBtnAdd(true)
                      reset()
                      setOriginalDestinationValueOfService([])
                      navigate(-1)
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
                    },
                    background: true,
                    onClose: () => {
                      setMessage({});
                    },
                });
            }
  
            })
          },
          background: true,
      });

    }

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
        navigate(-1)
      },
      onClose: () => {
        setIsdataResetState(true)
        setDisableBtnAdd(true)
        reset()
        setMessage({});
        navigate(-1)
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

  const addNewObject = (newObj: IAnnualRoute[]) => {
    setAnnualDataRoutesBoth(
      (prevData) => [...prevData, ...newObj]
    );
  };
  
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
    annualDataRoutesOriginal,
    originalDestinationValueOfService, 
    setOriginalDestinationValueOfService,
    register,
    setValue,
    onSubmit,
    onPageChange,
    getValues,
    onCancelar,
    setPacTypeState,
    setTypeValidityState,
    setIsdataResetState,
    setAnnualDataRoutesOriginal,
    addNewObject
  }
}

