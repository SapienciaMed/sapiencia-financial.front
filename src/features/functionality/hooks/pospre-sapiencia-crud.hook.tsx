import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { pospreSapienciaCrudValidator } from "../../../common/schemas";
import { useContext, useEffect } from "react";
import { usePosPreSapienciaService } from "./pospre-sapiencia-service.hook";
import { useBudgetsService } from "./budgets-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { AppContext } from "../../../common/contexts/app.context";
import { IPosPreSapiencia } from "../interfaces/PosPreSapiencia";

interface IPosPreSapienciaCrudForm {
    number: string;
    ejercise: number;
    description: string;
    consecutive: number;
    assignedTo: string;
}

export function usePosPreSapienciaCrudData(pospre: string, pospreSapiencia: string) {
    const resolver = useYupValidationResolver(pospreSapienciaCrudValidator);
    const { GetPosPreSapiencia, CreatePosPreSapiencia, UpdatePosPreSapiencia } = usePosPreSapienciaService();
    const { GetBudgets } = useBudgetsService();
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue: setValueRegister,
    } = useForm<IPosPreSapienciaCrudForm>({ resolver });
    const navigate = useNavigate();
    const { setMessage, authorization } = useContext(AppContext);

    useEffect(() => {
        GetBudgets(Number(pospre)).then(response => {
            if(response.operation.code === EResponseCodes.OK) {
                setValueRegister("assignedTo", response.data.number.toString())
            } else {
                navigate("./../");
            }
        });
    }, [])

    useEffect(() => {
        if(!pospreSapiencia) return;
        GetPosPreSapiencia(Number(pospreSapiencia)).then(response => {
            if(response.operation.code === EResponseCodes.OK) {
                setValueRegister("number", response.data.number);
                setValueRegister("ejercise", response.data.ejercise);
                setValueRegister("description", response.data.description);
                setValueRegister("consecutive", response.data.consecutive);
            } else {
                navigate("./../");
            }
        });
    }, [pospreSapiencia])

    const onSubmitNewPosPreSapiencia = handleSubmit(async (data: IPosPreSapienciaCrudForm) => {
        const insertData: IPosPreSapiencia = {
            number: data.number,
            budgetId: Number(pospre),
            ejercise: data.ejercise,
            description: data.description,
            consecutive: data.consecutive,
            assignedTo: data.assignedTo,
            userCreate: authorization.user.numberDocument,
        };
        CreatePosPreSapiencia(insertData).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Crear pospre sapiencia",
                    description: "Se ha creado el pospre sapiencia exitosamente",
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
    
    const onSubmitEditPosPreSapiencia = handleSubmit(async (data: IPosPreSapienciaCrudForm) => {
        const insertData: IPosPreSapiencia = {
            number: data.number,
            budgetId: Number(pospre),
            ejercise: data.ejercise,
            description: data.description,
            consecutive: data.consecutive,
            assignedTo: data.assignedTo,
            userModify: authorization.user.numberDocument,
        };
        UpdatePosPreSapiencia(Number(pospreSapiencia),insertData).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Editar pospre sapiencia",
                    description: "Se ha editado el pospre sapiencia exitosamente",
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

    return { register, errors, onSubmitNewPosPreSapiencia, onSubmitEditPosPreSapiencia, onCancelNew, onCancelEdit, confirmClose };
}