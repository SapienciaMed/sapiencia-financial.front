import { useForm } from 'react-hook-form';
import { ICdpMgaAssoc } from '../interfaces/budgetAvailabilityInterfaces';
import useYupValidationResolver from '../../../common/hooks/form-validator.hook';
import { cdpMgaAssoc } from '../../../common/schemas/cdp-crud-validator';
import { useState, useEffect, useContext } from 'react';
import { useCdpService } from './cdp-service';
import { EResponseCodes } from '../../../common/constants/api.enum';
import { AppContext } from '../../../common/contexts/app.context';
import { useNavigate } from 'react-router-dom';
import { IDropdownProps } from '../../../common/interfaces/select.interface';

interface IArrayMgaAssoc {
    id: number,
    mgaActivity: string,
    detailedMgaActivity: string,
    cpc: string,
    percentage: number,
    cdpCode: number,
    /* mgaActivity: number,
    detailedMgaActivity:number, */

    tabActivity: string,
    tabDetailedMgaActivity: string
}

export function useCdpMgaAssoc(id?: string, idRoute?: string) {
   
    const resolver = useYupValidationResolver(cdpMgaAssoc);
    const { setMessage } = useContext(AppContext);
    const { getCdpById, getActivitiesDetail, validate, createVinculationMGA,validateCDP } = useCdpService()
    const [arrayDataSelect, setArrayDataSelect] = useState({
        listDetailedActivityMGA: []
    })
    const [arrayMgaAssoc, setArrayMgaAssoc] = useState<IArrayMgaAssoc[]>([])
    const [nextId, setNextId] = useState(1);
    const [disableAddButton, setDisableAddButton] = useState(false)
    const [activities, setActivities] = useState<IDropdownProps[]>([]);
    const [valorFinal, setValorFinal] = useState<any>();
    const navigate = useNavigate();

    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
        setValue,
        reset
    } = useForm<ICdpMgaAssoc>({
        resolver,
        mode: 'all',
    })

    useEffect(() => {
        id && getCdpById(id).then(res => {
            if (res.operation.code === EResponseCodes.OK) {
                const data = res.data[0]
                data?.amounts.filter(us => us.id == parseInt(idRoute)).map(val => {
                    setValue('projectId', Object(val).projectName)
                    setValue('fundsSapiencia', Object(val).fundCode)
                    setValue('pospreSapiencia', Object(val).pospreSapienciaCode)
                    setValue('finalValue', Object(val).idcFinalValue)
                    setValorFinal(Object(val).idcFinalValue)
                })
            }
        }).catch((error) => console.log(error))

        getActivitiesDetail().then(res => {
            const activities = Object(res).data?.map(d => ({ id: d.activity.id, name: d.activity.activityDescriptionMGA, value: d.activity.id, activityId: d.activityId, activity: d.detailActivity, cost: d.unitCost, activitieMga: d.id }))
            setActivities(activities)
        })

    }, [])


    useEffect(() => {
        const dataMockServiceDetail = {
            listDetailedActivityMGA: [
                { id: '1', name: 'Seleccione', value: null },
                { id: "2", name: "Actividad 1", value: "Actividad 1", costActivity: '700000.0' },
                { id: "3", name: "Actividad 2", value: "Actividad 2", costActivity: '500000.0' },
                { id: "4", name: "Actividad 3", value: "Actividad 3", costActivity: '500000.0' },
            ]
        }
        setArrayDataSelect(dataMockServiceDetail)
    }, [])

    useEffect(() => {
        const sumaPercentage = arrayMgaAssoc.reduce((acumulador, elemento) => {
            return acumulador + elemento.percentage;
        }, 0);
        setDisableAddButton(sumaPercentage > 100)
    }, [arrayMgaAssoc])

    const onSubmit = handleSubmit(async (data: any) => {       
     
        const sumaPercentage = arrayMgaAssoc.reduce((acumulador, elemento) => {
            return acumulador + elemento.percentage;
        }, 0);

        const valorActividad = arrayDataSelect?.listDetailedActivityMGA.find(val => val.value == data.DetailedActivityMGA)?.costActivity
        const percentageTotalValue = (parseInt(data.percentageAffected) * parseInt(data.finalValue)) / 100

        //setear valores
        const selectActivitie = activities.find(activity => activity.id == data.DetailedActivityMGA);

        const datos = {
            cdpId: id,
            costMGA: selectActivitie.cost
        }      

        const validateCDPData = {
            activitieId: selectActivitie.id,
            valueFinal: valorFinal ?? 0,
            activitieCost: selectActivitie.cost
        };

        const validation = await validate(datos);        
        const validationCDP = await validateCDP(validateCDPData);        

        if (percentageTotalValue > selectActivitie.cost) {
            setMessage({
                title: 'Validacion',
                show: true,
                description: "No se podra asociar, supera el valor del costo de la MGA.",
                OkTitle: "Aceptar",
                background: true,
            });


        } else if (validation.operation.code === EResponseCodes.FAIL) {
            setMessage({
                title: 'Validación',
                show: true,
                description: `${validation.operation.message}`,
                OkTitle: "Aceptar",
                background: true,
            });


        } else if(validationCDP.operation.code === EResponseCodes.FAIL){
            setMessage({
                title: 'Validación',
                show: true,
                description: `${validationCDP.operation.message}`,
                OkTitle: "Aceptar",
                background: true,
            });
        } else if (sumaPercentage + parseInt(data.percentageAffected) <= 100) {
            const mgaAssoc = {
                id: nextId,
                mgaActivity: String(selectActivitie.activitieMga),
                detailedMgaActivity:  String(selectActivitie.activityId),
                cpc: data.cpc,
                percentage: parseInt(data.percentageAffected),
                cdpCode: Number(id),
                
                tabActivity: selectActivitie.activity,
                tabDetailedMgaActivity: selectActivitie.name,
            }
            setArrayMgaAssoc([...arrayMgaAssoc, mgaAssoc])
            setNextId(nextId + 1);
        }      

    })

    const deleteElement = (idToDelete) => {

        setMessage({
            title: "Eliminar",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            description: '¿Estás segur@ de eliminar el registro?',
            onOk: () => {

                const nuevoArray = arrayMgaAssoc.filter((element) => element?.id !== idToDelete);
                setArrayMgaAssoc(nuevoArray);

                setMessage({
                    title: "Eliminado",
                    show: true,
                    OkTitle: "Aceptar",
                    description: '¡Registro eliminado exitosamente!',
                    onOk: () => {
                        setMessage({})
                    },
                    background: true
                })

            },
            background: true
        })



    };

    const onCancel = () => {
        setMessage({
            title: "Cancelar",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            description: '¿Estás segur@ de cancelar?',
            onOk: () => {

                setMessage({})
                navigate(-1);
            },
            background: true
        })
    };

    const onAddvalues = async (data: any) => {


        setMessage({
            show: true,
            title: "Guardar",
            description: "¿Estás segur@ de guardar la informacion ?",
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onOk() {
                confirmCreate();
            },
            background: true,
        });
    };


    const handleSaveSubmit = () => handleSubmit(onAddvalues)(

    );



    const confirmCreate = async () => {
        const datos = arrayMgaAssoc.map(item => ({
            activitieMga: Number(item.mgaActivity),
            activitieDetailMga: Number(item.detailedMgaActivity),
            percentageAfected: Number(item.percentage),
            cdpCode: Number(item.cdpCode)
        }));

        const finalObject = { datos };


        try {
            const res = await createVinculationMGA(finalObject);


            if (res && res.operation?.code === EResponseCodes.OK) {
                setMessage({
                    OkTitle: "Aceptar",
                    description: "Guardado exitosamente",
                    title: "Guardar",
                    show: true,
                    type: EResponseCodes.OK,
                    background: true,
                    onOk() {
                        reset();
                        setMessage({});
                        navigate(-1);
                    },
                    onClose() {
                        reset();
                        setMessage({});
                    },
                });
            } else {
                setMessage({
                    type: EResponseCodes.FAIL,
                    title: "Guardar",
                    description: "El registro no se pudo guardar",
                    show: true,
                    OkTitle: "Aceptar",
                    background: true,
                });
            }
        } catch (error) {

            setMessage({
                type: EResponseCodes.FAIL,
                title: "Error",
                description: "Ocurrió un error al intentar guardar",
                show: true,
                OkTitle: "Aceptar",
                background: true,
            });
        }
    }


    return {
        errors,
        control,
        arrayDataSelect,
        arrayMgaAssoc,
        disableAddButton,
        register,
        onSubmit,
        deleteElement,
        handleSaveSubmit,
        onCancel,
        activities
    }

}