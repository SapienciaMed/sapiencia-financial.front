import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from 'react-hook-form';
/* import { IAdditionsForm } from "../interfaces/Additions"; */
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { projectOperationCrudValidator } from "../../../common/schemas";
import { AppContext } from "../../../common/contexts/app.context";
import { IArrayDataSelect, IMessage } from "../../../common/interfaces/global.interface";
import { useNavigate } from "react-router-dom";
import { IProjectOperation } from "../interface/ProjectOperation";
import { useProjectOperationService } from "./project-operation-service.hook";


export function useProjectOperationCrud(exerciseSt:number) {

  const dateToday = new Date()

  const resolver = useYupValidationResolver(projectOperationCrudValidator);
  const { setMessage } = useContext(AppContext);

  const { createProjectOperation } = useProjectOperationService()

  const navigate = useNavigate();

  let dateFromDefault = `${exerciseSt ?? dateToday.getFullYear()}-01-01`
  let dateToDefault = `${exerciseSt ?? dateToday.getFullYear()}-12-31`

  const [dateFromDefaultSt, setDateFromDefaultSt] = useState(dateFromDefault)
  const [dateToDefaultSt, setDateToDefaultSt] = useState(dateToDefault)

  useEffect(() => {
    setDateFromDefaultSt(`${exerciseSt ?? dateToday.getFullYear()}-01-01`)
    setDateToDefaultSt(`${exerciseSt ?? dateToday.getFullYear()}-12-31`)
  }, [exerciseSt])
  

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, defaultValues },
    watch,
    getValues,
    setValue,
    getFieldState,
  } = useForm<IProjectOperation>({
    defaultValues: {
      id: null,
      entityId: 1,
      number: '1',
      name: undefined,
      isActivated: 0,
      exercise: dateToday.getFullYear(),
      dateFrom: dateFromDefault,
      dateTo: dateToDefault,
      budgetValue: null,
      assignmentValue: null,
      userModify: '',
      dateModify: '',
      userCreate: '',
      dateCreate: '',
    },
    mode: 'onSubmit',
    resolver,
  });

  let dateFromWatch = getValues('dateFrom');
  let dateToWatch = watch('dateTo');

  const validateButton = (values) => { return Object.values(values).every(campo => campo !== null && campo !== undefined && campo !== '') }
  const fullFields = validateButton(defaultValues);

  // Effect que activa el watch que detecta los cambios en todo el form
  React.useEffect(() => {
    const subscription = watch(() => { });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmitTab = handleSubmit(async (data: IProjectOperation) => {
    data.userCreate="Usuario"

      showModal({
        //type?: EResponseCodes;
        title: "Guardar",
        description: "¿Está segur@ de guardar proyecto?",
        show: true,
        OkTitle: "Aceptar",
        cancelTitle: "Cancelar",
        onOk: () => {
          setMessage({})
          messageConfirmSave(data)
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

  
  });


  const messageConfirmSave = async (data: any) => {
    
    const response = await createProjectOperation(data)
    console.log({response})
    if(response.operation.code=="OK" && !Object(response).data.data.errno){

      showModal({
        //type?: EResponseCodes;
        title: "Guardado",
        description: response.operation.message,
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({})
          onCancelNew()
        }
      })

    }else if(response.operation.code=="OK" && Object(response).data.data.errno==1062){
      showModal({
        //type?: EResponseCodes;
        title: "Validación de datos",
        description: "El proyecto ya existe",
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({})
          onCancelNew()
        }
      })
    }else{
      showModal({
        //type?: EResponseCodes;
        title: "Validación de datos",
        description: "Se generó un error inesperado, comuníquese con el administrador o intente mas tarde!",
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({})
          onCancelNew()
        }
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



  const [isAllowSave, setIsAllowSave] = useState(true)


  return {
    control,
    errors,
    register,
    watch,
    onSubmitTab,
    showModal,
    setMessage,
    getValues,
    setValue,
    isAllowSave,
    dateFromDefaultSt,
    dateToDefaultSt
  };
}
