import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { functionalArea } from "../../../common/schemas";
import { useForm } from "react-hook-form";
import { IFunctionalAreaCrud } from "../interfaces/Functional-Area";
import { AppContext } from "../../../common/contexts/app.context";
import { useContext, useEffect } from "react";
import { useFunctionalAreaService } from "./functional-area-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";

export function useFunctionalAreaCrudData(id: string) {
    const { GetFunctionalArea } = useFunctionalAreaService();
    const resolver = useYupValidationResolver(functionalArea);
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue: setValueRegister,
    } = useForm<IFunctionalAreaCrud>({ resolver });
    const navigate = useNavigate();
    const { setMessage } = useContext(AppContext);

    useEffect(() => {
        if(!id) return;
        GetFunctionalArea(Number(id)).then(response => {
            if(response.operation.code === EResponseCodes.OK) {
                setValueRegister("number", response.data.number);
                setValueRegister("denomination", response.data.denomination);
                setValueRegister("description", response.data.description);
            }
        })
    }, [id])

    const onCancelNew = () => {
        navigate("./../");
    };

    const onCancelEdit = () => {
        navigate("./../../");
    };

    const confirmClose = (callback) =>{
        setMessage({
            title: "Cancelar área funcional",
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

    
    return { register, errors, confirmClose, onCancelNew, onCancelEdit };
}