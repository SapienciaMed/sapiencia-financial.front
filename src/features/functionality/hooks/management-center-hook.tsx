import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import DetailsComponent from "../../../common/components/details.component";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsValidator } from "../../../common/schemas";
import { IBudgets, IFilterBudgets } from "../interfaces/Budgets";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useTypesTranfersService } from "./types-transfers-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { ITypeTransfers } from "../interfaces/TypesTranfersInterfaces";
import BudgetsPage from "../pages/budgets-view.page";

export function useManagementCenterData() {
    const tableComponentRef = useRef(null);
    const { setMessage } = useContext(AppContext);
    const navigate = useNavigate();
    const { GetTypesTransfers } = useTypesTranfersService();
    const resolver = useYupValidationResolver(fundsValidator);
    const [typesTransfersSelected, setTypesTransfersSelected] = useState(null);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [typesTransfersData, setTypesTransfersData] = useState<IDropdownProps[]>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue: setValueRegister,
    reset
  } = useForm<IFilterBudgets>({ resolver });
    const tableColumns: ITableElement<IBudgets>[] = [
        {
            fieldName: "entity.name",
            header: "Entidad CP",
        },
        {
            fieldName: "ejercise",
            header: "Ejercicio"
        },
        {
            fieldName: "number",
            header: "Posición presupuestaria"
        },
        {
            fieldName: "denomination",
            header: "Denominacion"
        },
    ];
    const tableActions: ITableAction<IBudgets>[] = [
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
                navigate(`./vinculacion/${row.id}`);
            }
        }
    ];

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const onSubmit = handleSubmit(async (data: IFilterBudgets) => {
        loadTableData(data);
    });

    useEffect(() => {
        loadTableData();
        GetTypesTransfers().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const typeTransfers: ITypeTransfers[] = response.data;
                const arrayEntities: IDropdownProps[] = typeTransfers.map((entity) => {
                    return { name: entity.name, value: entity.id };
                });
                setTypesTransfersData(arrayEntities);
            }
        }).catch(() => { });
    }, [])
    
    return {
        tableComponentRef,
        tableColumns,
        tableActions,
        onSubmit,
        register,
        navigate,
        errors,
        setValueRegister,
        reset,
        typesTransfersSelected,
        setTypesTransfersSelected,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        typesTransfersData
    }
} 