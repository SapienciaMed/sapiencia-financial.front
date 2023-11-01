import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useForm, Controller } from 'react-hook-form';
import { FormComponent, InputComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";

function RpPages() {

    const { register, handleSubmit, formState: { errors }, control } = useForm();
    
    return (
        <div className='main-page'>
             <div className='card-table gap-0'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Consultar RP</div>
                    <div
                        className="title-button font-big"
                        onClick={() => { }}
                    >
                        Crear RP <AiOutlinePlusCircle />
                    </div>

                </section>

                <section className="card-user">
                    <FormComponent action={handleSubmit}>
                        <div className="funcionality-filters-container">
                            <Controller
                                control={control}
                                name={"SapPrConsecutive"}
                                defaultValue='' 
                                render={({ field }) => {
                                    return(
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            className="input-basic color-default-value"
                                            typeInput="number"
                                            register={register}
                                            label="Consecutivo RP SAP"
                                            classNameLabel="text-black weight-500 biggest"
                                            direction={EDirection.column}
                                            onChange={(value) => {field.onChange(value) }}
                                            errors={errors}

                                    />
                                    )
                                }}
                            />
                             <Controller
                                control={control}
                                name={"RPAuroraConsecutive"}
                                defaultValue=''
                                render={({ field }) => {
                                    return(
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            className="input-basic"
                                            typeInput="number"
                                            register={register}
                                            label="Consecutivo RP Aurora"
                                            classNameLabel="text-black weight-500 biggest"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={(value) => {field.onChange(value)}}
                                        />
                                    )
                                }}
                            />
                             
                            <Controller
                                control={control}
                                name={"VendorAndTaxID"}
                                defaultValue=''
                                render={({ field }) => {
                                    return(
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            className="input-basic"
                                            typeInput="number"
                                            register={register}
                                            label="Acreedor e ID fiscal"
                                            classNameLabel="text-black weight-500 biggest"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={(value) => {field.onChange(value)}}
                                        />
                                    )
                                }}
                            />
                            <Controller
                                control={control}
                                name={"IdentificationContractor"}
                                defaultValue=''
                                render={({ field }) => {
                                    return(
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            className="input-basic"
                                            typeInput="number"
                                            register={register}
                                            label="Identificación - Contratista"
                                            classNameLabel="text-black weight-500 biggest"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={(value) => {field.onChange(value)}}
                                        />
                                    )
                                }}
                            />
                        </div>
                    </FormComponent>
                </section>
             </div>
        </div>
    )
}

export default React.memo(RpPages);