import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITableAction, ITableElement } from "../../../../common/interfaces/table.interfaces";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../../common/hooks/form-validator.hook";
import { IBudgets } from "../../../functionality/interfaces/Budgets";
import { IDropdownProps } from "../../../../common/interfaces/select.interface";
import { useTypesTranfersService } from "./types-transfers-service.hook";
import { transferValidator } from "../../../../common/schemas/transfer-schema";
import { ITransfers } from "../interfaces/TranfersInterfaces";
import { IFilterTransferInterface } from "../interfaces/FilterTransferInterface";
import { AppContext } from "../../../../common/contexts/app.context";

export function useManagementCenterTransfer() {
    const tableComponentRef = useRef(null);
    const { validateActionAccess } = useContext(AppContext)
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
            fieldName: "value",
            header: "Total traslados"
        }
    ];
    const tableActions: ITableAction<IBudgets>[] = [
        {
            icon: "Detail",
            hide:!validateActionAccess('TRASLADO_VISUALIZAR'),
            onClick: (row) => {
                navigate(`./view/${row.id}`);
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
        setShowTable,
        validateActionAccess
    }
} 