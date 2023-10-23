import { Controller } from "react-hook-form";
import { DatePickerComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";

interface Props{
    isDisabled:boolean;
}

function CdpHeadFormComponent({isDisabled}:Props) {

    const { control, register, errors } = useCdpCrud();

    return (
        <>
            <section className='grid-form-3-container-area mt-5px'>
                <Controller
                    control={control}
                    name={"dateOfCdp"}
                    defaultValue={String(new Date().getFullYear())}
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
                                onChange={field.onChange}
                                errors={errors}
                                disabled={true}
                            />
                        );
                    }}
                />


                <Controller
                    control={control}
                    name={"consecutiveSap"}
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
                                disabled={true}
                            />
                        );
                    }}
                />

                <Controller
                    control={control}
                    name={"consecutiveAurora"}
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
                                disabled={true}
                            />
                        );
                    }}
                />
            </section>
            <section className='grid-form-3-container-area mt-5px'>
                <DatePickerComponent
                    idInput="initialDate"
                    control={control}
                    label={"Fecha documento"}
                    errors={errors}
                    classNameLabel="text-black biggest weight-500"
                    className="dataPicker-basic medium"
                    placeholder="DD/MM/YYYY"
                    dateFormat="dd/mm/yy"
                    disabled={true}
                />


                <Controller
                    control={control}
                    name={"consecutiveSap"}
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
                                disabled={true}
                            />
                        );
                    }}
                />


            </section>

            <TextAreaComponent
                id={'field.name'}
                idInput={'field.name'}
                //value={`${'field.value'}`}
                className="text-area-basic"
                register={register}
                label="Objeto contractual"
                classNameLabel="text-black biggest"
                direction={EDirection.column}
                errors={errors}
                rows={2}
                //onChange={field.onChange}
            />


        </>
    )



}

export default CdpHeadFormComponent;