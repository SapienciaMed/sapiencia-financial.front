import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { IAdditionsIncome, IIncome } from '../interfaces/Additions';
import useYupValidationResolver from '../../../common/hooks/form-validator.hook';
import { fundsAdditional, fundsAdditionalValidation } from '../../../common/schemas';
import { AppContext } from '../../../common/contexts/app.context';
import { IMessage } from '../../../common/interfaces/global.interface';

export function useAdditionAreaCrud(){

  const resolver = useYupValidationResolver(fundsAdditionalValidation);
  const { setMessage } = useContext(AppContext);   

  const {
    handleSubmit,
    register: registerTabs,
    control: controlRegisterTabs,
    watch,
    getValues
  } = useForm<IAdditionsIncome>({
    defaultValues: {
      ingreso: []
    },
    mode: 'all',
    resolver,
  });
  
  const incomeSelected = watch('ingreso')
    
  const onSubmitTab = handleSubmit(async (data: IAdditionsIncome ) => {
  
  });

  const showModal = (values: IMessage) => {
      setMessage({
        title: values.title,
        description: values.description,
        show: true,
        OkTitle: values.OkTitle,
        onOk: values.onOk,
    });
  }


  return {
    controlRegisterTabs,
    registerTabs,
    onSubmitTab,
    showModal,
    setMessage,
    getValues
  }
}
