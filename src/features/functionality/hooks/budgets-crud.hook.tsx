import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { useContext, useEffect, useState } from "react";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IEntities } from "../interfaces/Entities";
import { useEntitiesService } from "./entities-service.hook";
import { useBudgetsService } from "./budgets-service.hook";
import { IBudgets } from "../interfaces/Budgets";
import { AppContext } from "../../../common/contexts/app.context";
import { budgetsCrudValidator } from "../../../common/schemas/budgets-schemas";

interface IBudgetsCrudForm {
    number:number;
    ejercise:number;
    entity: number;
    denomination: string;
    description: string;
}

export function useBudgetsCrudData(budgetsId: string,vinculateActivities?: () => Promise<void>,loadTableData?: (searchCriteria?: object) => void) {
    const [budgetsData, setBudgetsData] = useState<IBudgets>(null);
    const [entitySelected, setEntitySelected] = useState(null);
    const [entitiesData, setEntitiesData] = useState<IDropdownProps[]>(null);

    const resolver = useYupValidationResolver(budgetsCrudValidator);
    const { GetEntities } = useEntitiesService();
    const { CreateBudgets, GetBudgets, UpdateBudgets } = useBudgetsService();
    const { authorization, setMessage } = useContext(AppContext);
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue: setValueRegister,
        reset,
    } = useForm<IBudgetsCrudForm>({ resolver });
    const navigate = useNavigate();

    useEffect(() => {
        if(Number(budgetsId)) loadTableData({budgetId: Number(budgetsId),active:true});
    }, [budgetsId])

    useEffect(() => {
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

    useEffect(() => {
        if (budgetsId) {
            GetBudgets(parseInt(budgetsId)).then(response => {
                if (response.operation.code === EResponseCodes.OK) {
                    setBudgetsData(response.data);
                };
            });
        }
    }, [budgetsId]);

    useEffect(() => {
        if (!budgetsData) return;
        setValueRegister("number", budgetsData.number);
        setValueRegister("entity", budgetsData.entityId);
        setEntitySelected(budgetsData.entityId);
        setValueRegister("denomination", budgetsData.denomination);
        setValueRegister("description", budgetsData.description);
        setValueRegister("ejercise",budgetsData.ejercise);
    }, [budgetsData])

    const onSubmitNewBudgets = handleSubmit(async (data: IBudgetsCrudForm) => {
        const insertData: IBudgets = {
            entityId: data.entity,
            number: data.number,
            denomination: data.denomination,
            description: data.description,
            userCreate: authorization.user.numberDocument,
            ejercise: data.ejercise,
        }
        CreateBudgets(insertData).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Crear Pospre",
                    description: "Se ha creado el Pospre exitosamente",
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
        })
    });

    const onSubmitEditBudgets = handleSubmit(async (data: IBudgetsCrudForm) => {
        const insertData: IBudgets = {
            entityId: data.entity,
            number: data.number,
            denomination: data.denomination,
            description: data.description,
            userCreate: authorization.user.numberDocument,
            ejercise: data.ejercise,
        }
        vinculateActivities && await vinculateActivities();
        UpdateBudgets(parseInt(budgetsId), insertData).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Editar Pospre",
                    description: "Se ha editado el Pospre exitosamente",
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
        })
    });

    const onCancelNew = () => {
        navigate("./../");
    };

    const onCancelEdit = () => {
        navigate("./../../");
    };

    const confirmClose = (callback) =>{
        setMessage({
            title: "Cancelar Pospre",
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

    return { register, errors, reset, setValueRegister, entitiesData, entitySelected, setEntitySelected, onSubmitNewBudgets, onSubmitEditBudgets, onCancelNew, onCancelEdit, confirmClose };
}