import { useForm } from 'react-hook-form';
import {  ICdpMgaAssoc } from '../interfaces/budgetAvailabilityInterfaces';
import useYupValidationResolver from '../../../common/hooks/form-validator.hook';
import { cdpMgaAssoc } from '../../../common/schemas/cdp-crud-validator';
import { useState, useEffect, useContext } from 'react';
import { useCdpService } from './cdp-service';
import { EResponseCodes } from '../../../common/constants/api.enum';
import { AppContext } from '../../../common/contexts/app.context';

interface IArrayMgaAssoc {
    id: number,
    mgaProduct: string,
    mgaActivity: string,
    detailedMgaActivity: string,
    cpc: string,
    percentage: number,
}

export function useCdpMgaAssoc(cdpId?: string) {

    const resolver = useYupValidationResolver(cdpMgaAssoc);
    const { setMessage } = useContext(AppContext);
    const { getCdpById } = useCdpService()
    const [arrayDataSelect, setArrayDataSelect] = useState({
        listDetailedActivityMGA: []
    })
    const [arrayMgaAssoc, setArrayMgaAssoc ] = useState<IArrayMgaAssoc[]>([])
    const [nextId, setNextId] = useState(1); 
    const [ disableAddButton, setDisableAddButton ] = useState(false)
    
    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
        setValue
    } = useForm<ICdpMgaAssoc>({
        resolver,
        mode: 'all',
    })

    useEffect(() => {
        cdpId && getCdpById(cdpId).then(res => {
            if (res.operation.code === EResponseCodes.OK) {
                const data = res.data[0]
                data?.amounts.filter(us => us.id == parseInt(cdpId)).map(val => {
                    setValue('projectId', Object(val).projectName)
                    setValue('fundsSapiencia', Object(val).fundCode)
                    setValue('pospreSapiencia', Object(val).pospreSapienciaCode)
                    setValue('finalValue', Object(val).idcFinalValue )
                })
            }
         }).catch((error) => console.log(error))
    }, [])


    useEffect(() => {
        const dataMockServiceDetail = {
            listDetailedActivityMGA: [
                { id: '1', name: 'Seleccione', value: null},
                { id: "2", name: "Actividad 1", value: "Actividad 1", costActivity: '700000.0' },
                { id: "3", name: "Actividad 2", value: "Actividad 2", costActivity: '500000.0' },
                { id: "4", name: "Actividad 3", value: "Actividad 3", costActivity: '500000.0' },
            ]
        }
        setArrayDataSelect(dataMockServiceDetail)
    },[])

    useEffect(() => {
        const sumaPercentage = arrayMgaAssoc.reduce((acumulador, elemento) => {
            return acumulador + elemento.percentage;
        }, 0);
        setDisableAddButton(sumaPercentage == 100)
    },[arrayMgaAssoc])

    const onSubmit = handleSubmit(async (data: ICdpMgaAssoc) => {
        const sumaPercentage = arrayMgaAssoc.reduce((acumulador, elemento) => {
            return acumulador + elemento.percentage ;
        }, 0);

        const valorActividad = arrayDataSelect?.listDetailedActivityMGA.find(val => val.value == data.DetailedActivityMGA)?.costActivity
        const percentageTotalValue = (parseInt(data.percentageAffected ) * parseInt(data.finalValue)) / 100

        if (percentageTotalValue > parseInt(valorActividad)) {
            setMessage({
                title: 'Validacion',
                show: true,
                description: "No se podra asociar, supera el valor del costo de la MGA.",
                OkTitle: "Aceptar",
                background: true,
              });
        } else if(sumaPercentage + parseInt(data.percentageAffected) <= 100){
            const mgaAssoc = {
                id: nextId,
                mgaProduct: '5555555',
                mgaActivity: data.DetailedActivityMGA,
                detailedMgaActivity: data.DetailedActivityMGA,
                cpc: data.cpc,
                percentage: parseInt(data.percentageAffected),
            }
            setArrayMgaAssoc([...arrayMgaAssoc, mgaAssoc])
            setNextId(nextId + 1); 
        } 

    })

    const deleteElement = (idToDelete) => {
        const nuevoArray = arrayMgaAssoc.filter((element) => element?.id !== idToDelete);
        setArrayMgaAssoc(nuevoArray);
    };

    return {
        errors,
        control,
        arrayDataSelect,
        arrayMgaAssoc,
        disableAddButton,
        register,
        onSubmit,
        deleteElement,
    }
    
}