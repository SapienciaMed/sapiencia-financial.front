import { useForm } from 'react-hook-form';
import { IAssocciatePac } from '../interface/AssocciatePac';
import { useContext, useEffect, useState } from 'react';
import { IArrayDataSelectPacComplementary } from '../../interface/Pac';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../common/contexts/app.context';
import useYupValidationResolver from '../../../../common/hooks/form-validator.hook';
import { validationAssociatePac } from '../../../../common/schemas/transfer-schema';



export function useAssociatePac() {
    
    const navigate = useNavigate();
    const resolver = useYupValidationResolver( validationAssociatePac );
    const [ isBtnDisable, setIsBtnDisable ] = useState<boolean>(false)
    const { setMessage } = useContext(AppContext);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [arrayDataSelect, setArrayDataSelect] = useState<IArrayDataSelectPacComplementary>({
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
        mode: 'all'
    })

    const watchAll = watch()
    const watchProgramed = watch('programmed')
    const vigencia =  watch(['exercise'])

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
                setValue('totalProgrammed', total) 
            } 
        }  

    },[JSON.stringify(watchProgramed)])

   
    useEffect(() => {
        setValue('exercise', String(new Date().getFullYear()))    
    },[])

    useEffect(() => {
        getValues('exercise') && console.log('peticion1');      
    },[getValues])

    const handleChangeExercise = (exercise: any) => {
        timer &&  clearTimeout(timer);  
        const newTimer =  setTimeout(() => {
            if(exercise.target.value.length == 4 ){
                console.log("peticion2"); 
            }           
        }, 800);

        setTimer(newTimer);
    };


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

    const onSubmit = handleSubmit(async (data: any) => {
       setMessage({
            title: "Guardar",
            description: "¿Estas segur@ de guardar la información?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                setMessage({});
                console.log("guardado");
            },
            onCancel: () => {
                setMessage({});
            },
            background: true
        });   
    })

    const confirmClose = (callback) => {
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
        confirmClose,
        register,
        onSubmit,
        reset,
        handleChangeExercise
    }
}