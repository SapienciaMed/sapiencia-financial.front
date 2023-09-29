import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { functionalArea } from "../../../common/schemas";
import { useForm } from "react-hook-form";
import { IFunctionalAreaFilters, IFunctionalArea } from "../interfaces/Functional-Area";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IProjectsVinculation } from "../interfaces/Projects";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useAdditionsTransfersService } from "../../managementCenter/hook/additions-transfers-service.hook";

export function useFunctionalAreaData() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(functionalArea);
    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        reset,
        watch
    } = useForm<IFunctionalAreaFilters>({ resolver });
    const { GetProjectsList } = useAdditionsTransfersService()
    const [projects, setProjects] = useState<any[]>(null);
    const [showTable, setShowTable] = useState(false);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)

    const inputValue =  watch(['number'])

    const tableColumns: ITableElement<IFunctionalArea>[] = [
        {
            fieldName: "number",
            header: "Código",
        },
        {
            fieldName: "projects",
            header: "Proyectos",
            renderCell: (row) => {
                let projectsFunctionalArea:IProjectsVinculation[] = []
                if(projects) projectsFunctionalArea = projects.filter(project => project.functionalAreaId === row.id && project.linked == true);
                return <>{projectsFunctionalArea.length}</>
            }
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
        GetProjectsList().then(responseProjectList => {
            if (responseProjectList.operation.code === EResponseCodes.OK) {
                setProjects(responseProjectList.data);
            }
        })
    }, []); 

    useEffect(() => {
        if(projects) loadTableData();
    }, [projects]);

    const onSubmit = handleSubmit(async (data: IFunctionalAreaFilters) => {
        setShowTable(true)
        loadTableData(data);
    });

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])

    return { tableActions, tableColumns, tableComponentRef, isBtnDisable, showTable, control, setIsBtnDisable,
        setShowTable, navigate, register, errors, reset, onSubmit }
}