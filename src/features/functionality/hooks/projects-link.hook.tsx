import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { projects } from "../../../common/schemas";
import { AppContext } from "../../../common/contexts/app.context";
import { useForm } from "react-hook-form";
import { ITableElement } from "../../../common/interfaces/table.interfaces";
import { IProject, IProjectFilters } from "../interfaces/Projects";
import { SwitchComponent } from "../../../common/components/Form";
import { useProjectsLinkService } from "./projects-link-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";

export function useProjectsLinkData(functionalArea: string) {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(projects);
    const { setMessage } = useContext(AppContext);
    const { CreateVinculation, GetAllProjectsVinculations } = useProjectsLinkService();
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm<IProjectFilters>({ resolver });
    const [lastMove, setLastMove] = useState([]);
    const [projectsLink, setProjectsLink] = useState<string[]>([]);
    const [projectsUnLink, setProjectsUnLink] = useState<string[]>([]);
    const [filterTable, setFilterTable] = useState(null);

    const tableColumns: ITableElement<IProject>[] = [
        {
            fieldName: "id",
            header: "Id proyecto",
        },
        {
            fieldName: "name",
            header: "Nombre proyecto"
        },
        {
            fieldName: "plannedValue",
            header: "Valor programado"
        },
        {
            fieldName: "id",
            header: "Vincular",
            renderCell: (row) => {
                return <SwitchComponent idInput={`checkRow${row.id}`} onChange={(e) => {
                    if (e.value === true) {
                        setLastMove([...lastMove, { id: row }])
                        const projectLink = projectsLink.find(project => project == row.id)
                        if (!projectLink) {
                            const array = projectsLink;
                            array.push(row.id)
                            setProjectsLink(array);
                        }
                        const projectUnLink = projectsUnLink.find(project => project == row.id)
                        if (projectUnLink) {
                            const array = projectsUnLink.filter(item => item != row.id);
                            setProjectsUnLink(array);
                        }
                    } else {
                        const auxLast = lastMove;
                        if (auxLast.findIndex((value) => {
                            value.id == row.id;
                        })) {
                            auxLast.splice(auxLast.findIndex((value) => {
                                value.id == row.id;
                            }), 1)
                            setLastMove(auxLast);
                        }
                        const projectUnLink = projectsUnLink.find(project => project == row.id)
                        if (!projectUnLink) {
                            const array = projectsUnLink;
                            array.push(row.id)
                            setProjectsUnLink(array);
                        }
                        const activityLink = projectsLink.find(activity => activity == row.id)
                        if (activityLink) {
                            const array = projectsLink.filter(item => item != row.id);
                            setProjectsLink(array);
                        }
                    }
                }} />
            }
        },
    ];

    function loadTableData(searchCriteria?: object, filterTable?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria, filterTable);
        }
    }

    useEffect(() => {
        if(Number(functionalArea)) GetAllProjectsVinculations().then((response => {
            if(response.operation.code === EResponseCodes.OK) {
                const data = response.data;
                const projectsLinked = data.map(linked => linked.projectId);
                setFilterTable({id: projectsLinked})
            }
        }))
    }, [functionalArea]);

    useEffect(() => {
        if(filterTable) loadTableData();
    }, [filterTable]);

    const onSubmit = handleSubmit(async (data: IProjectFilters) => {
        loadTableData({ id: data.id }, filterTable);
    });

    async function vinculateProjects(): Promise<void> {
        if (projectsLink) {
            const res = await CreateVinculation(Number(functionalArea), projectsLink);
            if (res.operation.code != EResponseCodes.OK) {
                setMessage({
                    title: "Hubo un problema...",
                    description: res.operation.message,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    background: true
                });
            } else {
                setMessage({
                    title: "Agregar proyectos",
                    description: "Se agregaron correctamente los proyectos",
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        reset();
                        loadTableData(undefined, filterTable);
                        setMessage({});
                    },
                    background: true
                });
            }
        }
    }

    const onCancelNew = () => {
        navigate("./../../");
    };

    const onCancelEdit = () => {
        navigate("./../");
    };

    const confirmClose = (callback) => {
        setMessage({
            title: "Cancelar pospre sapiencia",
            description: "¿Seguro que desea cancelar la operación?",
            show: true,
            OkTitle: "Si, cancelar",
            cancelTitle: "Continuar",
            onOk: () => {
                callback();
                setMessage({});
            },
            background: true
        });
    }

    return { tableColumns, tableComponentRef, register, errors, reset, onSubmit, onCancelNew, onCancelEdit, confirmClose, vinculateProjects };
}