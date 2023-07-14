import { useForm } from "react-hook-form";
import { DateTime } from "luxon";
import { pospreSapienciaValidator } from "../../../common/schemas";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { useContext, useRef } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useNavigate } from "react-router-dom";

interface IPospreSapienciaFilters {
    number: string
}

export function usePospreSapienciaData() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(pospreSapienciaValidator);
    const { setMessage } = useContext(AppContext);
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue: setValueRegister,
        reset,
    } = useForm<IPospreSapienciaFilters>({ resolver });
    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "entity.name",
            header: "Codigo pospre",
        },
        {
            fieldName: "number",
            header: "Código sapiensa"
        },
        {
            fieldName: "number",
            header: "Ejercicio"
        },
        {
            fieldName: "number",
            header: "Descripción"
        },
    ];
    const tableActions: ITableAction<any>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },
        }
    ];

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    return { register, reset, errors, tableComponentRef, tableColumns, tableActions }
} 