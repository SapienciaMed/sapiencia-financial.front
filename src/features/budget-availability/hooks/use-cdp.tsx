import { useContext, useRef, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { useForm } from "react-hook-form";
import { cdpCrudValidator } from "../../../common/schemas/cdp-crud-validator";
import { ITableElement } from "../../../common/interfaces/table.interfaces";


export function useCdpCrud() {
    const resolver = useYupValidationResolver(cdpCrudValidator);
    const { setMessage } = useContext(AppContext);

    const tableComponentRef = useRef(null);
    
    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "rowError",
            header: "Posición"
        },
        {
            fieldName: "message",
            header: "Proyecto",
        },
        {
            fieldName: "message",
            header: "Fondo",
        },
        {
            fieldName: "message",
            header: "Pospre",
        },
        {
            fieldName: "message",
            header: "Valor final",
        },
        {
            fieldName: "message",
            header: "Anular posición",
        },

    ];


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
        tableComponentRef,
        tableColumns
    };


}