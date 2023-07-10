import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import { IFundsFilters, IFunds } from "../interfaces/Funds";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import DetailsComponent from "../../../common/components/details.component";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsValidator } from "../../../common/schemas";
import { useFundsService } from "./funds-service.hook";
import { useEntitiesService } from "./entities-service.hook";
import { IEntities } from "../interfaces/Entities";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IDropdownProps } from "../../../common/interfaces/select.interface";

export function useFundsData() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(fundsValidator);
    const { setMessage } = useContext(AppContext);
    const { GetEntities } = useEntitiesService();
    const { } = useFundsService();
    const [entitySelected, setEntitySelected] = useState(null);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [entitiesData, setEntitiesData] = useState<IDropdownProps[]>(null);
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue: setValueRegister,
        reset
    } = useForm<IFundsFilters>({ resolver });
    const tableColumns: ITableElement<IFunds>[] = [
        {
            fieldName: "entity.name",
            header: "Entidad CP",
        },
        {
            fieldName: "number",
            header: "Fondo"
        },
        {
            fieldName: "dateFrom",
            header: "Validez de"
        },
        {
            fieldName: "dateTo",
            header: "Validez a"
        },
    ];
    const tableActions: ITableAction<IFunds>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                const rows = [
                    {
                        title: "Entidad CP",
                        value: `${row.entity.name}`
                    },
                    {
                        title: "Fondo",
                        value: `${row.number}`
                    },
                    {
                        title: "Validez de",
                        value: `${row.dateFrom}`
                    },
                    {
                        title: "Validez a",
                        value: `${row.dateTo}`
                    }
                ]
                setMessage({
                    title: "Detalles",
                    show: true,
                    OkTitle: "Aceptar",
                    description: <DetailsComponent rows={rows} />,
                    background: true
                })
            },
        },
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

    const onSubmit = handleSubmit(async (data: IFundsFilters) => {
        loadTableData(data);
    });

    useEffect(() => {
        loadTableData();
        GetEntities().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.name, value: entity.id };
                });
                setEntitiesData(arrayEntities);
            }
        }).catch(() => { });
    }, [])

    return {
        tableComponentRef,
        tableColumns,
        tableActions,
        onSubmit,
        register,
        errors,
        setValueRegister,
        reset,
        entitySelected,
        setEntitySelected,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        entitiesData
    }
} 