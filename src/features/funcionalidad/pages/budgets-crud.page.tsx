import React from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useBudgetsCrudData } from "../hooks/budgets-crud.hook";
import { useParams } from "react-router-dom";

interface IAppProps {
    action: "new" | "edit";
}

function BudgetsForm({ action }: IAppProps) {
    const { id: budgetsId } = useParams();
    const { register, errors, reset, setValueRegister, entitiesData, entitySelected, setEntitySelected,onSubmitEditBudgets,onSubmitNewBudgets,confirmClose,onCancelNew, onCancelEdit} = useBudgetsCrudData(budgetsId);
    return (
        <div className="crud-page full-height">
            <div className="main-page full-height">
                <div className="card-table">
                    <div className="title-area">
                        <div className="text-black extra-large bold">{action === "new" ? "Crear Pospre" : "Editar Pospre "}</div>
                    </div>

                    <FormComponent action={action === "new" ? onSubmitNewBudgets : onSubmitEditBudgets} className="funds-form" id="budgets-form">
                        <div className="card-form">
                            <div className="fund-data-container">

                                <InputComponent
                                    idInput="number"
                                    register={register}
                                    typeInput="number"
                                    errors={errors}
                                    label="Posicion Presupuestaria"
                                    classNameLabel="text-black biggest bold"
                                />

                                <InputComponent
                                            idInput="ejercise"
                                            className="input-basic"
                                            typeInput="number"
                                            register={register}
                                            label="Ejercicio"
                                            classNameLabel="text-black biggest bold"
                                            direction={EDirection.row}
                                            errors={errors}
                                />

                                <SelectComponent
                                    idInput="entity"
                                    className="select-basic"
                                    register={register}
                                    setValueRegister={setValueRegister}
                                    errors={errors}
                                    label="Entidad CP"
                                    classNameLabel="text-black biggest bold"
                                    direction={EDirection.row}
                                    data={entitiesData}
                                    stateProps={{ state: entitySelected, setState: setEntitySelected }}
                                />
                               
                            </div>
                        </div>
                        <div className="card-form">
                            <div className="title-area">
                                <div className="text-black biggest bold">Datos básicos</div>
                            </div>
                            <div className="fund-denomination-container">
                                <InputComponent
                                    idInput="denomination"
                                    register={register}
                                    typeInput="text"
                                    errors={errors}
                                    label="Denominación"
                                    classNameLabel="text-black biggest bold"
                                />
                            </div>
                            <div className="fund-denomination-container">
                                <InputComponent
                                    idInput="description"
                                    register={register}
                                    typeInput="text"
                                    errors={errors}
                                    label="Descripción"
                                    classNameLabel="text-black biggest bold"
                                />
                            </div>
                        </div>
                        <div className="mobile-actions mobile">
                        <span className="bold text-center button" onClick={() => { confirmClose(action === "new" ? onCancelNew : onCancelEdit) }}>
                             Cancelar
                        </span>
                            <ButtonComponent
                                value="Guardar"
                                type="submit"
                            />
                        </div>
                    </FormComponent>
                </div>

            </div>
            <div className="container-button-bot">
                <div className="buttons-bot">
                    <span className="bold text-center button" onClick={() => { confirmClose(action === "new" ? onCancelNew : onCancelEdit) }}>
                        Cancelar
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Guardar"
                        type="submit"
                        form="budgets-form"
                    />
                </div>
            </div>
        </div>

    );
}

export default React.memo(BudgetsForm);
