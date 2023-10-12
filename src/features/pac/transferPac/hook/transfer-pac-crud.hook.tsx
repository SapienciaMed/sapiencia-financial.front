import { useForm } from 'react-hook-form';
import { ICreateTransferPacForm } from '../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface';
import { useContext, useEffect, useState } from 'react';
import { EResponseCodes } from '../../../../common/constants/api.enum';
import { AppContext } from '../../../../common/contexts/app.context';
import { handleCommonError } from '../../../../common/utils/handle-common-error';
import { useNavigate } from 'react-router-dom';
import { validateTypePac } from '../util/validate-type-pac';
import { calculateTotalDestino, calculateTotalOrigen, validateTypeResource, validateTypeResourceServices } from '../util';
import useYupValidationResolver from '../../../../common/hooks/form-validator.hook';
import { validationTransferPac } from '../../../../common/schemas/transfer-schema';
import { usePacTransfersService } from './pac-transfers-service.hook';
import { IArrayDataSelectHead, IArrayDataSelectPac } from '../interfaces/TypeTransferPac';
import { IDropdownProps } from '../../../../common/interfaces/select.interface';

export function useTransferPacCrudData() {

  const navigate = useNavigate();
  const resolver = useYupValidationResolver( validationTransferPac );
  const { ValidityList, ResourcesTypeList, ListDinamicsRoutes } = usePacTransfersService()
  const { setMessage, setAddTransferData, setDetailTransferData } = useContext(AppContext);
  const [ pacTypeState, setPacTypeState ] = useState(1)
  const [ pacTypeState2, setPacTypeState2 ] = useState(1)
  const [ typeValidityState, setTypeValidityState ] = useState(0)
  const [ isActivityAdd, setIsActivityAdd ] = useState<boolean>(true)
  const [ isdataResetState, setIsdataResetState ] = useState<boolean>(false)
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState(1);
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
  const [ cardIdService, setCardIdService] = useState('')

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

  const { hasDataBeforeReset, hasNonEmptyAll } = validateTypePac(watchAll);
  
  //Resetea el formulario, cuando se cambia de pac y algun valor del formulario este lleno
  useEffect(() => {
    if (pacTypeState >= 2 && pacTypeState <= 4) {
      if ((hasDataBeforeReset || hasNonEmptyAll) && pacTypeState2 !== pacTypeState) {
        setIsdataResetState(true);
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
    //Valida si una vigencia se escogio y hace la peticion de tipode recurso
    if (typeValidityState > 1) {
      const data = { exercise: vigencia }

      ResourcesTypeList(data).then(response => {
        if (response.operation.code === EResponseCodes.OK) {
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
    if (!isActivityAdd) {
      const dataListroute = {
        page: '1',
        perPage: '1000',
        exercise: vigencia,
        resourceType: validateTypeResourceServices(String(tipoRecurso)),
        pacType: tipoPac
      }
    
      ListDinamicsRoutes(dataListroute)
        .then(response => {
          if (response.operation.code === EResponseCodes.OK) {
            const dinamicData = response?.data;
    
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
    
            const uniquePospreSapi = Array.from(new Set(dinamicData.listPospreSapi.map(pospreSapi => pospreSapi.idPosPreOrig))).map(idPosPreOrig => {
              const item = dinamicData.listPospreSapi.find(pospreSapi => pospreSapi.idPosPreOrig === idPosPreOrig);
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
  },[isActivityAdd])

  //Valida que los totales sean iguales y habilita el boton guardar
  useEffect(() => {
    watchAll && setIsBtnDisable( calculateTotalOrigen(watchAll) != '0' && calculateTotalDestino(watchAll) != '0' && (calculateTotalOrigen(watchAll) == calculateTotalDestino(watchAll))  )
    watchAll.origen?.length > 0 && isTheDataSelectorCompleteOrigen()
    watchAll && validateHeader()
  },[watchAll])

  const onSubmit = handleSubmit(async ( data: any) => {
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
        setMessage({});
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
        reset()
        setMessage({});
      },
      onClose: () => {
        setIsdataResetState(true)
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
  
    setIsActivityAdd(!isValid);
  }
  
  const isTheDataSelectorCompleteOrigen = () => {
    //Valida si todos los campos estan llenos. ( luego se tiene que enviar el cardId a la consulta)
    const isComplete = watchAll.origen.some(data => {
      return data.projectId && data.fundsSapiencia && data.pospreSapiencia
    })

    //Aca debe hacer una consulta: 

    isComplete && console.log('consulta servicio para programdo o recaudado');
    

    //------------------
    const mockCardId = '243567869yugjfhdse2432675ituygjlh34'

    //Luego de recibir una respuesta, capturo el cardId y junto con la data mes a mes se envia 
    isComplete && setCardIdService(mockCardId)
    
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
    isActivityAdd,
    isBtnDisable,
    cardIdService,
    arrayDataSelectHead,
    register,
    setValue,
    onSubmit,
    onPageChange,
    getValues,
    onCancelar,
    setPacTypeState,
    setTypeValidityState,
    setIsdataResetState
  }
}

