import { Controller } from "react-hook-form";
import { DatePickerComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";
import { IBudgetAvalaibility } from "../interfaces/budgetAvailabilityInterfaces";

interface Props{
    isDisabled:boolean;
    detail:IBudgetAvalaibility;
}

function CdpHeadFormComponent(props:Props) {
    const { detail, isDisabled } = props;
    const { control, register, errors } = useCdpCrud();

    return (
        <>
            <section className='grid-form-3-container-area mt-5px'>
                <Controller
                    control={control}
                    name={"exercise"}
                    defaultValue={String(new Date().getFullYear())}
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                value={''}
                                className="input-basic medium"
                                typeInput="number"
                                register={register}
                                label="Vigencia"
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

            <TextAreaComponent
                id={'contractObject'}
                idInput={'contractObject'}
                className="text-area-basic"
                register={register}
                label="Objeto contractual"
                classNameLabel="text-black biggest"
                direction={EDirection.column}
                errors={errors}
                rows={2}
                disabled={isDisabled}
            />


        </>
    )



}

export default CdpHeadFormComponent;