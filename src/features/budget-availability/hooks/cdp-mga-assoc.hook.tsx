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
import { useBudgetsService } from '../../functionality/budgetPosition/hooks/budgets-service.hook';
import { usePosPreSapienciaService } from '../../functionality/hooks/pospre-sapiencia-service.hook';

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
    tabDetailedMgaActivity: string,
    tabSelectCpc: string
}

export function useCdpMgaAssoc(id?: string, idRoute?: string) {
   
    const resolver = useYupValidationResolver(cdpMgaAssoc);
    const { setMessage,authorization } = useContext(AppContext);
    const { getCdpById, getActivitiesDetail, validate, createVinculationMGA,validateCDP,getDetaileActivities } = useCdpService()
    const { getAllCpc,getAllBudgets } = useBudgetsService()
    const { GetAllPosPreSapiencia } = usePosPreSapienciaService()
    const [arrayDataSelect, setArrayDataSelect] = useState({
        listDetailedActivityMGA: []
    })
    const [arrayMgaAssoc, setArrayMgaAssoc] = useState<IArrayMgaAssoc[]>([])
    const [nextId, setNextId] = useState(1);
    const [disableAddButton, setDisableAddButton] = useState(false)
    const [activities, setActivities] = useState<IDropdownProps[]>([]);
    const [cpc, setCpc] = useState<any[]>([]);
    const [valorFinal, setValorFinal] = useState<any>();
    const [pospreSapiencia, setPospreSapiencia] = useState<any>();
    const [pospreSapienciaFinal, setPospreSapienciaFinal] = useState<any>();
    const navigate = useNavigate();

    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
        setValue,
        reset,
        watch
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
                    setPospreSapiencia(Object(val).pospreSapienciaCode)
                })
            }
        }).catch((error) => console.log(error))

       /*  getActivitiesDetail().then(res => {
            const activities = Object(res).data?.map(d => ({ id: d.activity.id, name: d.activity.activityDescriptionMGA, value: d.activity.id, activityId: d.activityId, activity: d.detailActivity, cost: d.unitCost, activitieMga: d.id, pospre: d.pospre }))
            let activitiesfilter = [];

            if (activities && pospreSapienciaFinal) {
                activitiesfilter = activities.filter(f => f.pospre === pospreSapienciaFinal);
            }
            setActivities(activitiesfilter)
        }) */

        getDetaileActivities(pospreSapienciaFinal).then(res => {
            // Acceder al array dentro de data
            const dataArray = res.data.array;
        
            // Iterar sobre el array y extraer la información deseada de cada objeto
            const extractedData = dataArray.map(item => {
                return {
                    id: item.activityId,
                    value: item.activityId,
                    name: item.detailActivityDetailed,
                    codeMga: item.codeMga,
                    activityId: item.activityId,
                    activity: item.activityDescriptionMGA,
                    cost: item.totalCostActivityDetailed,
                    activitieMga: item.activityId
                    //pospre:

                    // Agrega aquí más campos si necesitas
                   /*  productDescription: item.productDescriptionMGA,
                    name: item.activityDescriptionMGA,
                    detailActivityDetailed: item.detailActivityDetailed,
                    amountActivityDetailed: item.amountActivityDetailed,
                    measurementActivityDetailedName: item.measurementActivityDetailedName,
                    totalCostActivityDetailed: item.totalCostActivityDetailed */
                };
                
            });
            setActivities(extractedData)
        
        });
        

       /*  getAllCpc().then(res => {
            const cpc = Object(res).data?.map(c => ({ id: id, name: c.ejercise, value: c.id}))
            setCpc(cpc)           
        }) */

        getAllCpc().then(res => {
            const cpc = Object(res).data?.map(c => ({ id: c.id, name: c.description, value: c.id, budgetId: c.budgetId}))
            setFilteredCpc(cpc)           
        })

        
        
    }, [pospreSapienciaFinal])
    
    useEffect(() => {
        GetAllPosPreSapiencia().then(res => {
            if (res.data && Array.isArray(res.data)) {
                const filteredResults = res.data.filter(item => item.number == pospreSapiencia);
    
                if (filteredResults.length > 0 && filteredResults[0].hasOwnProperty('budgetId')) {
                    setPospreSapienciaFinal(filteredResults[0].budgetId);
                } else {
                    console.log('No se encontraron resultados o el resultado no tiene la propiedad budgetId');
                }
            } else {
                console.log('La respuesta no contiene un array o la propiedad esperada no existe');
            }
        });
    
        // Otras operaciones...
    
    }, [pospreSapiencia]);
    
    

 
    const selecte = watch('DetailedActivityMGA')
    
    const [filteredCpc, setFilteredCpc] = useState<any[]>([]);

    
    
    useEffect(() => {
        if (selecte) {
            const selectActivitie = activities.find(activity => activity.id == selecte);           

            const filtered = filteredCpc.filter(item => item.budgetId == pospreSapienciaFinal);            

            filtered.map(c => ({id: c.id, name: c.description, value: c.id}))
            setCpc(filtered);             
        }        
    }, [selecte, filteredCpc,pospreSapienciaFinal]);
    

    
    useEffect(() => {
        const sumaPercentage = arrayMgaAssoc.reduce((acumulador, elemento) => {
            return acumulador + elemento.percentage;
        }, 0);
        setDisableAddButton(sumaPercentage >= 100)
    }, [arrayMgaAssoc])

    const onSubmit = handleSubmit(async (data: any) => {   
     
        const sumaPercentage = arrayMgaAssoc.reduce((acumulador, elemento) => {
            return acumulador + elemento.percentage;
        }, 0);

        const valorActividad = arrayDataSelect?.listDetailedActivityMGA.find(val => val.value == data.DetailedActivityMGA)?.costActivity
        const percentageTotalValue = (parseInt(data.percentageAffected) * parseInt(data.finalValue)) / 100

        //setear valores
        const selectActivitie = activities.find(activity => activity.id == data.DetailedActivityMGA);

        const selectCpc = cpc.find(cpc => cpc.id == data.cpc);
       

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
                description: "No puede asociar esta MGA porque el costo de ella es menor al valor final de la ruta CDP seleccionada.",
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
                tabSelectCpc: selectCpc.name
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
            cdpCode: Number(item.cdpCode),
            cpcCode: Number(item.cpc),
            userCreate: authorization?.user?.numberDocument!,
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
        activities,
        filteredCpc,
        cpc
    }

}