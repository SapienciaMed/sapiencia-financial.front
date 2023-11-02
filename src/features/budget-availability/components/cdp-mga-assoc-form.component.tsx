import React from "react";
import { Controller, useForm } from 'react-hook-form';
import { InputComponent, SelectComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";

interface Props {
    isDisabled: boolean;
    cdpId?: string;
}

function CdpMgaAssocFormComponent(props: Props) {
    const { isDisabled, cdpId } = props;
    //TODO: Crear un estado dependiente
    // const { control, register, errors } = useCdpCrud(cdpId);

    const {
        register,
        formState: { errors },
        control,
    } = useForm()

    return (
        <div className="funcionality-filters-container">
           <SelectComponent
                idInput='DetailedActivityMGA'
                control={control}
                label='Actividad detallada MGA'
                className="select-basic big"
                classNameLabel="text-black weight-500 biggest text-required"
                placeholder={'Seleccionar'}
                fieldArray
                data={[]}
            /> 

            <SelectComponent
                idInput='cpc'
                control={control}
                label='CPC'
                className="select-basic big"
                classNameLabel="text-black weight-500 biggest text-required"
                placeholder={'Seleccionar'}
                fieldArray
                data={[]}
            />

            <Controller
                control={control}
                name={"percentageAffected"} 
                render={({ field }) => {
                    return (
                        <InputComponent
                            id={field.name}
                            idInput={field.name}
                            className="input-basic big"  
                            typeInput="number"
                            register={register}
                            label="Porcentaje de afectación"
                            classNameLabel="text-black weight-500 biggest text-required"
                            direction={EDirection.column}
                            errors={errors}
                        />
                    );
                }}
            /> 

        </div>
    )
}

export default React.memo(CdpMgaAssocFormComponent);