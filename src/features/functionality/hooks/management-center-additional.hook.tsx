import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsAdditional } from "../../../common/schemas";
import { useNavigate } from "react-router-dom";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useFunctionalAreaService } from "./functional-area-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IAdditionsFilters, IAdditionsWithMovements } from "../interfaces/Additions";

export function useManagementCenterAdditional(){

    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(fundsAdditional);
    const { GetAllProjects } = useFunctionalAreaService();

    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const [projectsData, setProjectsData] = useState<IDropdownProps[]>([]);
    const [showTable, setShowTable] = useState(false);

    const {
        handleSubmit,
        register,
        formState: { errors },
        control: controlRegister,
        watch,
        reset,
    } = useForm<IAdditionsFilters>({ resolver});

    const tableColumns: ITableElement<IAdditionsWithMovements>[] = [
        {
            fieldName: "actAdminDistrict",
            header: "Acto administrativo distrito",
        },
        {
            fieldName: "actAdminSapiencia",
            header: "Acto administrativo sapiencia"
        },
        {
            fieldName: "number",
            header: "Total adición"
        }
    ];

    const tableActions: ITableAction<IAdditionsWithMovements>[] = [
        {
            icon: "Detail",
            onClick: (row) => {},
        },
        {
            icon: "Edit",
            onClick: (row) => {},
        },
    ];

    const inputValue =  watch(['adminDistrict', 'adminSapiencia'])

    async function loadInitList(): Promise<void> {
        const response2 = await GetAllProjects(); //TODO: modificar
        if (response2.operation.code === EResponseCodes.OK) {
            const arrayProjects: IDropdownProps[] = response2.data.map((projectVinculate) => {
                return { name: projectVinculate.name, value: projectVinculate.id };
            });
            setProjectsData(arrayProjects);
        }
    }

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    useEffect(() => {
        loadInitList().then(() => {})
    },[])

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != null))
    },[inputValue])

    const onSubmit = handleSubmit(async (data: {actAdministrativeDistrict: string, actAdministrativeSapiencia: string}) => {
        setShowTable(true)
        loadTableData(data);
    });

    return{
        tableComponentRef,
        errors,
        isBtnDisable,
        controlRegister,
        projectsData,
        showTable,
        tableColumns,
        tableActions,
        onSubmit,
        navigate,
        register,
        reset,
        setShowTable
    }
}