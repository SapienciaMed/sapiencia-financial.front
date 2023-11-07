import React from "react";
import { Controller } from "react-hook-form";
import { InputComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";

interface Props {
    isDisabled: boolean;
    cdpId?: string;
}

//TODO: ELIMINAR COMPONENTE

function CdpHeadMgaAssocComponent(props: Props) {
    const { isDisabled, cdpId } = props;
    const { control, register, errors } = useCdpCrud(cdpId);

    return (
        <>
            <section className='grid-form-3-container-area mt-5px'>
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
                                label="Proyecto"
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
                                label="Fondo Sapiencia"
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
                                label="Pospre Sapiensia"
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
            <section className='grid-form-3-container-area mt-5px'>
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
                                label="Pospre Origen"
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
                    name={"sapConsecutive"}
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                className="input-basic medium"
                                typeInput="number"
                                register={register}
                                label="Valor final"
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

export default React.memo(CdpHeadMgaAssocComponent);