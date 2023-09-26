import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../../common/hooks/form-validator.hook";
import { useContext, useEffect, useState } from "react";
import { IDropdownProps } from "../../../../common/interfaces/select.interface";
import { EResponseCodes } from "../../../../common/constants/api.enum";
import { IEntities } from "../../interfaces/Entities";
import { useEntitiesService } from "../../hooks/entities-service.hook";
import { useBudgetsService } from "./budgets-service.hook";
import { IBudgets } from "../../interfaces/Budgets";
import { AppContext } from "../../../../common/contexts/app.context";
import { budgetsCrudValidator } from "../../../../common/schemas/budgets-schemas";
import { IMessage } from "../../../../common/interfaces/global.interface";

interface IBudgetsCrudForm {
    number: string;
    ejercise: string;
    entity: number;
    denomination: string;
    description: string;
}

export function useBudgetsCrudData(budgetsId: string, vinculateActivities?: () => Promise<void> ) {
    const [budgetsData, setBudgetsData] = useState<IBudgets>(null);
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
        control: controlRegister
    } = useForm<IBudgetsCrudForm>({ resolver });
    const navigate = useNavigate();

    useEffect(() => {
        GetEntities().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.name, value: entity.id };
                });
                setEntitiesData(arrayEntities);
            }else {
                setMessage({
                    title: "Validacion de datos",
                    description: response.operation.message,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                        // navigate("./../../");
                    },
                    onClose: () => {
                        setMessage({});
                        // navigate("./../../");
                    },
                    background: true
                });
            }
        }).catch((error) => { 
            console.log(error)
        });
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
        setValueRegister("number", String(budgetsData.number));
        setValueRegister("entity", budgetsData.entityId);
        setValueRegister("denomination", budgetsData.denomination);
        setValueRegister("description", budgetsData.description);
        setValueRegister("ejercise", String(budgetsData.ejercise));
    }, [budgetsData])

    const onSubmitNewBudgets = handleSubmit(async (data: IBudgetsCrudForm) => {
        const insertData: IBudgets = {
            entityId: data.entity,
            number: data.number,
            denomination: data.denomination,
            description: data.description,
            userCreate: authorization.user.numberDocument,
            ejercise: parseInt(data.ejercise),
        }



        showModal({
            //type?: EResponseCodes;
            title: "Crear posición presupuestal",
            description: "¿Estás segur@ de crear la posición presupuestal?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
              setMessage({})
              messageConfirmSave(insertData)
            },
            onCancel: () => {
              setMessage({})
              onCancelNew()
            },
            // onClickOutClose?: boolean;
            onClose: () => {
              setMessage({})
              onCancelNew()
            },
            background: true
          })

        
    });

    
    const showModal = (values: IMessage) => {
        setMessage({
          title: values.title,
          description: values.description,
          show: true,
          OkTitle: values.OkTitle,
          onOk: values.onOk || (() => setMessage({})),
          cancelTitle: values.cancelTitle
    
        });
      };
    

    const messageConfirmSave = async (insertData:any) => {
        CreateBudgets(insertData).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Pospre creado",
                    description: "¡Se creó Posición presupuestal exitosamente!",
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
      }



    const onSubmitEditBudgets = handleSubmit(async (data: IBudgetsCrudForm) => {
        const insertData: IBudgets = {
            entityId: data.entity,
            number: data.number,
            denomination: data.denomination,
            description: data.description,
            userCreate: authorization.user.numberDocument,
            ejercise: parseInt(data.ejercise),
        }
        
        setMessage({
            title: "Editar posición presupuestal",
            description: "¿Estás segur@ de editar la posición presupuestal?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                vinculateActivities &&  vinculateActivities();
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

    const onCancelNew = () => {
        navigate("./../");
    };

    const onCancelEdit = () => {
        navigate("./../../");
    };

    const confirmClose = (callback) =>{
        setMessage({
            title: "Cancelar posición presupuestal",
            description: "¿Estás segur@ que desea cancelar la posición presupuestal?",
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

    return { register, errors, entitiesData, onSubmitNewBudgets, onSubmitEditBudgets, onCancelNew, onCancelEdit, confirmClose, controlRegister };
}