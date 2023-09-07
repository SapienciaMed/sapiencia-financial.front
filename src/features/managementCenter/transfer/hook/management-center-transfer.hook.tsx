import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITableAction, ITableElement } from "../../../../common/interfaces/table.interfaces";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../../common/hooks/form-validator.hook";
import { IBudgets } from "../../../functionality/interfaces/Budgets";
import { IDropdownProps } from "../../../../common/interfaces/select.interface";
import { useTypesTranfersService } from "./types-transfers-service.hook";
import { EResponseCodes } from "../../../../common/constants/api.enum";
import { ITypeTransfers } from "../interfaces/TypesTranfersInterfaces";
import { IFilterBudgets } from "../../interfaces/FilterBudgets";
import { transferValidator } from "../../../../common/schemas/transfer-schema";

export function useManagementCenterTransfer() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const { GetTypesTransfers } = useTypesTranfersService();
    const resolver = useYupValidationResolver(transferValidator);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [typesTransfersData, setTypesTransfersData] = useState<IDropdownProps[]>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    control: controlRegister,
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
        reset,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        typesTransfersData,
        controlRegister
    }
} 