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
import { ITransfers } from "../interfaces/TranfersInterfaces";
import { IFilterTransferInterface } from "../interfaces/FilterTransferInterface";

export function useManagementCenterTransfer() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const { GetTypesTransfers, GetTransfers } = useTypesTranfersService();
    const resolver = useYupValidationResolver(transferValidator);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [typesTransfersData, setTypesTransfersData] = useState<IDropdownProps[]>(null);
    const {
        handleSubmit,
        register,
        formState: { errors },
        control: controlRegister,
        reset,
        watch,
    } = useForm<IFilterTransferInterface>({ resolver });

    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const [showTable, setShowTable] = useState(false);

    const tableColumns: ITableElement<ITransfers>[] = [
        {
            fieldName: "actAdminDistrict",
            header: "Acto administrativo",
        },
        {
            fieldName: "observations",
            header: "Observaciones"
        },
        {
            fieldName: "number",
            header: "Total traslados"
        }
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
        }
    ];

    const inputValue =  watch(['adminDistrict', 'observations'])

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])

    const onSubmit = handleSubmit(async (data: IFilterTransferInterface) => {
        setShowTable(true)
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

    useEffect(() => {
        loadTableData();
        GetTransfers().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                console.log({ response })
                /* const typeTransfers: ITypeTransfers[] = response.data;
                const arrayEntities: IDropdownProps[] = typeTransfers.map((entity) => {
                    return { name: entity.name, value: entity.id };
                });
                setTypesTransfersData(arrayEntities); */
            }
        }).catch(() => { });
    }, [])

    

    return {
        tableComponentRef,
        tableColumns,
        tableActions,
        isBtnDisable,
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
        controlRegister,
        showTable,
        setShowTable
    }
} 