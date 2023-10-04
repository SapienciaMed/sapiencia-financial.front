import React, { useContext, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import useYupValidationResolver from "../../../../common/hooks/form-validator.hook";
import { projectOperationCrudValidator } from "../../../../common/schemas";
import { AppContext } from "../../../../common/contexts/app.context";
import { IMessage } from "../../../../common/interfaces/global.interface";
import { useNavigate } from "react-router-dom";
import { usePacService } from "./pac-service.hook";
import { EResponseCodes } from "../../../../common/constants/api.enum";
import { IPac } from "../../interface/Pac";


export function usePacCrud(projectOperationalId?: string, exerciseSt?: number) {

  const dateToday = new Date()

  const resolver = useYupValidationResolver(projectOperationCrudValidator);
  const { setMessage } = useContext(AppContext);

  const { createProjectOperation, GetProjectOperation, UpdateProjectOperation } = usePacService()

  const navigate = useNavigate();

  const actualFullYear = dateToday.getFullYear();


  let dateFromDefault = `${exerciseSt ?? actualFullYear}-01-01`
  let dateToDefault = `${exerciseSt ?? actualFullYear}-12-31`

  const [dateFromDefaultSt, setDateFromDefaultSt] = useState(dateFromDefault)
  const [dateToDefaultSt, setDateToDefaultSt] = useState(dateToDefault)

  useEffect(() => {
    setValueRegister("dateFrom", "");
    setValueRegister("dateTo", "");
    if (Object(exerciseSt).length == 0) {

      setDateFromDefaultSt(`${exerciseSt}-01-01`)
      setDateToDefaultSt(`${exerciseSt}-12-31`)
      setValueRegister("dateFrom", `${exerciseSt}-01-01`);
      setValueRegister("dateTo", `${exerciseSt}-12-31`);

    } else {

      if (!exerciseSt && Object(exerciseSt).length != 0) {
        setDateFromDefaultSt(`${actualFullYear}-01-01`)
        setDateToDefaultSt(`${actualFullYear}-12-31`)
        setValueRegister("dateFrom", dateFromDefaultSt);
        setValueRegister("dateTo", dateToDefaultSt);
      } else if (Object(exerciseSt).length == 4) {
        setDateFromDefaultSt(`${exerciseSt}-01-01`)
        setDateToDefaultSt(`${exerciseSt}-12-31`)
        setValueRegister("dateFrom", `${exerciseSt}-01-01`);
        setValueRegister("dateTo", `${exerciseSt}-12-31`);
      } else {
        setValueRegister("dateFrom", `${exerciseSt}-01-01`);
        setValueRegister("dateTo", `${exerciseSt}-12-31`);
        setValueRegister("dateFrom", "");
        setValueRegister("dateTo", "");
      }
    }

  }, [exerciseSt])


  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue: setValueRegister,
    watch,
    getValues,
    getFieldState,
  } = useForm<IPac>({
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


  
  // Effect que activa el watch que detecta los cambios en todo el form
  const [isAllowSave, setIsAllowSave] = useState(false)
  
  React.useEffect(() => {
    

    const subscription = watch(() => { });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmitTab = handleSubmit(async (data: IPac) => {
    data.userCreate = "Usuario"

    showModal({
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
      onClose: () => {
        setMessage({})
        onCancelNew()
      },
      background: true
    })


  });


  const messageConfirmSave = async (data: any) => {
    const response = !data.id
      ? await createProjectOperation(data)
      : await UpdateProjectOperation(data.id, data)

    console.log({ response })
    if (response.operation.code == "OK" && !Object(response).data.data?.errno) {

      showModal({
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
        title: "Error en la conexión",
        description: "Error en la consulta de datos",
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
