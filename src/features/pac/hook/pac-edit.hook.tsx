import { useForm } from "react-hook-form"
import { IPacEdit } from "../interface/Pac"
import { useEffect, useState } from "react"
import { usePacServices } from "./pac-services.hook"
import { useParams } from "react-router-dom";
import { EResponseCodes } from "../../../common/constants/api.enum";

export function usePacEdit() {
    
    const { idPac: id } = useParams();
    const {GetPacById} = usePacServices()
    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
        watch,
        setValue
    } = useForm<IPacEdit>()

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

    const pacTypeWatch = watch('pacType')

    useEffect(() => {
        const pacTypeToMothEnabled = {
            '2': { programed: true, collected: false },
            '3': { programed: false, collected: true },
            '4': { programed: true, collected: true },
        };
      
        if (pacTypeWatch !== undefined && pacTypeToMothEnabled[pacTypeWatch]) {
          setIsMothEnabled(pacTypeToMothEnabled[pacTypeWatch]);
        }else {
            setIsMothEnabled({
                programed: false,
                collected: false
            })
        }

    }, [pacTypeWatch]);

    useEffect(() => {
        if(id){
            GetPacById(parseInt(id)).then(response => {
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
                    setValue('totalProgrammed', String(dinamicData.totalsPac.totalProgramming))
                    setValue('totalCollected', String(dinamicData.totalsPac.totalCollected))

                    dinamicData.resultPac.pacAnnualizations.filter(content => content.type == 'Programado').map(value => {
                        setValue(`programmed.january`, String(value.jan))
                        setValue(`programmed.february`, String(value.feb))
                        setValue(`programmed.march`, String(value.mar))
                        setValue(`programmed.april`, String(value.abr))
                        setValue(`programmed.may`, String(value.may))
                        setValue(`programmed.june`, String(value.jun))
                        setValue(`programmed.july`, String(value.jul))
                        setValue(`programmed.august`, String(value.ago))
                        setValue(`programmed.september`, String(value.sep))
                        setValue(`programmed.october`, String(value.oct))
                        setValue(`programmed.november`, String(value.nov))
                        setValue(`programmed.december`, String(value.dec))
                    })

                    dinamicData.resultPac.pacAnnualizations.filter(content => content.type == 'Recaudado').map(value => {
                        setValue(`collected.january`, String(value.jan))
                        setValue(`collected.february`, String(value.feb))
                        setValue(`collected.march`, String(value.mar))
                        setValue(`collected.april`, String(value.abr))
                        setValue(`collected.may`, String(value.may))
                        setValue(`collected.june`, String(value.jun))
                        setValue(`collected.july`, String(value.jul))
                        setValue(`collected.august`, String(value.ago))
                        setValue(`collected.september`, String(value.sep))
                        setValue(`collected.october`, String(value.oct))
                        setValue(`collected.november`, String(value.nov))
                        setValue(`collected.december`, String(value.dec))
                    })
                    
                }        
        
            })
        }
    },[id])

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

    return {
        pacMoths,
        control,
        isMothEnabled,
        entitiesData,
        handleSubmit,
        errors,
        register
    }
}