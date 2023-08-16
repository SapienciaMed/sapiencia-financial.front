import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { IAdditionsIncome } from '../interfaces/Additions';
import { IDropdownProps } from '../../../common/interfaces/select.interface';
import { useAdditionsTransfersService } from './additions-transfers-service.hook';
import { EResponseCodes } from '../../../common/constants/api.enum';
import useYupValidationResolver from '../../../common/hooks/form-validator.hook';
import { fundsAdditional, fundsAdditionalValidation } from '../../../common/schemas';
import { AppContext } from '../../../common/contexts/app.context';
import { IMessage } from '../../../common/interfaces/global.interface';

export function useAdditionAreaCrud(){

  const [AdditionsByDistrictData, setAdditionsByDistrictData] = useState<IDropdownProps[]>([]);
  const [AdditionsBySapienciaData, setAdditionsBySapienciaData] = useState<IDropdownProps[]>([]);
  const { GetAllAdditionsByDistrict, GetAllAdditionsBySapiencia } = useAdditionsTransfersService()
  const resolver = useYupValidationResolver(fundsAdditionalValidation);
  const { setMessage } = useContext(AppContext);

  const {
    handleSubmit,
    register,
    formState: { errors },
    control: controlRegister,
    watch,
    reset,
    getValues
  } = useForm<IAdditionsIncome>({
    defaultValues: {
      ingreso: [],
      actAdministrativeDistrict: '',
      actAdministrativeSapiencia: ''
    },
    mode: 'all',
    resolver
  });

  const budgetSelected = watch("ingreso");

  useEffect(() => {
    GetAllAdditionsByDistrict().then(response => {
        if (response.operation.code === EResponseCodes.OK) {
            const typeTransfers = response.data;
            const arrayEntities = typeTransfers.map((entity) => {
                return { name: entity.actAdminDistrict, value: entity.actAdminDistrict };
            });
            setAdditionsByDistrictData(arrayEntities)
        }

    }).catch((error) => console.log(error));

    GetAllAdditionsBySapiencia().then(response => {
        if (response.operation.code === EResponseCodes.OK) {
            const typeTransfers = response.data;
            const arrayEntities = typeTransfers.map((entity) => {
                return { name: entity.actAdminSapiencia, value: entity.actAdminSapiencia };
            });
            setAdditionsBySapienciaData(arrayEntities)
        }
    }).catch((error) => console.log(error))

  },[])

  const onSubmit = handleSubmit(async (data: {actAdministrativeDistrict: string, actAdministrativeSapiencia: string}) => {
    console.log("entro");
    
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

  return {
    controlRegister,
    errors,
    AdditionsByDistrictData,
    AdditionsBySapienciaData,
    register,
    onSubmit,
    showModal
  }
}
