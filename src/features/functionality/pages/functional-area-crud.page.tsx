import React from "react";
import { useParams } from "react-router-dom";
import { ButtonComponent, FormComponent, InputComponent, TextAreaComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useFunctionalAreaCrudData } from "../hooks/functional-area-crud.hook";

interface IAppProps {
    action: "new" | "edit" | "view";
}

function FunctionalAreaCrudPage({ action }: IAppProps): React.JSX.Element {
    const { id } = useParams();
    const headerTitle = {
        new: "Crear Área funcional",
        edit: "Editar Área funcional",
        view: "Detalle Área funcional",
    };
    const { register, errors, confirmClose, onCancelNew, onCancelEdit } = useFunctionalAreaCrudData(id);
    return (
        <div className="crud-page full-height">
            <div className="main-page full-height">
                <div className="card-table">
                    <div className="title-area">
                        <div className="text-black extra-large bold">{headerTitle[`${action}`]}</div>
                    </div>

                    <FormComponent action={undefined} className="funds-form" id="pospre-sapiencia-form">
                        <div className="card-form">
                            <div className="pospre-sapiencia-data">
                                <div className="pospre-sapiencia-basic">
                                    <InputComponent
                                        idInput="number"
                                        className="input-basic"
                                        typeInput="text"
                                        register={register}
                                        label="Código"
                                        classNameLabel="text-black biggest bold"
                                        direction={EDirection.row}
                                        errors={errors}
                                    />
                                    <InputComponent
                                        idInput="denomination"
                                        className="input-basic"
                                        typeInput="text"
                                        register={register}
                                        label="Denominación"
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

                        {action === "view" ?
                            <div className="mobile-actions mobile">
                                <ButtonComponent
                                    value="Guardar"
                                    type="submit"
                                    className="button-main huge"
                                    action={onCancelEdit}
                                />
                            </div> :
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
                        }
                    </FormComponent>
                </div>

            </div>
            {action === "view" ?
                <div className="container-button-bot">
                    <div className="buttons-bot">
                        <ButtonComponent
                            className="button-main huge hover-three"
                            value="Aceptar"
                            type="button"
                            form="pospre-sapiencia-form"
                            action={onCancelEdit}
                        />
                    </div>
                </div> :
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
                            type="button"
                            form="pospre-sapiencia-form"
                        />
                    </div>
                </div>
            }
        </div>
    );
}

export default React.memo(FunctionalAreaCrudPage);
