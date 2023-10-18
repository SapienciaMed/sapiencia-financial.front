import React, { useEffect } from "react";
import { Control, useWatch, UseFormSetValue } from 'react-hook-form';
import { ICreateTransferPacForm } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";
import { IAnnualRoute } from "../../interface/Pac";
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

function FormElementPac({ control, count, titleAdd, annualDataRoutes, setValue }: IProp) {

    const data = useWatch({
        control,
        name: `${titleAdd}`
    });

    if (!data[count].functionalArea || !data[count].fundsSapiencia || !data[count].pospreSapiencia || !data[count].managerCenter) return null;

    const typeRoute = annualDataRoutes[count + 1]?.annualRouteService.find(u => u?.type )?.type
    console.log("🚀 ~ file: render-element-pac.tsx:27 ~ FormElementPac ~ typeRoute:", typeRoute)
    console.log("🚀 ~ file: render-element-pac.tsx:33 ~ FormElementPac ~ annualDataRoutes[count+1]?.annualRouteService:", annualDataRoutes[count+1]?.annualRouteService)

    return (
        <>
           {
                annualDataRoutes[count+1]?.annualRouteService !== undefined && typeRoute === 'Programado'  && (
                    <FormPacmonths
                        control={control}
                        count={count}
                        pacTypeMonth="programmed"
                        titleAdd={titleAdd}
                        titleActive="Programado"
                        setValue={setValue}
                        annualDataRoutes={annualDataRoutes[count+1]?.annualRouteService}
                        isBoth={false}
                    />
                )
                
            }
            {
                annualDataRoutes[count+1]?.annualRouteService !== undefined && typeRoute === 'Recaudado'  && (
                    <FormPacmonths
                        control={control}
                        count={count}
                        pacTypeMonth="collected"
                        titleAdd={titleAdd}
                        titleActive="Recaudado"
                        setValue={setValue}
                        annualDataRoutes={annualDataRoutes[count+1]?.annualRouteService}
                        isBoth={false}
                    />
                )
            }
        </>
    )
    
}

export default React.memo(FormElementPac);