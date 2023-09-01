import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { useForm } from "react-hook-form";
import { budgetRoutesValidator } from "../../../common/schemas";
import { IBudgetsRoutesFilters, IBudgetsRoutes } from "../interfaces/BudgetRoutesInterfaces";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { AppContext } from "../../../common/contexts/app.context";
import DetailsComponent from "../../../common/components/details.component";
import { useFunctionalAreaService } from "../../functionality/hooks/functional-area-service.hook";
import { IProject, IProjectsVinculation } from "../../functionality/interfaces/Projects";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useProjectsLinkService } from "../../functionality/hooks/projects-link-service.hook";
import { useAdditionsTransfersService } from "../../managementCenter/hook/additions-transfers-service.hook";
import { IProjectAdditionList } from "../../functionality/interfaces/AdditionsTransfersInterfaces";

export function useBudgetRoutesData() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const { getAllProjectsVinculations } = useProjectsLinkService();
    const { GetProjectsList } = useAdditionsTransfersService()
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(budgetRoutesValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control,
        watch
    } = useForm<IBudgetsRoutesFilters>({ resolver });
    const [projects, setProjects] = useState<IProjectAdditionList[]>(null);
    const [projectsVinculation, setProjectsVinculation] = useState<IProjectsVinculation[]>(null);
    const [showTable, setShowTable] = useState(false);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)

    const inputValue =  watch(['idProjectVinculation'])

    const tableColumns: ITableElement<IBudgetsRoutes>[] = [
        {
            fieldName: "idProjectVinculation",
            header: "ID Proyecto",
            renderCell: (row) => {
                const projectVinculate = projectsVinculation.find((item) => item.id === row.idProjectVinculation);
                return <>{projectVinculate.projectId}</>
            }
        },
        {
            fieldName: "idProjectVinculation",
            header: "Nombre Proyecto",
            renderCell: (row) => {
                const projectVinculate = projectsVinculation.find((item) => item.id === row.idProjectVinculation);
                const project = projects.find((item) => item.projectId === projectVinculate.projectId);
                return <>{project?.conceptProject}</>
            }
        },
        {
            fieldName: "fund.number",
            header: "Fondo"
        },
        {
            fieldName: "budget.number",
            header: "Pospre origen"
        },
        {
            fieldName: "fuctionalArea",
            header: "Área funcional",
            renderCell: (row) => {
                const projectVinculate = projectsVinculation.find((item) => item.id === row.idProjectVinculation);
                const project = projects.find((item) => item.projectId === projectVinculate.projectId)
                return <>{project.areaFuntional.number}</>
            }
            
        }
    ];
    const tableActions: ITableAction<IBudgetsRoutes>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                const projectVinculate = projectsVinculation.find((item) => item.id === row.idProjectVinculation);
                const project = projects.find((item) => item?.projectId === projectVinculate.projectId);
                const rows = [
                    {
                        title: "ID proyecto",
                        value: `${project.projectId}`
                    },
                    {
                        title: "Nombre proyecto",
                        value: `${project?.conceptProject}`
                    },
                    {
                        title: "Centro gestor",
                        value: `${row.managementCenter}`
                    },
                    {
                        title: "Div",
                        value: `${row.div}`
                    },
                    {
                        title: "Pospre Origen",
                        value: `${row.budget.number}`
                    },
                    {
                        title: "Pospre sapiencia",
                        value: `${row.pospreSapiencia.number}`
                    },
                    {
                        title: "Fondo",
                        value: `${row.fund.number}`
                    },
                    {
                        title: "Área funcional",
                        value: `${project.areaFuntional.number}`
                    }
                ]
                setMessage({
                    title: "Detalle de Fondos",
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
        },
    ];

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const onSubmit = handleSubmit(async (data: IBudgetsRoutesFilters) => {
        if(projects && projectsVinculation) {
            setShowTable(true)
            loadTableData(data)
        };
    });

    useEffect(() => {
        getAllProjectsVinculations().then(response => {
            if(response.operation.code === EResponseCodes.OK) {
                setProjectsVinculation(response.data);
            }
        });
        GetProjectsList({ page: "1", perPage: "1" }).then(responseProjectList => {
            if (responseProjectList.operation.code === EResponseCodes.OK) {
                setProjects(responseProjectList.data.array);
            }
        })
    }, [])

    useEffect(() => {
        if(projects && projectsVinculation) loadTableData();
    }, [projects, projectsVinculation])

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])

    return { navigate, tableComponentRef, control, register, reset, isBtnDisable, showTable, setShowTable, errors, onSubmit, tableColumns, tableActions }
}