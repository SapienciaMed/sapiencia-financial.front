import React, { useEffect, useState } from "react";
import { ButtonComponent, ButtonLoadingComponent, DatePickerComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { useNavigate } from "react-router";
import { useWidth } from "../../../common/hooks/use-width";
import { Controller } from "react-hook-form";
import { EDirection } from "../../../common/constants/input.enum";
import { useParams } from "react-router-dom";
import { useCreditorCrud } from "../hook/creditor-crud";


function CreditorCrudPage() {
    const { id } = useParams();
    const navigate = useNavigate()
    const { width } = useWidth()
    const [isAllowUpdateBtn, setIsAllowUpdateBtn] = useState(false)

    const {
        errors,
        register,
        control,
        setMessage,
        onSubmitCreditor,
        componentsData,
        dependeciesData,
        isAllowSave,
        documentTypeList
    } = useCreditorCrud(id);



    return (
        <div className='main-page'>
            <div className='card-table gap-0'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">
                        {
                            !id
                                ? 'Crear acreedor'
                                : 'Editar acreedor'
                        }
                    </div>
                </section>
                <FormComponent
                    action={onSubmitCreditor}
                    id="form-pac"
                    className="form-pac"
                >
                    <div className="card-user">
                        <section className="grid-form-3-container-area mt-5px">
                            <SelectComponent
                                idInput="typeDocument"
                                control={control}
                                label="Tipo de identificación"
                                className="select-basic medium"
                                classNameLabel={!id ? 'text-black big bold text-required': 'text-black big bold'}
                                placeholder={"Seleccionar"}
                                data={documentTypeList}
                                filter={true}
                                errors={errors}
                                direction={EDirection.column}
                                disabled={id ? true : false}
                            />


                            <Controller
                                control={control}
                                name={"document"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="text"
                                        register={register}
                                        label="Identificación"
                                        classNameLabel={!id ? 'text-black big bold text-required': 'text-black big bold'}
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => field.onChange(value)}
                                        disabled={id ? true : false}
                                    />
                                )} />

                            <Controller
                                control={control}
                                name={"taxIdentification"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="text"
                                        register={register}
                                        label="Identificación fiscal"
                                        classNameLabel="text-black big bold text-required"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => {field.onChange(value);setIsAllowUpdateBtn(true)}}
                                    />
                                )} />

                        </section>
                        <section>
                            <Controller
                                control={control}
                                name={"name"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="text"
                                        register={register}
                                        label="Razón social / Nombre"
                                        classNameLabel="text-black big bold text-required"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => {field.onChange(value);;setIsAllowUpdateBtn(true)}}
                                    />
                                )} />
                        </section>
                        <section className="grid-form-3-container-area mt-5px">
                            <Controller
                                control={control}
                                name={"city"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className={'input-basic medium'}
                                        typeInput="text"
                                        register={register}
                                        label="Ciudad"
                                        classNameLabel={!id ? 'text-black big bold text-required': 'text-black big bold'}
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => {field.onChange(value);setIsAllowUpdateBtn(true)}}
                                    />
                                )} />
                            <Controller
                                control={control}
                                name={"address"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className={'input-basic medium'}
                                        typeInput="text"
                                        register={register}
                                        label="Dirección"
                                        classNameLabel={!id ? 'text-black big bold text-required': 'text-black big bold'}
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => {field.onChange(value);setIsAllowUpdateBtn(true)}}
                                    />
                                )} />
                            <Controller
                                control={control}
                                name={"phone"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className={'input-basic medium'}
                                        typeInput="number"
                                        register={register}
                                        label="Teléfono"
                                        classNameLabel={!id ? 'text-black big bold text-required': 'text-black big bold'}
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => {field.onChange(value);setIsAllowUpdateBtn(true)}}
                                    />
                                )} />
                            <Controller
                                control={control}
                                name={"email"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className={'input-basic medium'}
                                        typeInput="text"
                                        register={register}
                                        label="Correo electrónico"
                                        classNameLabel={!id ? 'text-black big bold text-required': 'text-black big bold'}
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => {field.onChange(value);setIsAllowUpdateBtn(true)}}
                                    />
                                )} />

                        </section>
                    </div>


                    <div className="container-button-bot">
                        <ButtonComponent
                            form="useQueryForm"
                            value="Cancelar"
                            type="button"
                            className="button-clean-fields bold"
                            action={() => {
                                setMessage({
                                    title: "Cancelar",
                                    show: true,
                                    cancelTitle: "Cancelar",
                                    OkTitle: "Aceptar",
                                    description: (
                                        <div style={{ width: "100%" }}>
                                            <label>¿Estas segur@ de cancelar?</label>
                                        </div>
                                    ),
                                    background: true,
                                    onOk: () => {
                                        navigate("/gestion-financiera/acreedor");
                                        setMessage({});
                                    },
                                    onCancel: () => {
                                        setMessage({});
                                    },
                                });
                            }}
                        />

                        <div className="buttons-bot">
                            <ButtonLoadingComponent
                                className="button-main huge hover-three"
                                value="Guardar"
                                form="form-pac"
                                type="submit"
                                disabled={ id ? !isAllowUpdateBtn : false}
                            />
                        </div>
                    </div>
                </FormComponent>
            </div>

        </div>
    )
}


export default React.memo(CreditorCrudPage);