import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { pospreSapienciaCrudValidator } from "../../../common/schemas";
import { useContext, useEffect } from "react";
import { usePosPreSapienciaService } from "./pospre-sapiencia-service.hook";
import { useBudgetsService } from "../budgetPosition/hooks/budgets-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { AppContext } from "../../../common/contexts/app.context";
import { IPosPreSapiencia } from "../interfaces/PosPreSapiencia";

interface IPosPreSapienciaCrudForm {
    number: string;
    ejercise: string;
    description: string;
    consecutive: number;
    assignedTo: string;
}

export function usePosPreSapienciaCrudData(pospre: string, pospreSapiencia: string, location: "origen" | "pospre") {
    const resolver = useYupValidationResolver(pospreSapienciaCrudValidator);
    const { GetPosPreSapiencia, CreatePosPreSapiencia, UpdatePosPreSapiencia } = usePosPreSapienciaService();
    const { GetBudgets } = useBudgetsService();
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue: setValueRegister,
        control
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
        
        const dataEditPospre = {
            page: "1",
            perPage: "10",
            budgetIdSapi: pospreSapiencia
        }
        
        GetPosPreSapiencia(dataEditPospre).then(response => {
            if(response.operation.code === EResponseCodes.OK) {
                setValueRegister("ejercise", String(response.data.array[0].ejercise));
                setValueRegister("description", response.data.array[0].description);
                setValueRegister("consecutive", response.data.array[0].consecutive);
            } else {
                navigate("./../../");
            }
        });

    }, [pospreSapiencia])


    const onSubmitNewPosPreSapiencia = handleSubmit(async (data: IPosPreSapienciaCrudForm) => {
 
        const insertData: IPosPreSapiencia = {
            number: data.assignedTo + data.consecutive,
            budgetId: Number(pospre),
            ejercise: parseInt(data.ejercise),
            description: data.description,
            consecutive: data.consecutive,
            assignedTo: data.assignedTo,
            userCreate: authorization.user.numberDocument,
            userModify: authorization.user.userModify,
            dateModify: new Date(authorization.user.dateModify).toISOString().split('T')[0],
            dateCreate: new Date(authorization.user.dateCreate).toISOString().split('T')[0]
        };

        setMessage({
            title: "Guardar",
            description: "¿Estas segur@ de guardar la información en el sistema?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
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
                            title: "Validacion de datos",
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
            },
            onCancel: () => {
              setMessage({});
            },
            background: true,
          });
        
    });
    
    const onSubmitEditPosPreSapiencia = handleSubmit(async (data: IPosPreSapienciaCrudForm) => {
        const insertData: IPosPreSapiencia = {
            number: data.assignedTo + data.consecutive,
            budgetId: Number(pospre),
            ejercise: parseInt(data.ejercise),
            description: data.description,
            consecutive: data.consecutive,
            assignedTo: data.assignedTo,
            userModify: authorization.user.userModify,
            dateModify: new Date(authorization.user.dateModify).toISOString().split('T')[0],
            dateCreate: new Date(authorization.user.dateCreate).toISOString().split('T')[0]
        };

        setMessage({
            title: "Guardar",
            description: "¿Estas segur@ de guardar la información en el sistema?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
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
                            title: "Validación de datos",
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
            },
            onCancel: () => {
              setMessage({});
            },
            background: true,
          });
        
    });

    const onCancelNew = () => {
        navigate("./../");
    };

    const onCancelEdit = () => { 
        location == 'pospre' ? navigate("./../../") : navigate("./../../../")
    };

    const confirmClose = (callback) =>{
        setMessage({
            title: "Cancelar pospre sapiencia",
            description: "¿Segur@ que desea cancelar la operación?",
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

    async function validatorNumber(e) {
        if (parseInt(e.target.value) < 0) {
            return e.target.value == '';
        }     
    }

    return { register, errors, control, onSubmitNewPosPreSapiencia, onSubmitEditPosPreSapiencia, onCancelNew, onCancelEdit, 
        confirmClose, validatorNumber };
}