import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { IAdditionsIncome, IIncome } from '../interfaces/Additions';
import { IDropdownProps } from '../../../common/interfaces/select.interface';
import { useAdditionsTransfersService } from './additions-transfers-service.hook';
import { EResponseCodes } from '../../../common/constants/api.enum';
import useYupValidationResolver from '../../../common/hooks/form-validator.hook';
import { fundsAdditional, fundsAdditionalValidation } from '../../../common/schemas';
import { AppContext } from '../../../common/contexts/app.context';
import { IMessage } from '../../../common/interfaces/global.interface';

export function useAdditionAreaCrud(){

  const [isNextTab, setIsNextTab] = useState<boolean>(false)
  const resolver = useYupValidationResolver(fundsAdditionalValidation);
  const { setMessage } = useContext(AppContext);

  const {
    handleSubmit,
    register: registerTabs,
    formState: { errors: errosTabs},  
    control: controlRegisterTabs,
    watch,
  } = useForm<IAdditionsIncome>({
    defaultValues: {
      ingreso: []
    },
    mode: 'all',
    resolver,
  });
  
  const incomeSelected = watch('ingreso')

  const onSubmitTab = handleSubmit(async  => {
    setIsNextTab(incomeSelected.length > 0 )
  });

  const showModal = (values: IMessage) => {
      setMessage({
        title: values.title,
        description: values.description,
        show: true,
        OkTitle: values.OkTitle,
        onOk: () => setMessage({}),
    });
  }

  useEffect(() => {

  },[])

  return {
    controlRegisterTabs,
    errosTabs,
    isNextTab,
    registerTabs,
    onSubmitTab,
    showModal,
  }
}
