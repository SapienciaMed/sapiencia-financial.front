import React from 'react'
import { ButtonComponent, FormComponent, InputComponent, TextAreaComponent } from '../../../common/components/Form';
import { BiPlusCircle } from 'react-icons/bi';
import { useTransferAreaCrudPage } from '../hook/transfer-area-crud.hook';
import { Controller } from 'react-hook-form';
import { EDirection } from '../../../common/constants/input.enum';

interface IAppProps {
    actionForm: "new" | "edit";
  }

function TransferAreaCrudPage({ actionForm }: IAppProps) {
    const {control, errors, navigate, onSubmit, register, isBtnDisable} = useTransferAreaCrudPage()

    return (
        <div className="crud-page full-height">

            <section className="main-page full-height">
                <div className="card-table">
                    <p className="text-black extra-large">
                        {actionForm === "new" ? "Crear Traslado" : "Editar Traslado"}
                    </p>

                    <section className="card-user">
                        <FormComponent action={onSubmit} id="transfer-form" className="funds-form">
                            <div className="title-area"> 
                                <label className="text-black biggest bold">
                                    Datos básicos
                                </label>
                                <div className="title-button text-three large" onClick={() => navigate('./anadir-fondos')}> Añadir valores <BiPlusCircle/> </div>
                            </div>
                            <div className="funcionality-filters-container">
                                <Controller
                                    control={control}
                                    name={"adminDistrict"}
                                    defaultValue=""
                                    render={({ field }) => {
                                        return (
                                            <InputComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                className="input-basic"
                                                typeInput="text"
                                                register={register}
                                                label="Acto administrativo distrito"
                                                classNameLabel="text-black biggest bold text-required"
                                                direction={EDirection.column}
                                                errors={errors}
                                                onChange={field.onChange}
                                            /> 
                                        )
                                    }}
                                />
                                <Controller
                                    control={control}
                                    name={"adminSapiencia"}
                                    defaultValue=""
                                    render={({ field }) => {
                                        return (
                                            <InputComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                className="input-basic"
                                                typeInput="text"
                                                register={register}
                                                label="Acto administrativo sapiencia"
                                                classNameLabel="text-black biggest bold text-required"
                                                direction={EDirection.column}
                                                errors={errors}
                                                onChange={field.onChange}
                                            /> 
                                        )
                                    }}
                                />
                            </div>
                            <Controller
                                control={control}
                                name={"remarks"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <TextAreaComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            className="text-area-basic"
                                            register={register}
                                            label="Observacion"
                                            classNameLabel="text-black biggest bold text-required"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={field.onChange}
                                        /> 
                                    )
                                }}
                            />
                        </FormComponent>
                    </section>

                    <section className="mobile-actions-2">
                        <label className="text-black biggest"> Total Traslado: $  </label>
                        <div className='content-btn'>
                            <span
                                className="bold text-center button"
                                onClick={() => {}}
                            >
                                Cancelar
                            </span>
                            <ButtonComponent
                                className="button-main huge hover-three"
                                value="Trasladar"
                                type="submit"
                                form="transfer-form"
                                disabled={!isBtnDisable}
                            />
                        </div>
                    </section>
                </div>
            </section>

            <section className="container-button-bot justify-content-sp">
                <label className="text-black biggest"> Total Traslado: $   </label>
                <div className="buttons-bot">
                    <span
                        className="bold text-center button"
                        onClick={() => {}}
                    >
                        Cancelar
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Trasladar"
                        type="submit"
                        form="transfer-form"
                        disabled={!isBtnDisable}
                    />
                </div>
            </section>
            
        </div>
    )
}

export default React.memo(TransferAreaCrudPage);
