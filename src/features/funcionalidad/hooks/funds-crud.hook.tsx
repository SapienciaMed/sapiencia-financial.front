import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsCrudValidator } from "../../../common/schemas";
import { useEffect, useState } from "react";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IEntities } from "../interfaces/Entities";
import { useEntitiesService } from "./entities-service.hook";

interface IFundsCrudForm {
    entity: number;
    number: number;
    denomination: string;
    description: string;
    dateFrom: DateTime;
    dateTo: DateTime;
}

export function useFundsCrudData() {
    const { id: fundId } = useParams();
    const resolver = useYupValidationResolver(fundsCrudValidator);
    const { GetEntities } = useEntitiesService();
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue: setValueRegister,
        reset,
        control: controlRegister
    } = useForm<IFundsCrudForm>({ resolver });
    
    const [entitySelected, setEntitySelected] = useState(null);
    const [entitiesData, setEntitiesData] = useState<IDropdownProps[]>(null);

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

    return { register, errors, reset, setValueRegister, controlRegister, entitiesData, entitySelected, setEntitySelected };
}