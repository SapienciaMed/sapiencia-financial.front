import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from 'react-hook-form';
/* import { IAdditionsForm } from "../interfaces/Additions"; */
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsAdditionalValidation } from "../../../common/schemas";
import { AppContext } from "../../../common/contexts/app.context";
import { IArrayDataSelect, IMessage } from "../../../common/interfaces/global.interface";
/* import { useAdditionsTransfersService } from "./additions-transfers-service.hook"; */
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useNavigate } from "react-router-dom";
import { IProjectOperation } from "../interface/ProjectOperation";


export function useProjectOperationCrud() {

  const resolver = useYupValidationResolver(fundsAdditionalValidation);
  const { setMessage } = useContext(AppContext);
  
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
  } = useForm<IProjectOperation>({
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

  const onSubmitTab = handleSubmit(async (data: IProjectOperation) => {

  });


  const messageConfirmSave = async (addition: any, resValidate: any) => {
    showModal({
      //type?: EResponseCodes;
      title: "Guardado",
      description: "message",
      show: true,
      OkTitle: "Aceptar",
      onOk: () => {
        setMessage({})
        onCancelNew()
      }
    })
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

  
  
  const [isAllowSave, setIsAllowSave] = useState(false)
  

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
