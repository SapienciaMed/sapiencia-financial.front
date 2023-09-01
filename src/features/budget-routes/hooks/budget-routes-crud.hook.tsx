import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { budgetRoutesCrudValidator } from "../../../common/schemas";
import { useContext, useEffect, useState } from "react";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { AppContext } from "../../../common/contexts/app.context";
import { IBudgetsRoutes, IBudgetsRoutesCrudForm } from "../interfaces/BudgetRoutesInterfaces";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useProjectsLinkService } from "../../functionality/hooks/projects-link-service.hook";
import { IEntities } from "../../functionality/interfaces/Entities";
import { IProjectsVinculation } from "../../functionality/interfaces/Projects";
import { useFunctionalAreaService } from "../../functionality/hooks/functional-area-service.hook";
import { useBudgetsService } from "../../functionality/hooks/budgets-service.hook";
import { usePosPreSapienciaService } from "../../functionality/hooks/pospre-sapiencia-service.hook";
import { useFundsService } from "../../functionality/hooks/funds-service.hook";
import { useBudgetRoutesService } from "./budget-routes-service.hook";
import { useAdditionsTransfersService } from "../../managementCenter/hook/additions-transfers-service.hook";

export function useBudgetRoutesCrudData(id: string) {
    const resolver = useYupValidationResolver(budgetRoutesCrudValidator);
    const { getAllProjectsVinculations } = useProjectsLinkService();
    const { GetProjectsList } = useAdditionsTransfersService()
    const { GetAllFunctionalAreas } = useFunctionalAreaService();
    const { getAllBudgets } = useBudgetsService();
    const { GetAllPosPreSapiencia } = usePosPreSapienciaService();
    const { getAllFunds } = useFundsService();
    const { CreateBudgetRoutes, GetBudgetRoutes, UpdateBudgetRoutes } = useBudgetRoutesService();
    const { authorization, setMessage } = useContext(AppContext);
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue: setValueRegister,
        control: controlRegister,
        watch
    } = useForm<IBudgetsRoutesCrudForm>({ resolver });
    const navigate = useNavigate();

    const [projectsData, setProjectsData] = useState<IDropdownProps[]>([]);
    const [budgetData, setBudgetData] = useState<IDropdownProps[]>([]);
    const [pospreSapienciaData, setPospreSapienciaData] = useState<IDropdownProps[]>([]);
    const [fundsData, setFundsData] = useState<IDropdownProps[]>([]);
    const [projectsVinculateData, setProjectsVinculateData] = useState<IProjectsVinculation[]>(null);

    const budgetSelected = watch("idBudget");
    const projectVinculationSelected = watch("idProjectVinculation");

    async function loadInitList(): Promise<void> {
        let projectsVinculate: IProjectsVinculation[];
        const response = await getAllProjectsVinculations();
        if (response.operation.code === EResponseCodes.OK) {
            projectsVinculate = response.data;
        }
        const response2 = await GetProjectsList({ page: "1", perPage: "1" });
        if (response2.operation.code === EResponseCodes.OK) {
            const arrayProjects: IDropdownProps[] = projectsVinculate.map((projectVinculate) => {
                const project = response2.data.array.find((data) => data.projectId === projectVinculate.projectId );
                return { name: `${project?.id} - ${project?.conceptProject ? project.conceptProject : ''}`, value: projectVinculate.id }
            });

            setProjectsData(arrayProjects);
        }
        const response3 = await getAllBudgets();
        if (response3.operation.code === EResponseCodes.OK) {
            const arrayBudgets: IDropdownProps[] = response3.data.map((budget) => {
                return { name: budget.number.toString(), value: budget.id };
            });
            setBudgetData(arrayBudgets);
        }
        const response4 = await getAllFunds();
        if (response4.operation.code === EResponseCodes.OK) {
            const arrayFunds: IDropdownProps[] = response4.data.map((fund) => {
                return { name: fund.number.toString(), value: fund.id };
            });
            setFundsData(arrayFunds);
        }
        setProjectsVinculateData(projectsVinculate)
    }

    useEffect(() => {
        loadInitList().then(() => {
            if (Number(id)) {
                GetBudgetRoutes(Number(id)).then(response => {
                    if (response.operation.code === EResponseCodes.OK) {
                        setValueRegister('div', response.data.div);
                        setValueRegister('functionalArea', response.data.div);
                        setValueRegister('idBudget', response.data.idBudget);
                        setValueRegister('idFund', response.data.idFund);
                        setValueRegister('idPospreSapiencia', response.data.idPospreSapiencia);
                        setValueRegister('idProjectVinculation', response.data.idProjectVinculation);
                        setValueRegister('managementCenter', response.data.managementCenter);
                    }
                })
            }
        });
    }, [id]);

    useEffect(() => {
        if (budgetSelected) {
            GetAllPosPreSapiencia().then(response => {
                if (response.operation.code === EResponseCodes.OK) {
                    const arrayPosPreSapiencia: IDropdownProps[] = response.data.filter((posPreSapiencia) => posPreSapiencia.budgetId === budgetSelected).map((posPreSapiencia) => {
                        return { name: posPreSapiencia.number.toString(), value: posPreSapiencia.id };
                    });
                    setPospreSapienciaData(arrayPosPreSapiencia);
                }
            })
        } else {
            setPospreSapienciaData([]);
        }
    }, [budgetSelected])

    useEffect(() => {
        if(projectVinculationSelected) {
            const projectVinculation = projectsVinculateData.find((projectV) => projectV.id === projectVinculationSelected);
            if(projectVinculation) {
                GetAllFunctionalAreas().then(response => {
                    if (response.operation.code === EResponseCodes.OK) {
                        const functionalArea = response.data.find((data) => data.id === projectVinculation.functionalAreaId);
                        if(functionalArea) {
                            setValueRegister("functionalArea", functionalArea.number);
                        } else {
                            setValueRegister("functionalArea", "");
                        }
                    }
                })
            } else {
                setValueRegister("functionalArea", "");
            }
        } else {
            setValueRegister("functionalArea", "");
        }
    }, [projectVinculationSelected]);

    const onSubmitNewBudgetRoute = handleSubmit(async (data: IBudgetsRoutesCrudForm) => {
        const insertData: IBudgetsRoutes = {
            div: data.div,
            idBudget: data.idBudget,
            idFund: data.idFund,
            idPospreSapiencia: data.idPospreSapiencia,
            idProjectVinculation: data.idProjectVinculation,
            managementCenter: data.managementCenter,
            userCreate: authorization.user.numberDocument
        };
        CreateBudgetRoutes(insertData).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Crear ruta presupuestal",
                    description: "Se ha creado la ruta presupuestal exitosamente",
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        onCancelNew();
                        setMessage({});
                    },
                    background: true
                });
            } else {
                setMessage({
                    title: "Hubo un problema...",
                    description: response.operation.message,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    background: true
                });
            }
        });
    });

    const onSubmitEditBudgetRoute = handleSubmit(async (data: IBudgetsRoutesCrudForm) => {
        const insertData: IBudgetsRoutes = {
            div: data.div,
            idBudget: data.idBudget,
            idFund: data.idFund,
            idPospreSapiencia: data.idPospreSapiencia,
            idProjectVinculation: data.idProjectVinculation,
            managementCenter: data.managementCenter,
            userModify: authorization.user.numberDocument
        };
        UpdateBudgetRoutes(Number(id), insertData).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Editar ruta presupuestal",
                    description: "Se ha editado la ruta presupuestal exitosamente",
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        onCancelEdit();
                        setMessage({});
                    },
                    background: true
                });
            } else {
                setMessage({
                    title: "Hubo un problema...",
                    description: response.operation.message,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    background: true
                });
            }
        });
    });

    const onCancelNew = () => {
        navigate("./../");
    };

    const onCancelEdit = () => {
        navigate("./../../");
    };

    const confirmClose = (callback) => {
        setMessage({
            title: "Cancelar",
            description: "¿Estas segur@ de cancelar la información en el sistema?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                callback();
                setMessage({});
            },
            background: true
        });
    }

    return { register, errors, controlRegister, onSubmitNewBudgetRoute, onSubmitEditBudgetRoute, onCancelNew, onCancelEdit, confirmClose, projectsData, budgetData, pospreSapienciaData, fundsData };
}