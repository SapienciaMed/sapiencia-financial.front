import React from "react";
import { Controller } from "react-hook-form";
import { ButtonComponent, DatePickerComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useFundsCrudData } from "../hooks/funds-crud.hook";
import { useParams } from "react-router-dom";

interface IAppProps {
    action: "new" | "edit";
}

function FundsForm({ action }: IAppProps) {
    const { id: fundId } = useParams();
    const { register, errors, setValueRegister, controlRegister, entitiesData, entitySelected, setEntitySelected, onSubmitNewFund, onSubmitEditFund, onCancelNew, onCancelEdit, confirmClose } = useFundsCrudData(fundId);
    return (
        <div className="crud-page full-height">
            <div className="main-page full-height">
                <div className="card-table">
                    <div className="title-area">
                        <div className="text-black extra-large bold">{action === "new" ? "Crear fondo" : "Editar fondo "}</div>
                    </div>

                    <FormComponent action={action === "new" ? onSubmitNewFund : onSubmitEditFund} className="funds-form" id="funds-form">
                        <div className="card-form">
                            <div className="fund-data-container">
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
                                <InputComponent
                                    idInput="number"
                                    className="input-basic"
                                    typeInput="number"
                                    register={register}
                                    label="Fondos"
                                    classNameLabel="text-black biggest bold"
                                    direction={EDirection.row}
                                    errors={errors}
                                />
                            </div>
                        </div>
                        <div className="card-form">
                            <div className="title-area">
                                <div className="text-black biggest bold">Denominaciones</div>
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
                        <div className="card-form">
                            <div className="title-area">
                                <div className="text-black biggest bold">Datos básicos</div>
                            </div>
                            <div className="fund-data-container">
                                <Controller
                                    name="dateFrom"
                                    control={controlRegister}
                                    render={({ field }) => (
                                        <DatePickerComponent
                                            idInput={field.name}
                                            value={field.value}
                                            onchange={field.onChange}
                                            direction={EDirection.row}
                                            register={register}
                                            setValueRegister={setValueRegister}
                                            errors={errors}
                                            className="select-basic"
                                            label="Validez de"
                                            classNameLabel="text-black biggest bold"
                                        />
                                    )}
                                />
                                <Controller
                                    name="dateTo"
                                    control={controlRegister}
                                    render={({ field }) => (
                                        <DatePickerComponent
                                            idInput={field.name}
                                            value={field.value}
                                            onchange={field.onChange}
                                            direction={EDirection.row}
                                            setValueRegister={setValueRegister}
                                            register={register}
                                            errors={errors}
                                            className="select-basic"
                                            label="Validez de"
                                            classNameLabel="text-black biggest bold"
                                        />
                                    )}
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
                        form="funds-form"
                    />
                </div>
            </div>
        </div>

    );
}

export default React.memo(FundsForm);