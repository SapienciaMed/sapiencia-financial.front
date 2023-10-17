import React, { useContext, useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { useForm } from 'react-hook-form';
import useYupValidationResolver from "../../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../../common/contexts/app.context";
import { IMessage } from "../../../../common/interfaces/global.interface";
import { useNavigate } from "react-router-dom";
import { usePacService } from "./pac-service.hook";
import { EResponseCodes } from "../../../../common/constants/api.enum";
import { IErrorTablePac, IHeadPac, IPac } from "../../interface/Pac";
import { pacCrudValidator } from "../../../../common/schemas/pac";
import { ITableAction, ITableElement } from "../../../../common/interfaces/table.interfaces";
import { IProjectOperation } from "../../../project-operation/interface/ProjectOperation";


export function usePacCrud() {

  const dateToday = new Date()

  const resolver = useYupValidationResolver(pacCrudValidator);

  const { setMessage } = useContext(AppContext);

  const { uploadPac } = usePacService()

  const navigate = useNavigate();

  const actualFullYear = dateToday.getFullYear();

  const tableComponentRef = useRef(null);
  const [isVisibleTable, setIsVisibleTable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false)

  const tableColumns: ITableElement<IErrorTablePac>[] = [
    {
      fieldName: "rowError",
      header: "Fila"
    },
    {
      fieldName: "message",
      header: "Validación",
    },
    
  ];


  /* {
    "message": "No coincide valor programado con valor presupuesto sapiencia",
    "error": true,
    "rowError": 1,
    "columnError": null
  } */

  
  function loadTableData(searchCriteria?: object): void {
    if (tableComponentRef.current) {
      tableComponentRef.current.loadData(searchCriteria);
    }
  }

  useEffect(() => {
    loadTableData();
  }, [])
  

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setValue: setValueRegister,
    reset,
    control,
    watch,
    getValues
  } = useForm<IHeadPac>({
    defaultValues: {
      exercise: actualFullYear,
      typePac: "",
      typeSource: "",
      file: {}
    },
    mode: 'onChange',
    resolver,
  });


  const [isAllowSave, setIsAllowSave] = useState(true)

  React.useEffect(() => {

    const subscription = watch(() => { });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmitPac = handleSubmit(async (data: IHeadPac) => {
    
    console.log("*********************+en submit: ",JSON.stringify(data.file))
    let formData = new FormData()
    formData.append('exercise', `${data.exercise}`)
    formData.append('typePac', data.typePac)
    formData.append('typeSource', data.typeSource)
    formData.append('file', data.file)
    console.log({file:data.file})
    showModal({
      title: "Guardar",
      description: "¿Está segur@ de guardar el proyecto?",
      show: true,
      OkTitle: "Aceptar",
      cancelTitle: "Cancelar",
      onOk: () => {
        setMessage({})
        messageConfirmSave(formData)
        setIsLoading(true)
      },
      onCancel: () => {
        setMessage({})
        onCancelNew()
        setIsLoading(false)
      },
      onClose: () => {
        setMessage({})
        onCancelNew()
        setIsLoading(false)
      },
      background: true
    })


  });

const [errorsPac, setErrorsPac] = useState<any[]>([])
  const messageConfirmSave = async (data: any) => {
    const response = await uploadPac(data)
    console.log({response:response})
    if (response.operation.code == "OK" && !Object(response).data.data?.errno) {

      showModal({
        title: "Guardado",
        description: response.operation.message,  //"El archivo no pudo ser cargado, revisa las validaciones.",
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({})
          !data.id ? onCancelNew() : onCancelEdit()
          setErrorsPac(Object(response).data.errors)
          setIsLoading(false)
          setIsAllowSave(false)
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
          setIsLoading(false)
        }
      })
    } else {
      showModal({
        title: "Carga de archivo",
        description: response.operation.message,
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({})
          onCancelNew()
          setIsLoading(false)
        }
      })
    }
  }

  const onCancelNew = () => {
    navigate("./../cargar");
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



  return {
    control,
    errors,
    register,
    watch,
    onSubmitPac,
    showModal,
    setMessage,
    getValues,
    isAllowSave,
    actualFullYear,
    isVisibleTable,
    tableColumns,
    tableComponentRef,
    errorsPac,
    isLoading
  };
}
