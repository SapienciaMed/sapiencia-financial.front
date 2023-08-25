import React from "react";
import { useParams } from "react-router-dom";
import { ButtonComponent, FormComponent, InputComponent, TextAreaComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useFunctionalAreaCrudData } from "../hooks/functional-area-crud.hook";
import TableComponent from "../../../common/components/table.component";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Controller } from 'react-hook-form';

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
    const { register, errors, confirmClose, onCancelNew, onCancelEdit, onSubmitNewFunctionalArea, onSubmitEditFunctionalArea, control,
        tableComponentRef, tableColumns, tableActions, tableColumnsView, navigate } = useFunctionalAreaCrudData(id);
    return (
        <div className="crud-page full-height">
            <div className="main-page full-height">
                <div className="card-table">
                    <div className="title-area">
                        <div className="text-black extra-large bold">{headerTitle[`${action}`]}</div>
                    </div>

                    <FormComponent action={action === "new" ? onSubmitNewFunctionalArea : onSubmitEditFunctionalArea} className="funds-form" id="functional-area-form">
                        <div className="card-form">
                            <div className="title-area">
                                <label className="text-black biggest bold">
                                    Consultar Área funcional
                                </label>

                                {action !== "edit" ? <></> :
                                    <div className="title-button text-main biggest" onClick={() => { navigate(`./link/`) }}>
                                        Vincular proyecto <AiOutlinePlusCircle />
                                    </div>
                                }
                            </div>
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
                                                    label="Código"
                                                    classNameLabel="text-black biggest bold text-required"
                                                    direction={EDirection.row}
                                                    errors={errors}
                                                    onChange={field.onChange}
                                                    disabled={action !== "new"}
                                                /> 
                                            )
                                        }}
                                    />
                                     <Controller
                                        control={control}
                                        name={"denomination"}
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
                                                    label="Código"
                                                    classNameLabel="text-black biggest bold text-required"
                                                    direction={EDirection.row}
                                                    errors={errors}
                                                    onChange={field.onChange}
                                                    disabled={action !== "new"}
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
                                                    classNameLabel="text-black biggest bold text-required"
                                                    direction={EDirection.row}
                                                    errors={errors}
                                                    onChange={field.onChange}
                                                    disabled={action !== "new"}
                                                /> 
                                            )
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {action === "new" ? <></> :
                            <div className="card-form">
                                <TableComponent
                                    ref={tableComponentRef}
                                    url={`${process.env.urlApiFinancial}/api/v1/functional-area/link/get-paginated`}
                                    columns={action === "edit" ? tableColumns : tableColumnsView}
                                    actions={action === "edit" ? tableActions : undefined}
                                    isShowModal={false} />
                            </div>
                        }

                        {action === "view" ?
                            <div className="mobile-actions mobile">
                                <ButtonComponent
                                    value="Guardar"
                                    type="button"
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
                            form="functional-area-form"
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
                            type="submit"
                            form="functional-area-form"
                        />
                    </div>
                </div>
            }
        </div>
    );
}

export default React.memo(FunctionalAreaCrudPage);
