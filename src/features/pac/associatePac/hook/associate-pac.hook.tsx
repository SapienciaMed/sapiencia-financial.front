import { useForm } from 'react-hook-form';
import { IAssocciatePac } from '../interface/AssocciatePac';
import { useContext, useEffect, useState } from 'react';
import { IArrayDataSelectPacAssociate, ICreateAssociation } from '../../interface/Pac';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../common/contexts/app.context';
import useYupValidationResolver from '../../../../common/hooks/form-validator.hook';
import { validationAssociatePac } from '../../../../common/schemas/transfer-schema';
import { useAssociatePacService } from './associate-pac-service';
import { EResponseCodes } from '../../../../common/constants/api.enum';
import { IDropdownPropsFuctionalArea } from '../../../../common/interfaces/global.interface';
import { validateTypeResourceServices } from '../../transferPac/util';

export function useAssociatePac() {
    
    const navigate = useNavigate();
    const { listDinamicsAssociations, CreateAssociations } = useAssociatePacService()
    const resolver = useYupValidationResolver( validationAssociatePac );
    const [ isBtnDisable, setIsBtnDisable ] = useState<boolean>(false)
    const { setMessage } = useContext(AppContext);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [ showSpinner,   setShowSpinner ] = useState(false)
    const [projectIdSelectedSt, setProjectIdSelectedSt] = useState<string>('')
    const [areaIdSelectedSt, setAreaIdSelectedSt] = useState<number | string>()
    const [areasByProjectSt, setAreasByProjectSt] = useState<IDropdownPropsFuctionalArea[]>()
    const [projectName, setProjectName] = useState('')

    const [arrayDataSelect, setArrayDataSelect] = useState<IArrayDataSelectPacAssociate>({
        listProjects: [],
        listFunds: [],
        listPospreSapi: []
    })

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        reset,
        setValue,
        watch,
        getValues
    } = useForm<IAssocciatePac>({
        resolver,
        mode: 'all',
        defaultValues:{
            programmed: {
                january: "0",
                february: "0",
                march: "0",
                april: "0",
                may: "0",
                june: "0",
                july: "0",
                august: "0",
                september: "0",
                october: "0",
                november: "0",
                december: "0",
            }
        }
    })

    const watchAll = watch()
    const watchProgramed = watch('programmed')

    useEffect(() => {
        const {programmed, ...rest} = watchAll
        setIsBtnDisable(Object.values(rest).some(value => value !== "" && value != undefined && value != 0))
    },[watchAll])
    
    useEffect(() => {
        if (watchProgramed) {
            if (Object.values(watchProgramed).some(value => value !== "")) {
                const total: number =  Object.values(watchProgramed).reduce((acc: number, currentValue: string) => {
                    const value = parseFloat(currentValue);
                    return acc + (isNaN(value) ? 0 : value);
                }, 0)
                setValue('totalProgrammed', String(total)) 
            } 
        }  

    },[JSON.stringify(watchProgramed)])

    useEffect(() => {
        setValue('exercise', String(new Date().getFullYear()))    
    },[])

    useEffect(() => {
        if (getValues('exercise') ) {
            setShowSpinner(true)
            getListDynamic(getValues('exercise'))
        }    
    },[getValues])
   
    const handleChangeExercise = (exercise: any) => {
        timer &&  clearTimeout(timer);  
        const newTimer =  setTimeout(() => {
            if(exercise.target.value.length == 4 ){
                setValue('functionalArea', '')
                setValue('projectName', '')
                setValue('projectId','')
                setShowSpinner(true)
                getListDynamic(exercise.target.value)
            }           
        }, 800);

        setTimer(newTimer);
    };

    //funcion que realiza la peticion para listado dinamico del PROYECTO, POSPRE SAPI Y FONDOS
    async function getListDynamic(valueExercise: string){
        const value = {
            exercise: valueExercise
        }
        listDinamicsAssociations(value).then(response => {
            setShowSpinner(false)
            if (response.operation.code === EResponseCodes.OK) {
               const dinamicData = response?.data
               
               const uniqueProjects = Array.from(new Set(dinamicData.listProjects.map(project => project.projectCode))).map(projectCode => {
                    const item = dinamicData.listProjects.find(project => project.projectCode === projectCode);
                    return {
                    name: item.projectCode,
                    value: item.idVinculation,
                    id: item.idVinculation,
                    nameProject: item.projectName,
                    functionalArea: item.numberFunctionalArea,
                    idProjectPlanning: item.idProjectPlanning,
                    numberFunctionalArea: item.numberFunctionalArea
                    };
                });

                setArrayDataSelect(prevState => ({
                    ...prevState,
                    listProjects: uniqueProjects
                }));

                const uniqueFunds = Array.from(new Set(dinamicData.listFunds.map(fund => fund.fundCode))).map(fundCode => {
                    const item = dinamicData.listFunds.find(fund => fund.fundCode === fundCode);
                    return {
                      name: item.fundCode,
                      value: item.idFund,
                      id: item.idFund
                    };
                  });
          
                  setArrayDataSelect(prevState => ({
                    ...prevState,
                    listFunds: uniqueFunds
                  }));
          
                  const uniquePospreSapi = Array.from(new Set(dinamicData.listPospreSapi.map(pospreSapi => pospreSapi.idPosPreSapi))).map(idPosPreSapi => {
                    const item = dinamicData.listPospreSapi.find(pospreSapi => pospreSapi.idPosPreSapi === idPosPreSapi);
                    return {
                      name: item.numberCodeSapi,
                      value: item.idPosPreSapi,
                      id: item.idPosPreSapi,
                      descriptionSapi: item.descriptionSapi,
                      idPosPreOrig: item.idPosPreOrig,
                      numberCodeOrig: item.numberCodeOrig
                    };
                  });
          
                  setArrayDataSelect(prevState => ({
                    ...prevState,
                    listPospreSapi: uniquePospreSapi
                  }));
            }
        }) 
    }

    useEffect(() => {
        if (projectName != "") {
            setValue('functionalArea', (areasByProjectSt.find(e => e.value != null))?.id ?? areaIdSelectedSt)
            setValue('projectName', projectName)
        }
    }, [projectIdSelectedSt])

    const optionSelected = (option: any) => {
        if (option) {
            setProjectName(arrayDataSelect.listProjects.find(e => e.value == option)?.nameProject)
            processFunctionalArea(option)
        }
    }

    const processFunctionalArea = (option: any) => {
        const areaList = arrayDataSelect.listProjects.filter(prop => prop.id == option && prop.value !== null).map(prop => ({
            name: prop.numberFunctionalArea,
            id: prop.id,
            value: prop.id
        }))

        setProjectIdSelectedSt(option)
        setAreaIdSelectedSt(areaList[0]?.id)
        setAreasByProjectSt(areaList)
    }

    const programmed = [{
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

    const onSubmit = handleSubmit(async (data: IAssocciatePac) => {
        const dataAssociate: ICreateAssociation = {
            exercise: parseInt(data?.exercise),
            resourceType: validateTypeResourceServices(data.resourceType),
            idProjectVinculation: parseInt(data.projectId),
            idFund: parseInt(data.fundsSapiencia),
            idPospreSapiencia: parseInt(data.pospreSapiencia),
            idBudget: arrayDataSelect.listPospreSapi.find(us => us.id == data.pospreSapiencia).idPosPreOrig,
            budgetSapiencia: parseInt(data.sapienciaBudget),
            annualization: {
                type: "Programado",
                jan: parseInt(data.programmed?.january),
                feb: parseInt(data.programmed?.february),
                mar: parseInt(data.programmed?.march),
                abr: parseInt(data.programmed?.april), 
                may: parseInt(data.programmed?.may),
                jun: parseInt(data.programmed?.june),
                jul: parseInt(data.programmed?.july),
                ago: parseInt(data.programmed?.august),
                sep: parseInt(data.programmed?.september),
                oct: parseInt(data.programmed?.october),
                nov: parseInt(data.programmed?.november),
                dec: parseInt(data.programmed?.december),
            }
        }

        if (String(watchAll.sapienciaBudget) !== watchAll.totalProgrammed) {
            setMessage({
                title: "Validación",
                description: "El valor del presupuesto es diferente de la suma de todos los programados",
                show: true,
                OkTitle: "Aceptar",
                onOk: () => {
                    setMessage({});
                },
                onClose: () => {
                    setMessage({});
                },
                background: true
        });  
        } else {
            setMessage({
                    title: "Guardar",
                    description: "¿Estas segur@ de guardar la información?",
                    show: true,
                    OkTitle: "Aceptar",
                    cancelTitle: "Cancelar",
                    onOk: () => {
                        CreateAssociations(dataAssociate).then(response => {
                            if (response.operation.code === EResponseCodes.OK) {
                                setMessage({
                                    title: "Guardado",
                                    description: "¡Guardado exitosamente!",
                                    show: true,
                                    OkTitle: "Aceptar",
                                    onOk: () => {
                                        setMessage({});
                                        reset();
                                        navigate(-1)
                                    },
                                    onClose: () => {
                                        setMessage({});
                                        reset();
                                        navigate(-1)
                                    },                              
                                    background: true
                                });
                            } else {
                                setMessage({
                                    title: "Validación",
                                    description: response.operation.message,
                                    show: true,
                                    OkTitle: "Aceptar",
                                    onOk: () => {
                                        setMessage({});
                                    },
                                    background: true
                                });
                            }
                        
                        })
                    },
                    onCancel: () => {
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
                reset();
                setMessage({});
                navigate(-1)
            },
            background: true
        });
    }

    return{
        programmed,
        control,
        errors,
        isBtnDisable,
        showSpinner,
        arrayDataSelect,
        areasByProjectSt,
        confirmClose,
        register,
        onSubmit,
        optionSelected,
        reset,
        handleChangeExercise
    }
}