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
import { EResponseCodes } from "../../../common/constants/api.enum";


export function useProjectOperationCrud(projectOperationalId: string, exerciseSt: number) {

  const dateToday = new Date()

  const resolver = useYupValidationResolver(projectOperationCrudValidator);
  const { setMessage } = useContext(AppContext);

  const { createProjectOperation, GetProjectOperation, UpdateProjectOperation } = useProjectOperationService()

  const navigate = useNavigate();

  const actualFullYear = dateToday.getFullYear();
  let dateFromDefault = `${exerciseSt ?? actualFullYear}-01-01`
  let dateToDefault = `${exerciseSt ?? actualFullYear}-12-31`

  const [dateFromDefaultSt, setDateFromDefaultSt] = useState(dateFromDefault)
  const [dateToDefaultSt, setDateToDefaultSt] = useState(dateToDefault)

  useEffect(() => {
    setDateFromDefaultSt(`${exerciseSt ?? actualFullYear}-01-01`)
    setDateToDefaultSt(`${exerciseSt ?? actualFullYear}-12-31`)
    if(Object(exerciseSt).length!<4){
      setValueRegister("dateFrom","");
      setValueRegister("dateTo","");
    }else{
      setValueRegister("dateFrom",dateFromDefaultSt);
      setValueRegister("dateTo",dateToDefaultSt);

    }
  }, [exerciseSt])


  const {
    handleSubmit,
    register,
    control,
    formState: { errors, defaultValues },
    setValue: setValueRegister,
    watch,
    getValues,
    getFieldState,
  } = useForm<IProjectOperation>({
    defaultValues: {
      id: null,
      entityId: 1,
      number: '1',
      name: "Funcionamiento",
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

  const [name, projectId, id, excercise] = watch(["name", "number", "id", "exercise"]);

  useEffect(() => {
    //(fundData && action == 'edit') && setIsBtnDisable(validateFieldEqualsEdition(fundData))
    console.log({ name, projectId, id, excercise })

  }, [name, projectId, id, excercise])


  const validateButton = (values) => { return Object.values(values).every(campo => campo !== null && campo !== undefined && campo !== '') }

  // Effect que activa el watch que detecta los cambios en todo el form
  React.useEffect(() => {
    const subscription = watch(() => { });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmitTab = handleSubmit(async (data: IProjectOperation) => {
    data.userCreate = "Usuario"

    showModal({
      //type?: EResponseCodes;
      title: "Guardar",
      description: "¿Está segur@ de guardar el proyecto?",
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
    console.log({data})
    const response = !data.id
    ? await createProjectOperation(data) 
    : await UpdateProjectOperation(data.id,data) 
     
    console.log({ response })
    if (response.operation.code == "OK" && !Object(response).data.data?.errno) {

      showModal({
        //type?: EResponseCodes;
        title: "Guardado",
        description: response.operation.message,
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({})
          !data.id ? onCancelNew() : onCancelEdit()
        }
      })

    } else if (response.operation.code == "OK" && Object(response).data.data.errno == 1062) {
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
    } else {
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
  const onCancelEdit = () => {
    navigate("./../../");
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

  const [projectOperationSt, setProjectOperationSt] = useState()

  useEffect(() => {
    GetProjectOperation(parseInt(projectOperationalId)).then(response => {
      if (response.operation.code === EResponseCodes.OK) {
        setProjectOperationSt(response.data);
      };
    });

  }, [projectOperationalId]);

  useEffect(() => {
    if (!projectOperationSt) return;
    setValueRegister("id", Object(projectOperationSt).id);
    setValueRegister("name", Object(projectOperationSt).name);
    setValueRegister("exercise", Object(projectOperationSt).exercise);
    setValueRegister("isActivated", Object(projectOperationSt).isActivated);
    setValueRegister("dateFrom", Object(projectOperationSt).dateFrom);
    setValueRegister("dateTo", Object(projectOperationSt).dateTo);
  }, [projectOperationSt])





  return {
    control,
    errors,
    register,
    watch,
    onSubmitTab,
    showModal,
    setMessage,
    getValues,
    isAllowSave,
    dateFromDefaultSt,
    dateToDefaultSt,
    actualFullYear
  };
}
