import { useContext } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { useForm } from "react-hook-form";
import { cdpCrudValidator } from "../../../common/schemas/cdp-crud-validator";


export function useCdpCrud() {
    const resolver = useYupValidationResolver(cdpCrudValidator);

    const { setMessage } = useContext(AppContext);

    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        reset,
        control,
        watch,
        getValues
    } = useForm<any>({
        defaultValues: {
            exercise: "",
            typePac: "",
            typeSource: "",
            file: {}
        },
        mode: 'onChange',
        resolver,
    });


    return {
        control,
        errors,
        register,
        watch,
        setMessage,
        getValues,
    };


}