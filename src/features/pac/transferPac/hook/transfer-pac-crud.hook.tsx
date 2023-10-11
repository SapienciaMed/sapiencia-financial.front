import { useForm } from 'react-hook-form';
import { ICreateTransferPacForm } from '../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface';
import { useContext, useEffect, useState } from 'react';
import { IArrayDataSelect } from '../../../../common/interfaces/global.interface';
import { EResponseCodes } from '../../../../common/constants/api.enum';
import { AppContext } from '../../../../common/contexts/app.context';
import { handleCommonError } from '../../../../common/utils/handle-common-error';
import { useNavigate } from 'react-router-dom';
import { validateTypePac } from '../util/validate-type-pac';
import { calculateTotalDestino, calculateTotalOrigen, validateTypeResource } from '../util';
import useYupValidationResolver from '../../../../common/hooks/form-validator.hook';
import { validationTransferPac } from '../../../../common/schemas/transfer-schema';
import { usePacTransfersService } from './pac-transfers-service.hook';
import { IArrayDataSelectHead } from '../interfaces/TypeTransferPac';
import { IDropdownProps } from '../../../../common/interfaces/select.interface';

export function useTransferPacCrudData() {

  const navigate = useNavigate();
  const resolver = useYupValidationResolver( validationTransferPac );
  const { ValidityList, ResourcesTypeList } = usePacTransfersService()
  const { setMessage, setAddTransferData, setDetailTransferData } = useContext(AppContext);
  const [ pacTypeState, setPacTypeState ] = useState(1)
  const [ pacTypeState2, setPacTypeState2 ] = useState(4)
  const [ isActivityAdd, setIsActivityAdd ] = useState<boolean>(true)
  const [ isdataResetState, setIsdataResetState ] = useState<boolean>(false)
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [arrayDataSelect, setArrayDataSelect] = useState<IArrayDataSelect>({
    functionalArea: [],
    areas: [],
    funds: [],
    posPre: [],
  })
  const [ arrayDataSelectHead, setArrayDataSelectHead ] = useState<IArrayDataSelectHead>({
    typeResourceData: [],
    validityData: [],
    algo: []
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

  const { hasNonEmptyCollected, hasNonEmptyProgrammed, hasDataBeforeReset } = validateTypePac(watchAll, pacTypeState2 );

  //Resetea el formulario, cuando se cambia de pac y algun valor del mes esta lleno
  useEffect(() => {
    if (pacTypeState == 2 && watchAll ) {
      pacTypeState2 != 4 ? setIsdataResetState(hasNonEmptyCollected)  : setIsdataResetState(true)
    }
    
    if (pacTypeState == 3 && watchAll ) {
      pacTypeState2 != 4 ? setIsdataResetState(hasNonEmptyProgrammed) : setIsdataResetState(true)
    }
    
    if (pacTypeState == 4 && watchAll) {
      setPacTypeState2(4)
      setIsdataResetState(hasDataBeforeReset)    
    }
    watchAll && validateHeader()
  },[pacTypeState, watchAll])

  //Realiza la peticion para los headear
  useEffect(() => {
    if (arrayDataSelectHead.typeResourceData.length == 1 && arrayDataSelectHead.validityData.length == 1 ) {
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
    }

    //Valida si una vigencia se escogio y hace la validacion de los tipo de recursos
    if (arrayDataSelectHead.validityData.length > 1 && arrayDataSelectHead.typeResourceData.length == 1 && vigencia) {

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
  
  }, [arrayDataSelectHead, vigencia])

  //Realiza la peticion para LISTADOS DINÁMICOS DE PROYECTOS, POSPRE SAPI Y FONDOS
  useEffect(() => {
    if (!isActivityAdd) {

    }
  },[isActivityAdd])

  useEffect(() => {
    tipoPac > 0 && setPacTypeState(tipoPac);
    (tipoPac > 1 && tipoPac < 4) && setPacTypeState2(tipoPac)
  },[tipoPac])

  //Valida que los totales sean iguales y habilita el boton guardar
  useEffect(() => {
    watchAll && setIsBtnDisable( calculateTotalOrigen(watchAll) != '0' && calculateTotalDestino(watchAll) != '0' && (calculateTotalOrigen(watchAll) == calculateTotalDestino(watchAll))  )
    watchAll.origen?.length > 0 && isTheDataSelectorCompleteOrigen()
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
    onCancelar
  }
}

