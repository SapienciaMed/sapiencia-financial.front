import { useContext, useEffect, useRef, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { Controller, useForm } from "react-hook-form";
import { cdpCrudValidator } from "../../../common/schemas/cdp-crud-validator";
import { useCdpService } from "./cdp-service";
import { IBudgetAvalaibility } from "../interfaces/budgetAvailabilityInterfaces";
import { useNavigate } from "react-router-dom";

export function useCdpMgaAssocCrud(cdpId?: string) {
    const resolver = useYupValidationResolver(cdpCrudValidator);
    const { setMessage } = useContext(AppContext);
    const navigate = useNavigate();
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)    


    const {
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        control,
        watch,
        getValues
    } = useForm<any>({
        mode: 'onChange',
        resolver,
    });


    const inputValue =  watch(['actAdminDistrict', 'actAdminSapiencia', 'observations'])
    const inputValues = watch()

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined)  )
    },[inputValue])


    const onCancel = () => {
        setMessage({
            title: "Cancelar traslado",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            description: '¿Estás segur@ que desea cancelar el traslado?',
            onOk: () => {
                
                setMessage({})
                navigate(-1);
            },
            background: true
        })
    };
    

    return {
        control,
        errors,
        register,
        watch,
        setMessage,
        getValues,
        onCancel,
        isBtnDisable

    };


}