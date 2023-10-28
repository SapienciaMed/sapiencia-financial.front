import React from "react";
import { Controller } from "react-hook-form";
import { InputComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";

interface Props {
    isDisabled: boolean;
    cdpId?: string;
}

function CdpMgaAssocFormComponent(props: Props) {
    const { isDisabled, cdpId } = props;
    const { control, register, errors } = useCdpCrud(cdpId);

    return (
        <>
            <section className='grid-form-2-container-reverse grid-column-e-proj-operation mt-5px'>
            {/* <section className='grid-form-4-container-area mt-5px'> */}
                <Controller
                    control={control}
                    name={"exercise"}
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                className="input-basic medium"
                                typeInput="number"
                                register={register}
                                label="Producto MGA"
                                classNameLabel="text-black weight-500 biggest"
                                direction={EDirection.column}
                                fieldArray={false}
                                //onChange={field.onChange}
                                errors={errors}
                                disabled={isDisabled}
                            />
                        );
                    }}
                />


                <Controller
                    control={control}
                    name={"sapConsecutive"}
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                className="input-basic medium"
                                typeInput="number"
                                register={register}
                                label="Actividad MGA"
                                classNameLabel="text-black weight-500 biggest"
                                direction={EDirection.column}
                                onChange={field.onChange}
                                errors={errors}
                                disabled={isDisabled}
                            />
                        );
                    }}
                />

                <Controller
                    control={control}
                    name={"consecutive"}
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                className="input-basic medium"
                                typeInput="number"
                                register={register}
                                label="Actividad detallada MGA"
                                classNameLabel="text-black weight-500 biggest"
                                direction={EDirection.column}
                                onChange={field.onChange}
                                errors={errors}
                                disabled={isDisabled}
                            />
                        );
                    }}
                />
            
            <Controller
                    control={control}
                    name={"consecutive"}
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                className="input-basic medium"
                                typeInput="number"
                                register={register}
                                label="CPC"
                                classNameLabel="text-black weight-500 biggest"
                                direction={EDirection.column}
                                onChange={field.onChange}
                                errors={errors}
                                disabled={isDisabled}
                            />
                        );
                    }}
                />   
            </section>
            
        </>
    )
}

export default React.memo(CdpMgaAssocFormComponent);