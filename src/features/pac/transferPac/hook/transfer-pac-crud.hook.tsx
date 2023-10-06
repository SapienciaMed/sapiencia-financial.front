import { useForm, useFieldArray } from 'react-hook-form';
import { ICreateTransferPacForm } from '../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface';
import { useContext, useEffect, useState } from 'react';
import { IArrayDataSelect } from '../../../../common/interfaces/global.interface';
import { useAdditionsTransfersService } from '../../../managementCenter/hook/additions-transfers-service.hook';
import { EResponseCodes } from '../../../../common/constants/api.enum';
import { AppContext } from '../../../../common/contexts/app.context';
import { handleCommonError } from '../../../../common/utils/handle-common-error';
import { useNavigate } from 'react-router-dom';

export function useTransferPacCrudData() {

    const navigate = useNavigate();
    const { GetFundsList, GetProjectsList, GetPosPreSapienciaList } = useAdditionsTransfersService()
    const { setMessage, setAddTransferData, setDetailTransferData } = useContext(AppContext);
    const [ pacTypeState, setPacTypeState ] = useState(1) 
    const [ isdataResetState, setIsdataResetState ] = useState<boolean>(false)
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
      handleSubmit
    } = useForm<ICreateTransferPacForm>();
  
    const tipoPac = watch('pacType')
    const formDestino = watch('destino')
    const formOrigen = watch('origen')
  
    useEffect(() => {
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

        if (tipoPac > 0) {
            setPacTypeState(tipoPac)
        }
        
      
    },[tipoPac])

    useEffect(() => {

        // if (tipoPac ) {
        //     console.log("entro", tipoPac != pacTypeState );
            
        //     setIsdataResetState(tipoPac != pacTypeState)
        // }

    },[pacTypeState])
  
    const onSubmit = handleSubmit(async ( data: any) => {
      console.log(data); 
    })
      
    return{
      control,
      arrayDataSelect,
      errors,
      pacTypeState,
      isdataResetState,
      register,
      setValue,
      onSubmit
    }
}

