import React from "react";
import { Controller } from "react-hook-form";
import { ButtonComponent, DatePickerComponent, FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useParams } from "react-router-dom";
import { usePosPreSapienciaCrudData } from "../hooks/pospre-sapiencia-crud.hook";

interface IAppProps {
    action: "new" | "edit";
}

function PosPreSapienciaForm({ action }: IAppProps) {
    const { pospre, id } = useParams();
    const { register, errors, onSubmitNewPosPreSapiencia, onSubmitEditPosPreSapiencia, onCancelNew, onCancelEdit, confirmClose } = usePosPreSapienciaCrudData(pospre, id);
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
                                    <InputComponent
                                        idInput="number"
                                        className="input-basic"
                                        typeInput="text"
                                        register={register}
                                        label="Código pospre sapiencia"
                                        classNameLabel="text-black biggest bold"
                                        direction={EDirection.row}
                                        errors={errors}
                                    />
                                    <InputComponent
                                        idInput="ejercise"
                                        className="input-basic"
                                        typeInput="text"
                                        register={register}
                                        label="Ejercicio"
                                        classNameLabel="text-black biggest bold"
                                        direction={EDirection.row}
                                        errors={errors}
                                    />
                                </div>
                                <div>
                                    <TextAreaComponent
                                        idInput="description"
                                        register={register}
                                        errors={errors}
                                        label="Descripción"
                                        classNameLabel="text-black biggest bold"
                                        className="text-area-basic"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card-form">
                            <div className="title-area">
                                <div className="text-black biggest bold">Asignar código pospre sapiencia</div>
                            </div>
                            <div className="pospre-sapiencia-code">
                                <InputComponent
                                    idInput="consecutive"
                                    register={register}
                                    typeInput="number"
                                    errors={errors}
                                    label="Consecutivo"
                                    classNameLabel="text-black biggest bold"
                                />
                                <InputComponent
                                    idInput="assignedTo"
                                    register={register}
                                    typeInput="text"
                                    errors={errors}
                                    label="Asignar a"
                                    classNameLabel="text-black biggest bold"
                                    disabled={true}
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