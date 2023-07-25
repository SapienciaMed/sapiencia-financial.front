import { AiOutlinePlusCircle } from "react-icons/ai";
import { FormComponent, InputComponent, DatePickerComponent, SelectComponent, ButtonComponent } from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { EDirection } from "../../../common/constants/input.enum";
import { useFundsData } from "../hooks/funds.hook";
import { Controller } from "react-hook-form";
import React from "react";

interface IAppProps { }

function FoundsPage(props: IAppProps): React.JSX.Element {
    const { tableActions, tableColumns, tableComponentRef, onSubmit, navigate, register, errors, setValueRegister, reset, controlRegister, entitySelected, setEntitySelected, entitiesData } = useFundsData();
    return (
        <div>
            <FormComponent action={onSubmit}>
                <div className="card-form">
                    <div className="title-area">
                        <label className="text-black biggest bold">
                            Datos personales
                        </label>

                        <div className="title-button text-main biggest" onClick={() => { navigate('./create') }}>
                            Crear <AiOutlinePlusCircle />
                        </div>
                    </div>
                    <div className="funcionality-filters-container">
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
                <div className="funcionality-buttons-container">
                    <span className="bold text-center button" onClick={() => {
                        reset();
                        setEntitySelected(null);
                    }}>
                        Limpiar campos
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Buscar"
                        type="submit"
                    />
                </div>
            </FormComponent>
            <div className="card-form">
                <TableComponent
                    ref={tableComponentRef}
                    url={`${process.env.urlApiFinancial}/api/v1/funds/get-paginated`}
                    columns={tableColumns}
                    actions={tableActions} 
                    isShowModal={false}/>
            </div>
        </div>
    )
}

export default React.memo(FoundsPage);