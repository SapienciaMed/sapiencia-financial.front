import { useForm, useWatch } from 'react-hook-form';
import useYupValidationResolver from "../../../../common/hooks/form-validator.hook";
import { validationFieldsCreatefunds } from "../../../../common/schemas/transfer-schema";
import { IAddFund, ICreateSourceForm } from "../interfaces/TransferAreaCrudInterface";
import { useAdditionsTransfersService } from "../../hook/additions-transfers-service.hook";
import { useContext, useEffect, useState } from "react";
import { IArrayDataSelect, IobjectAddTransfer } from "../../../../common/interfaces/global.interface";
import { EResponseCodes } from "../../../../common/constants/api.enum";
import { AppContext } from "../../../../common/contexts/app.context";
import { useNavigate } from 'react-router-dom';
import { useTypesTranfersService } from './types-transfers-service.hook';
import { get_total_value, transformJSONArrays, filterElementsMeetConditions, isTotalSame } from '../../../../common/utils/';

export function useAddFundsCrud() {

  const navigate = useNavigate();
  const resolver = useYupValidationResolver(validationFieldsCreatefunds);
  const { setMessage, dataPasteRedux, addTransferData, headTransferData, 
    setAddTransferData, setDetailTransferData, setDataPasteRedux } = useContext(AppContext);
  const { GetFundsList, GetProjectsList, GetPosPreSapienciaList } = useAdditionsTransfersService()
  const { validateCreateTransfer } = useTypesTranfersService();
  const [arrayDataSelect, setArrayDataSelect] = useState<IArrayDataSelect>({
    functionalArea: [],
    areas: [],
    funds: [],
    posPre: []
  })
  const [totalTransfer, setTotalTransfer] = useState<string>('')

  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    watch
  } = useForm<ICreateSourceForm>({
    resolver,
    mode: "onChange",
    defaultValues: {
      destino: [],
      origen: [],
    },
  });


  const watchOrigin = useWatch({
    control,
    name: 'origen'
  })

  useEffect(() => {
    setTotalTransfer(addNumericalValues(watchOrigin).toString())
  }, [watchOrigin])

  useEffect(() => {
    Object.keys(headTransferData).length === 0 && navigate(-1);
  }, [headTransferData])

  const addNumericalValues = (arr: IAddFund[]) => {
    return arr.reduce((total, item) => {
      const valor = parseFloat(item.value);
      return isNaN(valor) ? total : total + valor;
    }, 0);
  }

  useEffect(() => {
    if (!arrayDataSelect.functionalArea.length && !arrayDataSelect.funds.length && !arrayDataSelect.posPre.length) {
      GetProjectsList({ page: "1", perPage: "1" }).then(response => {
        if (response.operation.code === EResponseCodes.OK) {
          const projectArray = response.data?.array || [];

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
          setMessage({
            title: `Error en la consulta de datos`,
            show: true,
            description: response.operation.message,
            OkTitle: 'Aceptar',
            background: true,
            onOk: () => {
              setMessage({});
            },
          });
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
          setMessage({
            title: `Error en la consulta de datos`,
            show: true,
            description: response.operation.message,
            OkTitle: 'Aceptar',
            background: true,
            onOk: () => {
              setMessage({});
            },
          });
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
          setMessage({
            title: `Error en la consulta de datos`,
            show: true,
            description: response.operation.message,
            OkTitle: 'Aceptar',
            background: true,
            onOk: () => {
              setMessage({});
            },
          });
        }
      }).catch((error) => console.log(error))
    }

  }, [arrayDataSelect])

  const onSubmitTab = handleSubmit(async (data: ICreateSourceForm) => {

    if (data.destino.length == 0 || data.origen.length == 0) {
      setMessage({
        title: "Validación de datos",
        description: "Debe ingresar algun registro en origen y destino",
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({});
        },
        background: true
      })
      return;
    }

    //TODO: Validar si se puede borrar
    if (dataPasteRedux.length > 0) {
      if (!isTotalSame(dataPasteRedux)) {
        setMessage({
          title: "Validación de datos",
          description: "Se ha encontrado un error en los datos, los valores son diferentes",
          show: true,
          OkTitle: "Aceptar",
          onOk: () => {
            setMessage({});
          },
          background: true
        })

        return
      }
    }
    //TODO: Validar si se puede borrar
    if (!get_total_value(data) && dataPasteRedux.length == 0){
      setMessage({
        title: "Validación de datos",
        description: "Se ha encontrado un error en los datos, los valores son diferentes",
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({});
        },
        background: true
      })

      return
    }
    
    const manualTranferMovement: IobjectAddTransfer = {
      headTransfer: headTransferData,
      transferMovesGroups: transformJSONArrays(data) 
    }

    const transferDataToSave = dataPasteRedux.length > 0 ? addTransferData.array[0] : manualTranferMovement;
    validateCreateTransfer(transferDataToSave).then((response: any) => {
      if (response.operation.code === EResponseCodes.OK) {
        setMessage({
          title: "Agregar",
          description: "¡Valores agregados exitosamente!",
          show: true,
          OkTitle: "Aceptar",
          onOk: () => {
            setMessage({});
           
            setAddTransferData({  //se manda en el context los datos con los id para guardar en la bd, ya sea de forma pegar o manual
              array: dataPasteRedux.length > 0 ? addTransferData.array : [manualTranferMovement],
              meta: { total: 1 }
            });

            Object.keys(dataPasteRedux).length === 0 && setDetailTransferData({ //se manda en el context los datos sin los id y ser visualizado en detalles
              array: [
                {
                  headTransfer: headTransferData,
                  transferMovesGroups: filterElementsMeetConditions(arrayDataSelect, data)
                }
              ],
              meta: {
                total: manualTranferMovement.transferMovesGroups.length,
              }
            })

            setDataPasteRedux([])
            navigate(-1)
          },
          background: true
        })
      } else {

        let messageResponse = "";
        const messageResponseDecode =  response.operation.message.split('@@@')
        
        const budgetsRoutesError = JSON.parse(messageResponseDecode[3])
        const projectsError = JSON.parse(messageResponseDecode[6])
        const budgetsRoutesRepit = JSON.parse(messageResponseDecode[9])
                
        if(budgetsRoutesError.length>0){
          messageResponse = messageResponseDecode[1];
        }else if(projectsError.length>0){
          messageResponse = messageResponseDecode[4];
        }else if(budgetsRoutesRepit.length>0){
          messageResponse = messageResponseDecode[7];
        }

        setMessage({
          title: "Error",
          description: messageResponse,
          show: true,
          OkTitle: "Aceptar",
          onOk: () => {
            setMessage({});
            setAddTransferData({
              array: dataPasteRedux.length > 0 ? addTransferData.array : [manualTranferMovement],
              meta: { total: 1 }
            });
            let addTransferDataFixed = getElementsMovement(addTransferData.array[0].transferMovesGroups)
            identifyInvalidcard(dataPasteRedux.length > 0 ? addTransferDataFixed : manualTranferMovement.transferMovesGroups, response.operation.message)
            //navigate(-1)
          },
          background: true
        })
      }
    })
  })

  function getElementsMovement(data1) {
    // Inicializa un array vacío para almacenar los elementos de data
    let elementosData = [];
  
    // Utiliza el método map() para recorrer data1
    data1.map(item => {
      // Utiliza el método concat() para agregar los elementos de data al array elementosData
      elementosData = elementosData.concat(item.data);
    });
  
    return elementosData;
  }

  const [invalidCardsAdditionSt, setInvalidCardsAdditionSt] = useState([])
  
  const identifyInvalidcard = (additionMove: any, message: string) => {
    console.log({additionMove})
    let messageSplit = message.split('@@@')
    let cardValidation = [];
    let invalidCard;
    if (messageSplit[3] && JSON.parse(messageSplit[3])?.length > 0) {
      JSON.parse(messageSplit[3]).forEach(code => {
        invalidCard = additionMove.find(addition => addition.idCard.includes(code))
        cardValidation.push(invalidCard)
      })
      setInvalidCardsAdditionSt(cardValidation)
    } else if (messageSplit[6] && JSON.parse(messageSplit[6])?.length > 0) {
      JSON.parse(messageSplit[6]).forEach(code => {
        invalidCard = additionMove.find(addition => addition.idCard.includes(code))
        cardValidation.push(invalidCard)
        setInvalidCardsAdditionSt(cardValidation)
      })
    } else if (messageSplit[9] && JSON.parse(messageSplit[9])?.length > 0) {
      JSON.parse(messageSplit[9]).forEach(code => {
        invalidCard = additionMove.find(addition => addition.idCard.includes(code))
        cardValidation.push(invalidCard)
        setInvalidCardsAdditionSt(cardValidation)
      })

    }
  }


  const formatMoney = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const onCancel = () => {
    setMessage({
      title: "Cancelar",
      description: "¿Está segur@ que desea cancelar los valores?",
      show: true,
      OkTitle: "Aceptar",
      onOk: () => {
        setMessage({});
        setAddTransferData({
          array: [],
          meta: {
            total: 0,
          }
        })
        setDetailTransferData({
          array: [],
          meta: {
          total: 0,
          }
      })
      setMessage({})
        navigate(-1)
      },
    });
  }

  return {
    control,
    totalTransfer,
    arrayDataSelect,
    setValue,
    onCancel,
    register,
    getValues,
    onSubmitTab,
    formatMoney,
    invalidCardsAdditionSt,
    watch
  }
}