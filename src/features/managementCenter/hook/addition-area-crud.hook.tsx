import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from 'react-hook-form';
import { IAdditionsForm } from "../interfaces/Additions";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsAdditionalValidation } from "../../../common/schemas";
import { AppContext } from "../../../common/contexts/app.context";
import { IArrayDataSelect, IMessage } from "../../../common/interfaces/global.interface";
import { useAdditionsTransfersService } from "./additions-transfers-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useNavigate } from "react-router-dom";


export function useAdditionAreaCrud() {

  const resolver = useYupValidationResolver(fundsAdditionalValidation);
  const { setMessage } = useContext(AppContext);
  const { GetFundsList, GetProjectsList, GetPosPreSapienciaList, validateCreateAdition, createAdition } = useAdditionsTransfersService()
  const [arrayDataSelect, setArrayDataSelect] = useState<IArrayDataSelect>({
    functionalArea: [],
    areas: [],
    funds: [],
    posPre: []
  })
  const navigate = useNavigate();
  const [invalidCardsAdditionSt, setInvalidCardsAdditionSt] = useState([])

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, defaultValues },
    watch,
    getValues,
    setValue,
    getFieldState,
  } = useForm<IAdditionsForm>({
    defaultValues: {
      ingreso: [],
      gasto: [],
      actAdministrativeDistrict: '',
      actAdministrativeSapiencia: ''
    },
    mode: 'onSubmit',
    resolver,
  });
  
  const validateButton = (values) => { return Object.values(values).every(campo => campo !== null && campo !== undefined && campo !== '') }
  const fullFields = validateButton(defaultValues);

  // Effect que activa el watch que detecta los cambios en todo el form
  React.useEffect(() => {
    const subscription = watch(() => { });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmitTab = handleSubmit(async (data: IAdditionsForm) => {

    const ingresoFixed = data.ingreso.map(outcome => ({
      idCard: outcome.cardId,
      type: 'Ingreso',
      managerCenter: outcome.managerCenter,
      projectId: outcome.projectId,
      fundId: outcome.funds,
      budgetPosition: outcome.posPre,
      value: parseFloat(outcome.value)
    })
    )

    const gastoFixed = data.gasto.map(outcome => ({
      idCard: outcome.cardId,
      type: 'Gasto',
      managerCenter: outcome.managerCenter,
      projectId: outcome.projectId,
      fundId: outcome.funds,
      budgetPosition: outcome.posPre,
      value: parseFloat(outcome.value)
    })
    )

    let addition = {
      headAdditon: {
        actAdminDistrict: data.actAdministrativeDistrict,
        actAdminSapiencia: data.actAdministrativeSapiencia,
        userCreate: "123456789",
        dateCreate: "2023-08-28",
        userModify: "123456789",
        dateModify: "2023-08-28"
      },
      additionMove: ingresoFixed.concat(gastoFixed)
    }
    let resValidate = await validateCreateAdition(addition)
  
    if (resValidate.operation.code == 'FAIL') {
      showModal({
        //type?: EResponseCodes;
        title: "Validación de datos",
        description: resValidate.operation.message.split('@@@').length==1
        ? resValidate.operation.message
        :(JSON.parse((resValidate.operation.message.split('@@@'))[3]).length>0 
          ? (resValidate.operation.message.split('@@@'))[1]
          : JSON.parse((resValidate.operation.message.split('@@@'))[6]).length>0
            ? (resValidate.operation.message.split('@@@'))[4]
            : (resValidate.operation.message.split('@@@'))[7]),
        show: true,
        OkTitle: "Aceptar",
        //cancelTitle: "Cancerlar",
        onOk: () => {
          setMessage({})
          identifyInvalidcard(addition.additionMove, resValidate.operation.message)
        },
        // onCancel?: () => void;
        // onClickOutClose?: boolean;
        onClose: () => {
          setMessage({})
          identifyInvalidcard(addition.additionMove, resValidate.operation.message)
        }
        // background?: boolean;
      })

    } else {

      showModal({
        //type?: EResponseCodes;
        title: "Guardar",
        description: "¿Está segur@ de guardar la información en el sistema?",
        show: true,
        OkTitle: "Aceptar",
        cancelTitle: "Cancelar",
        onOk: () => {
          setMessage({})
          messageConfirmSave(addition, resValidate)
        },
        onCancel: () => {
          setMessage({})
          onCancelNew()
        },
        // onClickOutClose?: boolean;
         onClose: () => {
          setMessage({})
          onCancelNew()
         },
         background: true
      })

    }

  });


  const messageConfirmSave = async (addition: any, resValidate: any) => {
    let res = await createAdition(addition)
    showModal({
      //type?: EResponseCodes;
      title: "Guardado",
      description: res.operation.message,
      show: true,
      OkTitle: "Aceptar",
      onOk: () => {
        setMessage({})
        onCancelNew()
      }
      })
  }


  const identifyInvalidcard = (additionMove: any, message: string) => {
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

  const onCancelNew = () => {
    navigate("./../");
  };

  const showModal = (values: IMessage) => {
    setMessage({
      title: values.title,
      description: values.description,
      show: true,
      OkTitle: values.OkTitle,
      onOk: values.onOk || (() => setMessage({})),
      cancelTitle: values.cancelTitle
    
    });
  };

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
        }
      }).catch((error) => console.log(error))
    }

  }, [arrayDataSelect])


  let formData = watch()
  
  const [isAllowSave, setIsAllowSave] = useState(false)
  useEffect(() => {
    if(
      formData.actAdministrativeDistrict!="" &&
      formData.actAdministrativeSapiencia!=""
      ){
        //TODO: QUE HABILITE EL BOTON DE GUARDAR, SI ALMENOS TIENE UN DATO EL FORMULARIO
        let formDataEmpty=[]
        formData.ingreso.forEach((element:any)=>{
          let isEmptyPropResult = isEmptyProp(element)
          if(!isEmptyPropResult){
            formDataEmpty.push(true)
            if(formDataEmpty.includes(true)){
              setIsAllowSave(true)
            }
          }
        })
        /* formData.gasto.forEach((element:any)=>{
          let isEmptyPropResult = isEmptyProp(element)
          if(!isEmptyPropResult){
            formDataEmpty.push(true)
          }
        }) */
        
        /* if(formDataEmpty.includes(true)){
          setIsAllowSave(true)
        }else{
          setIsAllowSave(false)
        } */

        
    }
  }, [formData])
  

  function isEmptyProp(obj) {
    for (let key in obj) {
      console.log("===>>>> ",obj[key])
      if (obj.hasOwnProperty(key) && obj[key] === '' || obj[key] ==null) {
        return true; // Devuelve true si encuentra una propiedad vacía
      }
    }
    return false; // Devuelve false si no encuentra ninguna propiedad vacía
  }





  return {
    control,
    arrayDataSelect,
    errors,
    register,
    watch,
    onSubmitTab,
    showModal,
    setMessage,
    getValues,
    invalidCardsAdditionSt,
    setValue,
    isAllowSave
  };
}
