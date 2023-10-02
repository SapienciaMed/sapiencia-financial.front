import React from "react";
import { ButtonComponent, FormComponent, InputComponent, TextAreaComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useParams } from "react-router-dom";
import { usePosPreSapienciaCrudData } from "../hooks/pospre-sapiencia-crud.hook";
import { Controller } from "react-hook-form";

interface IAppProps {
    action: "new" | "edit";
    location: "origen" | "pospre"
}

function PosPreSapienciaForm({ action, location }: IAppProps) {
    const { pospre, id } = useParams();
    const { register, errors, control, onSubmitNewPosPreSapiencia, onSubmitEditPosPreSapiencia, onCancelNew, 
        onCancelEdit, confirmClose, validatorNumber } = usePosPreSapienciaCrudData(pospre, id, location);
    return (
        <div className="crud-page full-height">
            <div className="main-page full-height">
                <div className="card-table">
                    <div className="title-area">
                        <div className="text-black extra-large bold">{action === "new" ? "Crear Pospre Sapiencia" : "Editar Pospre Sapiencia"}</div>
                    </div>

                    <FormComponent action={action === "new" ? onSubmitNewPosPreSapiencia : onSubmitEditPosPreSapiencia} className="funds-form" id="pospre-sapiencia-form">
                        <div className="card-form">
                            <div className="pospre-sapiencia-data">
                                <div className="pospre-sapiencia-basic">
                                    <Controller
                                        control={control}
                                        name={"number"}
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
                                                    label="Código pospre"
                                                    classNameLabel="text-black biggest bold"
                                                    direction={EDirection.column}
                                                    errors={errors}
                                                    onChange={field.onChange}
                                                    disabled={action === "new" ? false : true}
                                                /> 
                                            )
                                        }}
                                    />
                                    <Controller
                                        control={control}
                                        name={"ejercise"}
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
                                                    label="Ejercicio"
                                                    classNameLabel="text-black biggest bold"
                                                    direction={EDirection.column}
                                                    errors={errors}
                                                    onChange={field.onChange}
                                                    disabled={action === "new" ? false : true}
                                                /> 
                                            )
                                        }}
                                    />
                                </div>
                                <div>
                                <Controller
                                        control={control}
                                        name={"description"}
                                        defaultValue=""     
                                        render={({ field }) => {
                                            return (
                                                <TextAreaComponent
                                                    id={field.name}
                                                    idInput={field.name}
                                                    value={`${field.value}`}
                                                    className="text-area-basic"
                                                    register={register}
                                                    label="Descripción"
                                                    classNameLabel="text-black biggest bold"
                                                    errors={errors}
                                                    onChange={field.onChange}
                                                    rows={4}
                                                /> 
                                            )
                                        }}
                                    />
                                  
                                </div>
                            </div>
                        </div>
                        <div className="card-form">
                            <div className="title-area">
                                <div className="text-black biggest bold">Asignar código pospre sapiencia</div>
                            </div>
                            <div className="pospre-sapiencia-code">
                                <Controller
                                    control={control}
                                    name={"consecutive"}
                                    render={({ field }) => {
                                        return (
                                            <InputComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                className="input-basic"
                                                typeInput="number"
                                                register={register}
                                                label="Pospre sapiencia"
                                                classNameLabel="text-black biggest bold"
                                                direction={EDirection.column}
                                                errors={errors}
                                                onChange={field.onChange}
                                                min={0}
                                            /> 
                                        )
                                    }}
                                />

                                <InputComponent
                                    idInput="assignedTo"
                                    register={register}
                                    typeInput="text"
                                    errors={errors}
                                    label="Asignar a"
                                    classNameLabel="text-black biggest bold"
                                />
                            </div>
                        </div>

                        <div className="mobile-actions mobile">
                            <span className="bold text-center button" onClick={() => {
                                confirmClose(action === "new" ? onCancelNew : onCancelEdit)
                            }}>
                                Cancelar
                            </span>
                            <ButtonComponent
                                value="Guardar"
                                type="submit"
                                className="button-main huge"
                            />
                        </div>
                    </FormComponent>
                </div>

            </div>
            <div className="container-button-bot">
                <div className="buttons-bot">
                    <span className="bold text-center button" onClick={() => {
                        confirmClose(action === "new" ? onCancelNew : onCancelEdit)
                    }}>
                        Cancelar
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Guardar"
                        type="submit"
                        form="pospre-sapiencia-form"
                    />
                </div>
            </div>
        </div>
    );
}

export default React.memo(PosPreSapienciaForm);