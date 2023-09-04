import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsCrudValidator } from "../../../common/schemas";
import { useContext, useEffect, useState } from "react";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IEntities } from "../interfaces/Entities";
import { useEntitiesService } from "./entities-service.hook";
import { useFundsService } from "./funds-service.hook";
import { IFunds } from "../interfaces/Funds";
import { AppContext } from "../../../common/contexts/app.context";

interface IFundsCrudForm {
    entity: number;
    number: string;
    denomination: string;
    description: string;
    dateInitial: Date;
    dateTo: Date;
}

export function useFundsCrudData(fundId: string) {
    const [fundData, setFundData] = useState<IFunds>(null);
    const [entitiesData, setEntitiesData] = useState<IDropdownProps[]>(null);

    const resolver = useYupValidationResolver(fundsCrudValidator);
    const { GetEntities } = useEntitiesService();
    const { CreateFund, GetFund, UpdateFund } = useFundsService();
    const { authorization, setMessage } = useContext(AppContext);
    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        reset,
        control: controlRegister,
        watch
    } = useForm<IFundsCrudForm>({ resolver });
    const navigate = useNavigate();

    const [startDate, endDate] = watch(["dateInitial", 'dateTo']);
    
    useEffect(() => {
      if (startDate && endDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        if (startDateObj > endDateObj) {
          reset({ ...watch(), dateTo: null });
        } 
      }
      console.log("valida fecha");
      
    },[startDate])

    async function loadInitList(): Promise<void> {
        const response = await GetEntities();
        if (response.operation.code === EResponseCodes.OK) {
            const entities: IEntities[] = response.data;
            const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                return { name: entity.name, value: entity.id };
            });
            setEntitiesData(arrayEntities);
        }
    }

    async function validatorNumber(e) {
        if (parseInt(e.target.value) < 0) {
            return e.target.value = '';
        }
    }

    useEffect(() => {
        loadInitList().then(() => {
            if (fundId) {
                GetFund(parseInt(fundId)).then(response => {
                    if (response.operation.code === EResponseCodes.OK) {
                        setFundData(response.data);
                    };
                });
            }
        })
    }, [fundId]);

    useEffect(() => {
        if (!fundData) return;
        setValueRegister("number", fundData.number);
        setValueRegister("entity", fundData.entityId);
        setValueRegister("denomination", fundData.denomination);
        setValueRegister("description", fundData.description);
        setValueRegister("dateInitial", new Date(fundData.dateFrom));
        setValueRegister("dateTo", new Date(fundData.dateTo));
    }, [fundData])

    const onSubmitNewFund = handleSubmit(async (data: IFundsCrudForm) => {
        const insertData: IFunds = {
            entityId: data.entity,
            number: data.number,
            denomination: data.denomination,
            description: data.description,
            userCreate: authorization.user.numberDocument,
            dateFrom: data.dateInitial,
            dateTo: data.dateTo
        }
        setMessage({
          title: "Guardar",
          description:
            "¿Estas segur@ de guardar la información en el sistema?",
          show: true,
          OkTitle: "Aceptar",
          cancelTitle: "Cancelar",
          onOk: () => {
                    CreateFund(insertData).then((response) => {
                      if (response.operation.code === EResponseCodes.OK) {
                        setMessage({
                          title: "Crear fondos",
                          description: "Se ha creado el fondo exitosamente",
                          show: true,
                          OkTitle: "Aceptar",
                          onOk: () => {
                            onCancelNew();
                            setMessage({});
                          },
                          background: true,
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
                          background: true,
                        });
                      }
                    });
            },
            onCancel: () => {
                setMessage({});
                onCancelNew();
            },
          background: true,
        });

    });

    const onSubmitEditFund = handleSubmit(async (data: IFundsCrudForm) => {
      console.log("entro al editar");
      
        const insertData: IFunds = {
            entityId: data.entity,
            number: data.number,
            denomination: data.denomination,
            description: data.description,
            userCreate: authorization.user.numberDocument,
            dateFrom: data.dateInitial,
            dateTo: data.dateTo
        }
        setMessage({
          title: "Editar fondos",
          description: "¿Estas segur@ de guardar la información en el sistema?",
          show: true,
          OkTitle: "Aceptar",
          cancelTitle: "Cancelar",
          onOk: () => {
            UpdateFund(parseInt(fundId), insertData).then((response) => {
              if (response.operation.code === EResponseCodes.OK) {
                setMessage({
                  title: "Editar fondos",
                  description: "Se ha editado el fondo exitosamente",
                  show: true,
                  OkTitle: "Aceptar",
                  onOk: () => {
                    onCancelEdit();
                    setMessage({});
                  },
                  background: true,
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
                  background: true,
                });
              }
            });
          },
          onCancel: () => {
            setMessage({});
            onCancelNew();
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
          title: "Cancelar",
          description:
            "¿Estas segur@ de cancelar la información en el sistema?",
          show: true,
          OkTitle: "Aceptar",
          cancelTitle: "Cancelar",
          onOk: () => {
            callback();
            setMessage({});
          },
          background: true,
        });
    }

    return {
      register,
      errors,
      reset,
      controlRegister,
      entitiesData,
      startDate,
      onSubmitNewFund,
      onSubmitEditFund,
      onCancelNew,
      onCancelEdit,
      confirmClose,
      validatorNumber,
      isValid,
    };
}