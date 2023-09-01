import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from 'react-hook-form';
import { IAdditionsForm } from "../interfaces/Additions";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsAdditionalValidation } from "../../../common/schemas";
import { AppContext } from "../../../common/contexts/app.context";
import { IArrayDataSelect, IMessage } from "../../../common/interfaces/global.interface";
import { useAdditionsTransfersService } from "./additions-transfers-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";


export function useAdditionAreaCrud() {
  
  const resolver = useYupValidationResolver(fundsAdditionalValidation);
  const { setMessage } = useContext(AppContext);
  const { GetFundsList, GetProjectsList, GetPosPreSapienciaList, validateCreateAdition, createAdition } = useAdditionsTransfersService()
  const [arrayDataSelect, setArrayDataSelect] = useState<IArrayDataSelect>({
    functionalArea: [],
    areas:[],
    funds: [],
    posPre: []
  })

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

//const { ingreso, gasto } = getValues()
//console.log({ ingreso, gasto })
let watchForm = watch()

useEffect(() => {
  let incomeRes = getAreasByProject(arrayDataSelect.functionalArea, watchForm.ingreso)
  let outcomeRes = getAreasByProject(arrayDataSelect.functionalArea, watchForm.gasto)
  
  setArrayDataSelect(prevState => ({
    ...prevState,
    areas: incomeRes.concat(outcomeRes)
  }));
}, [watchForm])


const getAreasByProject = (functionalArea:any, ingreso:any)=>{
  const areasListByProject = [];
  ingreso.forEach(e=>{
    let project = functionalArea.find(el=>el.id==e.projectId)
    project && (project.area.map(ev=>{
      ev.cardId = e.cardId
      return ev
    }))
    project && areasListByProject.push(project.area)
  })
  return areasListByProject;
}


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
        value: outcome.value
      })
  )
    
  const gastoFixed = data.gasto.map(outcome => ({
        idCard: outcome.cardId,
        type: 'Gasto',
        managerCenter: outcome.managerCenter,
        projectId: outcome.projectId,
        fundId: outcome.funds,
        budgetPosition: outcome.posPre,
        value: outcome.value
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
  if(resValidate.operation.code == 'FAIL'){

    showModal({
      //type?: EResponseCodes;
      title: "Validación de datos",
      description: (resValidate.operation.message.split('__'))[0],
      show: true,
      OkTitle: "Aceptar",
      //cancelTitle: "Cancerlar",
      onOk: () => {
        setMessage({})
        identifyInvalidcard(addition.additionMove, resValidate.operation.message)
      }
     // onCancel?: () => void;
     // onClickOutClose?: boolean;
     // onClose?: () => void;
     // background?: boolean;
    })

    

  }else {
    let res = await createAdition(addition)
    
    
    showModal({
      //type?: EResponseCodes;
      title: "Guardado",
      description: (resValidate.operation.message.split('__'))[0],
      show: true,
      OkTitle: "Aceptar",
      cancelTitle: "Cancerlar",
     // onOk?: () => void;
     // onCancel?: () => void;
     // onClickOutClose?: boolean;
     // onClose?: () => void;
     // background?: boolean;
    })

  }
    

  
  
});


const identifyInvalidcard = (additionMove:any,message:string)=>{
  let messageSplit = message.split('@@@')

  if(messageSplit[1] && JSON.parse(messageSplit[1])?.length>0){
    JSON.parse(messageSplit[1]).forEach(code=>{
      let invalidCard = additionMove.find(addition=>addition.idCard.includes(code))
      setInvalidCardsAdditionSt(invalidCard)
      console.log({invalidCard})
    })
  }

}


const showModal = (values: IMessage) => {
  setMessage({
    title: values.title,
    description: values.description,
    show: true,
    OkTitle: values.OkTitle,
    onOk: values.onOk || (() => setMessage({})),
  });
};

useEffect(() => {
  if (!arrayDataSelect.functionalArea.length && !arrayDataSelect.funds.length && !arrayDataSelect.posPre.length) {
    GetProjectsList({ page: "1", perPage: "1" }).then(response => {
      if (response.operation.code === EResponseCodes.OK) {
        const projectArray = response.data?.array || [];

        const seenNames = new Set();
        const arrayEntitiesProject = projectArray.reduce((acc, item) => {
          const name = item.conceptProject;
          const value = item.id;
          const id = item.id;
          const area = [{
            name:item.areaFuntional.denomination,
            value:item.areaFuntional.id,
            id:item.areaFuntional.id
          }]
          
          if (!seenNames.has(name)) {
            seenNames.add(name);
            acc.push({ name, value, id, area });
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
  setValue
};
}
