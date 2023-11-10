import { useForm } from "react-hook-form"
import { IAnnualRoute, IEditPac, IPacEdit } from "../interface/Pac"
import { useContext, useEffect, useState } from "react"
import { usePacServices } from "./pac-services.hook"
import { useNavigate, useParams } from "react-router-dom";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { AppContext } from "../../../common/contexts/app.context";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { pacEditValidator } from "../../../common/schemas/pac";
import { validateTypePac } from "../transferPac/util/validate-type-pac";

export function usePacEdit() {

    const navigate = useNavigate();
    const { idPac: id, budgetRouteId } = useParams();
    const { setMessage, authorization } = useContext(AppContext);
    const resolver = useYupValidationResolver(pacEditValidator);
    const { GetPacById, EditPac } = usePacServices()
    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
        watch,
        setValue,
        resetField
    } = useForm<IPacEdit>({ resolver })

    const [entitiesData, setEntitiesData] = useState({
        pospreSapiencia: [],
        fundsSapiencia: [],
        functionalArea: [],
        project: []
    })
    const [ isMothEnabled, setIsMothEnabled ] = useState({
        programed: false,
        collected: false
    })
    const [ showSpinner,  setShowSpinner ] = useState(false)
    const [ pacAnnualizationsProgammedServices, setPacAnnualizationsProgammedServices] = useState<IAnnualRoute[]>()
    const [ pacAnnualizationsCollectedServices, setPacAnnualizationsCollectedServices] = useState<IAnnualRoute[]>()
    const [ totalProgrammedServices, setTotalProgrammedServices ] = useState('')
    const [ totalCollectedServices, setTotalCollectedServices ] =  useState('')
    const [ totalBudgetSapiServices, setTotalBudgetSapiServices ] = useState('')
    const [ isBtnDisable, setIsBtnDisable ] = useState<boolean>(false)

    const pacTypeWatch = watch('pacType')
    const watchAll = watch()

    useEffect(() => {
        const pacTypeToMothEnabled = {
            '2': { programed: true, collected: false },
            '3': { programed: false, collected: true },
            '4': { programed: true, collected: true },
        };
      
        if (pacTypeWatch !== undefined && pacTypeToMothEnabled[pacTypeWatch]) {
          setIsMothEnabled(pacTypeToMothEnabled[pacTypeWatch]);

          const isProgramed = pacTypeToMothEnabled[pacTypeWatch]?.programed;
          const isCollected = pacTypeToMothEnabled[pacTypeWatch]?.collected;
          const monthsServices = ["jan", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dec",];
          const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      
          if (isProgramed && !isCollected ) {
            resetField('totalCollected', { defaultValue: totalCollectedServices });
            pacAnnualizationsCollectedServices.forEach((value, index) => {
                monthsServices.forEach((month, subIndex) => {
                  resetField(`collected.${months[subIndex]}`, { defaultValue: String(value[month]) });
                });
              });
          }

          if (isCollected && !isProgramed) {
            resetField('totalProgrammed', { defaultValue: totalProgrammedServices });
            resetField('budgetSapi', { defaultValue: totalBudgetSapiServices})
            pacAnnualizationsProgammedServices.forEach((value, index) => {
                monthsServices.forEach((month, subIndex) => {
                  resetField(`programmed.${months[subIndex]}`, { defaultValue: String(value[month]) });
                });
            });
          }

          if (isProgramed && isCollected) {
            resetField('totalCollected', { defaultValue: totalCollectedServices });
            resetField('totalProgrammed', { defaultValue: totalProgrammedServices });
            resetField('budgetSapi', { defaultValue: totalBudgetSapiServices})
            pacAnnualizationsCollectedServices.forEach((value, index) => {
                monthsServices.forEach((month, subIndex) => {
                  resetField(`collected.${months[subIndex]}`, { defaultValue: String(value[month]) });
                });
              });
              pacAnnualizationsProgammedServices.forEach((value, index) => {
                monthsServices.forEach((month, subIndex) => {
                  resetField(`programmed.${months[subIndex]}`, { defaultValue: String(value[month]) });
                });
              });
          }        
        }else {
            setIsMothEnabled({
                programed: false,
                collected: false
            })
        }

    }, [pacTypeWatch]);

    //Realiza la consulta 
    useEffect(() => {
        if(id){
            setShowSpinner(true)
            GetPacById(parseInt(id)).then(response => {
                setShowSpinner(false)
                if (response.operation.code === EResponseCodes.OK) {
                    const dinamicData = response?.data;

                    setEntitiesData({                     
                        pospreSapiencia: [{
                            name: dinamicData.resultRoute.posPreSapiNumber,
                            value: dinamicData.resultRoute.posPreSapiId,
                            id: dinamicData.resultRoute.posPreSapiId,
                        }],
                        fundsSapiencia: [{
                            name: dinamicData.resultRoute.fundNumber,
                            value: dinamicData.resultRoute.fundId,
                            id: dinamicData.resultRoute.fundId,
                        }],
                        functionalArea: [{
                            name: dinamicData.resultRoute.functionalAreaNumber,
                            value: dinamicData.resultRoute.functionalAreaId,
                            id: dinamicData.resultRoute.functionalAreaId,
                        }],
                        project: [{
                            name: dinamicData.resultRoute.projectCode,
                            value: dinamicData.resultRoute.projectPlanningId,
                            id: dinamicData.resultRoute.projectPlanningId,
                        }],
                    })

                    setValue('projectName', dinamicData.resultRoute.projectName)
                    setValue('exercise', String(dinamicData.resultPac.exercise))
                    setTotalProgrammedServices(String(dinamicData.totalsPac.totalProgramming))
                    setTotalCollectedServices(String(dinamicData.totalsPac.totalCollected))

                    setPacAnnualizationsProgammedServices(dinamicData.resultPac.pacAnnualizations.filter(content => content.type == 'Programado'))
                    dinamicData.resultPac.pacAnnualizations.filter(content => content.type == 'Programado').map(value => {
                        setValue(`programmed.january`, String(value.jan || 0))
                        setValue(`programmed.february`, String(value.feb || 0))
                        setValue(`programmed.march`, String(value.mar || 0))
                        setValue(`programmed.april`, String(value.abr || 0))
                        setValue(`programmed.may`, String(value.may || 0))
                        setValue(`programmed.june`, String(value.jun || 0))
                        setValue(`programmed.july`, String(value.jul || 0))
                        setValue(`programmed.august`, String(value.ago || 0))
                        setValue(`programmed.september`, String(value.sep || 0))
                        setValue(`programmed.october`, String(value.oct || 0))
                        setValue(`programmed.november`, String(value.nov || 0))
                        setValue(`programmed.december`, String(value.dec || 0))
                    })
                    setPacAnnualizationsCollectedServices(dinamicData.resultPac.pacAnnualizations.filter(content => content.type == 'Recaudado'))
                    dinamicData.resultPac.pacAnnualizations.filter(content => content.type == 'Recaudado').map(value => {
                        setValue(`collected.january`, String(value.jan || 0))
                        setValue(`collected.february`, String(value.feb || 0))
                        setValue(`collected.march`, String(value.mar || 0))
                        setValue(`collected.april`, String(value.abr || 0))
                        setValue(`collected.may`, String(value.may || 0))
                        setValue(`collected.june`, String(value.jun || 0))
                        setValue(`collected.july`, String(value.jul || 0))
                        setValue(`collected.august`, String(value.ago || 0))
                        setValue(`collected.september`, String(value.sep || 0))
                        setValue(`collected.october`, String(value.oct || 0))
                        setValue(`collected.november`, String(value.nov || 0))
                        setValue(`collected.december`, String(value.dec || 0))
                    })

                    setValue('resourceType', dinamicData.resultPac.sourceType)
                    setValue('budgetSapi', String(dinamicData.totalsPac.totalProgramming)) 
                    setTotalBudgetSapiServices(String(dinamicData.totalsPac.totalProgramming))
                }       
            }).catch(error => {
                setShowSpinner(false)
                setMessage({
                    title: "Error",
                    description: "Ha ocurrido un error al cargar la información del PAC",
                    show: true,
                    OkTitle: "Aceptar",
                    cancelTitle: "Cancelar",
                    onOk: () => {
                        setMessage({});
                        navigate(-1)
                    },
                    background: true
                });
            
            })
        }
    },[id])

    useEffect(() => {
        if (entitiesData.pospreSapiencia.length > 0) {
            setValue('pospreSapiencia', entitiesData.pospreSapiencia.find(u => u.value != undefined)?.id)
            setValue('fundsSapiencia',entitiesData.fundsSapiencia.find(u => u.value != undefined)?.id)
            setValue('functionalArea', entitiesData.functionalArea.find(u => u.value != undefined)?.id)
            setValue('project', entitiesData.project.find(u => u.value != undefined)?.id)
            setValue('managerCenter', '91500000')
        }
    },[entitiesData])

    useEffect(() => {
        if(watchAll.programmed){
            if (Object.values(watchAll.programmed).some(value => value !== "")) {
                const total: number =  Object.values(watchAll.programmed).reduce((acc: number, currentValue: string) => {
                    const value = parseFloat(currentValue);
                    return acc + (isNaN(value) ? 0 : value);
                }, 0)
                setValue('totalProgrammed', String(total)) 
            } 
        }
    },[JSON.stringify(watchAll.programmed)])

    useEffect(() => {
        if(watchAll.collected){
            if (Object.values(watchAll.collected).some(value => value !== "")) {
                const total: number =  Object.values(watchAll.collected).reduce((acc: number, currentValue: string) => {
                    const value = parseFloat(currentValue);
                    return acc + (isNaN(value) ? 0 : value);
                }, 0)
                setValue('totalCollected', String(total)) 
            } 
        }
    },[JSON.stringify(watchAll.collected)])

    useEffect(() => {
        if(pacAnnualizationsProgammedServices && pacAnnualizationsCollectedServices && totalBudgetSapiServices){
            const changeProgramed =  compareValues(pacAnnualizationsProgammedServices[0], watchAll.programmed);
            const changeCollected =  compareValues(pacAnnualizationsCollectedServices[0], watchAll.collected);
            const changeBudgetSapi = totalBudgetSapiServices == watchAll.budgetSapi;

            const activity = {
                changeProgramed,
                changeCollected,
                changeBudgetSapi
            }
            const isBtnDisable = !(
                activity.changeProgramed &&
                activity.changeCollected &&
                activity.changeBudgetSapi
            );
            setIsBtnDisable(isBtnDisable);
        }
    },[JSON.stringify(watchAll.programmed), JSON.stringify(watchAll.collected), watchAll.budgetSapi])
    
    function compareValues(obj1: IAnnualRoute, obj2) {
        const monthsServices = ["jan", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dec",];
        return Object.keys(obj2).every((prop, index) => {
            const {id, cardId, dateCreate, type, dateModify, pacId, ...rest } = obj1
            return rest[monthsServices[index]] == Number(obj2[prop])        
        })
    }

    const pacMoths = [{
        january: "Enero",
        february: "Febrero",
        march: "Marzo",
        april: "Abril",
        may: "Mayo",
        june: "Junio",
        july: "Julio",
        august: "Agosto",
        september: "Septiembre",
        october: "Octubre",
        november: "Noviembre",
        december: "Diciembre",
    }]

    const onSubmit = handleSubmit(async (data: IPacEdit) => {
        const transformData: IEditPac = {
            id: parseInt(id),
            pacType: validateTypePac( parseInt(data.pacType) ) ,
            budgetRouteId: parseInt(budgetRouteId),
            budgetSapiencia: parseInt(data.budgetSapi),
            annProgrammingPac: {
                id: pacAnnualizationsProgammedServices.find(us => us).id,
                pacId: parseInt(id),
                type: "Programado",
                jan: parseInt(data.programmed.january || "0"),
                feb: parseInt(data.programmed.february || "0"),
                mar: parseInt(data.programmed.march || "0"),
                abr: parseInt(data.programmed.april || "0"),
                may: parseInt(data.programmed.may || "0"),
                jun: parseInt(data.programmed.june || "0"),
                jul: parseInt(data.programmed.july || "0"),
                ago: parseInt(data.programmed.august || "0"),
                sep: parseInt(data.programmed.september || "0"),
                oct: parseInt(data.programmed.october || "0"),
                nov: parseInt(data.programmed.november || "0"),
                dec: parseInt(data.programmed.december || "0"),
                dateModify: new Date(authorization.user.dateModify).toISOString().split('T')[0],
                dateCreate: new Date(authorization.user.dateCreate).toISOString().split('T')[0]
            },
            annCollectyerPac: {
                id: pacAnnualizationsCollectedServices.find(us => us).id,
                pacId: parseInt(id),
                type: "Recaudado",
                jan: parseInt(data.collected.january || "0"),
                feb: parseInt(data.collected.february || "0"),
                mar: parseInt(data.collected.march || "0"),
                abr: parseInt(data.collected.april || "0"),
                may: parseInt(data.collected.may || "0"),
                jun: parseInt(data.collected.june || "0"),
                jul: parseInt(data.collected.july || "0"),
                ago: parseInt(data.collected.august || "0"),
                sep: parseInt(data.collected.september || "0"),
                oct: parseInt(data.collected.october || "0"),
                nov: parseInt(data.collected.november || "0"),
                dec: parseInt(data.collected.december || "0"),
                dateModify: new Date(authorization.user.dateModify).toISOString().split('T')[0],
                dateCreate: new Date(authorization.user.dateCreate).toISOString().split('T')[0]
            },
            
        }

        if (watchAll.budgetSapi != watchAll.totalProgrammed) {
            setMessage({
                title: "Validación",
                description: "El valor del presupuesto es diferente de la suma de todos los programados",
                show: true,
                OkTitle: "Cerrar",
                onOk: () => {
                    setMessage({});
                },
                onClose() {
                    setMessage({});
                    navigate(-1)
                },
                background: true
            });
        } else if (parseInt(watchAll.budgetSapi) < parseInt(watchAll.totalCollected)) {
            setMessage({
                title: "Validación",
                description: "El valor del presupuesto es menor al valor recaudado",
                show: true,
                OkTitle: "Cerrar",
                cancelTitle: "Cancelar",
                onOk: () => {
                    setMessage({});
                },
                background: true
            });
        }else{
            setMessage({
                title: "Guardar",
                description: "¿Estás segur@ de guardar la información?",
                show: true,
                OkTitle: "Aceptar",
                cancelTitle: "Cancelar",
                onOk: () => {
                    EditPac(transformData).then(response => {
                        if (response.operation.code === EResponseCodes.OK) {
                            setMessage({
                                title: "Confirmación",
                                description: "¡Guardado exitosamente!",
                                show: true,
                                OkTitle: "Cerrar",
                                onOk: () => {
                                  setMessage({});
                                  navigate(-1)
                                },
                                background: true,
                                onClose: () => {
                                  setMessage({});
                                  navigate(-1)
                                },
                            });
                        } else {
                            setMessage({
                                title: "Validación",
                                description: response.operation.message,
                                show: true,
                                OkTitle: "Cerrar",
                                onOk: () => {
                                    setMessage({});
                                    navigate(-1)
                                },
                                background: true,
                                onClose: () => {
                                    setMessage({});
                                    navigate(-1)
                                },
                            });
                        }
                    })
                },
                onCancel() {
                    setMessage({});
                },
                background: true
            });
            
        }

    })

    const confirmClose = () => {
        setMessage({
            title: "Cancelar",
            description: "¿Estas segur@ de cancelar la información en el sistema?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                setMessage({});
                navigate(-1)
            },
            background: true
        });
    }

    return {
        pacMoths,
        control,
        isMothEnabled,
        entitiesData,
        errors,
        showSpinner,
        isBtnDisable,
        onSubmit,
        confirmClose,
        register
    }
}