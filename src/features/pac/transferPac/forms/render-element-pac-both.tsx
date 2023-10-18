import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import { ICreateTransferPacForm } from '../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface';
import { IAnnualRoute } from '../../interface/Pac';
import React from 'react';
import FormPacmonths  from './form-months-pac'

interface IProp {
  control: Control<ICreateTransferPacForm, any>,
  count: number,
  titleAdd?: 'origen' | 'destino',
  annualDataRoutes: {
      annualRouteService: IAnnualRoute[];
  }[],
  setValue: UseFormSetValue<any>;
}
function FormElementPacBoth({ control, count, titleAdd, annualDataRoutes, setValue }: IProp) {
  const data = useWatch({
    control,
    name: `${titleAdd}`
  });

  if (!data[count].functionalArea || !data[count].fundsSapiencia || !data[count].pospreSapiencia || !data[count].managerCenter) return null;

  const pacType = (us) => {
    if (us.type === 'Programado') {
      return 'programmed'
    } else if (us.type === 'Recaudado') {
      return 'collected'
    }
    return 'both'
  }

  return (
    <>
      {
        annualDataRoutes[count+1]?.annualRouteService.map((us, index) => 
          <FormPacmonths
            key={count+1}
            control={control}
            count={count}
            pacTypeMonth={pacType(us)}
            titleAdd={titleAdd}
            titleActive={us.type}
            setValue={setValue}
            annualDataRoutes={us}
            isBoth={true}
          />
        )
      }
    
    </>
  )

}




export default React.memo(FormElementPacBoth);