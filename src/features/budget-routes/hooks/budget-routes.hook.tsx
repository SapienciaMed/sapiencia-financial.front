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

export function useBudgetRoutesData() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const { GetAllProjects } = useFunctionalAreaService();
    const { GetAllProjectsVinculations } = useProjectsLinkService();
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(budgetRoutesValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm<IBudgetsRoutesFilters>({ resolver });
    const [projects, setProjects] = useState<IProject[]>(null);
    const [projectsVinculation, setProjectsVinculation] = useState<IProjectsVinculation[]>(null);

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
                const project = projects.find((item) => item.id === projectVinculate.projectId);
                return <>{project.name}</>
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
    ];
    const tableActions: ITableAction<IBudgetsRoutes>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                const projectVinculate = projectsVinculation.find((item) => item.id === row.idProjectVinculation);
                const project = projects.find((item) => item.id === projectVinculate.projectId);
                const rows = [
                    {
                        title: "ID proyecto",
                        value: `${project.id}`
                    },
                    {
                        title: "Nombre proyecto",
                        value: `${project.name}`
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
        if(projects && projectsVinculation) loadTableData(data);
    });

    useEffect(() => {
        GetAllProjectsVinculations().then(response => {
            if(response.operation.code === EResponseCodes.OK) {
                setProjectsVinculation(response.data);
            }
        });
        GetAllProjects().then(response => {
            if(response.operation.code === EResponseCodes.OK) {
                setProjects(response.data);
            }
        });
    }, [])

    useEffect(() => {
        if(projects && projectsVinculation) loadTableData();
    }, [projects, projectsVinculation])

    return { navigate, tableComponentRef, register, reset, errors, onSubmit, tableColumns, tableActions }
}