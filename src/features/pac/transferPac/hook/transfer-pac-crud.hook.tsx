import { useForm } from 'react-hook-form';
import { ICreateTransferPacForm } from '../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface';
import { useContext, useEffect, useState } from 'react';
import { IArrayDataSelect } from '../../../../common/interfaces/global.interface';
import { useAdditionsTransfersService } from '../../../managementCenter/hook/additions-transfers-service.hook';
import { EResponseCodes } from '../../../../common/constants/api.enum';
import { AppContext } from '../../../../common/contexts/app.context';
import { handleCommonError } from '../../../../common/utils/handle-common-error';
import { useNavigate } from 'react-router-dom';
import { validateTypePac } from '../util/validate-type-pac';
import { calculateTotalDestino, calculateTotalOrigen } from '../util';
import useYupValidationResolver from '../../../../common/hooks/form-validator.hook';
import { validationTransferPac } from '../../../../common/schemas/transfer-schema';

export function useTransferPacCrudData() {

  const navigate = useNavigate();
  const resolver = useYupValidationResolver( validationTransferPac );
  const { GetFundsList, GetProjectsList, GetPosPreSapienciaList } = useAdditionsTransfersService()
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
    posPre: []
  })

  const {
    control,
    formState: { errors, isValid },
    register,
    setValue,
    watch,
    handleSubmit,
    getValues,
    reset
  } = useForm<ICreateTransferPacForm>({ resolver });

  const tipoPac = watch('pacType')
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

  useEffect(() => {
    //TODO: Esta peticion se va cambiar.
    if (!arrayDataSelect.functionalArea.length && !arrayDataSelect.funds.length && !arrayDataSelect.posPre.length) {
      GetProjectsList().then(response => {
        if (response.operation.code === EResponseCodes.OK) {
          const projectArray = response?.data || [];

          const seenNames = new Set();
          const arrayEntitiesProject = projectArray.reduce((acc, item) => {
            const description = item.conceptProject;
            const name = item.projectId;
            const value = item.id;
            const id = item.id;
            const area = [{
              name: item.areaFuntional.number,
              value: item.areaFuntional.id,
              id: item.areaFuntional.id
            }]

            if (!seenNames.has(name)) {
              seenNames.add(name);
              acc.push({ name, value, id, area, description });
            }

            return acc;
          }, []);

          setArrayDataSelect(prevState => ({
            ...prevState,
            functionalArea: arrayEntitiesProject
          }));
        } else {
          handleCommonError({ response, setMessage, navigate, setAddTransferData, setDetailTransferData})
        }
      }).catch((error) => console.log(error))

      GetFundsList({ page: "1", perPage: "1" }).then(response => {
        if (response.operation.code === EResponseCodes.OK) {
          const typeTransfersFunds = response.data?.array || [];

          const seenNames = new Set();
          const arrayEntitiesFund = typeTransfersFunds.reduce((acc, item) => {
            const name = item.number;
            const value = item.id;
            const id = item.id;

            if (!seenNames.has(name)) {
              seenNames.add(name);
              acc.push({ name, value, id });
            }

            return acc;
          }, []);

          setArrayDataSelect(prevState => ({ ...prevState, funds: arrayEntitiesFund }));

        } else {
          handleCommonError({ response, setMessage,  navigate, setAddTransferData, setDetailTransferData})
        }
      }).catch((error) => console.log(error))

      GetPosPreSapienciaList().then(response => {
        if (response.operation.code === EResponseCodes.OK) {
          const posPresapientes = response.data?.array || [];

          const seenNames = new Set();
          const arrayEntitiesPosPres = posPresapientes.reduce((acc, item) => {
            const name = item.number;
            const value = item.id;
            const id = item.id;

            if (!seenNames.has(name)) {
              seenNames.add(name);
              acc.push({ name, value, id });
            }

            return acc;
          }, []);

          setArrayDataSelect(prevState => ({ ...prevState, posPre: arrayEntitiesPosPres }));
        } else {
          handleCommonError({ response, setMessage,  navigate, setAddTransferData, setDetailTransferData})
        }
      }).catch((error) => console.log(error))
    }
  
  }, [arrayDataSelect])

  useEffect(() => {
    tipoPac > 0 && setPacTypeState(tipoPac);
    (tipoPac > 1 && tipoPac < 4) && setPacTypeState2(tipoPac)
  },[tipoPac])

  //Valida que los totales sean iguales y habilita el boton guardar
  useEffect(() => {
    watchAll && setIsBtnDisable( calculateTotalOrigen(watchAll) != '0' && calculateTotalDestino(watchAll) != '0' && (calculateTotalOrigen(watchAll) == calculateTotalDestino(watchAll))  )
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
    register,
    setValue,
    onSubmit,
    onPageChange,
    getValues,
    onCancelar
  }
}

