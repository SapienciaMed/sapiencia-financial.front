import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { functionalArea } from "../../../common/schemas";
import { AppContext } from "../../../common/contexts/app.context";
import { useForm } from "react-hook-form";
import { IFunctionalAreaFilters, IFunctionalArea } from "../interfaces/Functional-Area";
import DetailsComponent from "../../../common/components/details.component";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";

export function useFunctionalAreaData() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(functionalArea);
    const { setMessage } = useContext(AppContext);
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue: setValueRegister,
        reset,
    } = useForm<IFunctionalAreaFilters>({ resolver });
    const tableColumns: ITableElement<IFunctionalArea>[] = [
        {
            fieldName: "number",
            header: "Código",
        },
        {
            fieldName: "projects",
            header: "Proyectos"
        },
        {
            fieldName: "denomination",
            header: "Denominación"
        },
        {
            fieldName: "description",
            header: "Descripción"
        },
    ];
    const tableActions: ITableAction<IFunctionalArea>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                navigate(`./view/${row.id}`);
            },
        },
        {
            icon: "Edit",
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },
        },
        {
            icon: "Link",
            onClick: (row) => {
                navigate(`./link/${row.id}`);
            },
        }
    ];

    function loadTableData(searchCriteria?: object, filterTable?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria, filterTable);
        }
    }

    useEffect(() => {
        loadTableData();
    }, []);

    const onSubmit = handleSubmit(async (data: IFunctionalAreaFilters) => {
        loadTableData(data);
    });

    return { tableActions, tableColumns, tableComponentRef, navigate, register, errors, reset, onSubmit }
}