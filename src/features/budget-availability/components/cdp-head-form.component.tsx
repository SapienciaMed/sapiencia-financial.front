import React from "react";
import { Controller } from "react-hook-form";
import { DatePickerComponent, InputComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";

interface Props {
    isDisabled: boolean;
    cdpId?: string;
}

function CdpHeadFormComponent(props: Props) {
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
                                label="Vigencia"
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
                                label="Consecutivo CDP SAP"
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
                                label="Consecutivo CDP Aurora"
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
                <DatePickerComponent
                    idInput="date"
                    control={control}
                    label={"Fecha documento"}
                    errors={errors}
                    classNameLabel="text-black biggest weight-500"
                    className="dataPicker-basic medium"
                    placeholder="DD/MM/YYYY"
                    dateFormat="dd/mm/yy"
                    disabled={isDisabled}
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
                                label="RP asociados"
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

export default React.memo(CdpHeadFormComponent);