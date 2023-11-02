import React, { useState } from "react";
import { ButtonComponent, DatePickerComponent, FormComponent, InputComponent } from "../../../common/components/Form";
import { TextAreaComponent } from '../../../common/components/Form/input-text-area.component';
import { Controller } from "react-hook-form";
import { useEditrouteCDP } from "../hooks/useEditRouteCDP";
import { TextAreaCountComponent } from "../../../common/components/Form/input-text-area-count.component";


function RoutesCDPEditPage() {

    const [modifiedIdcCountercredit, setModifiedIdcCountercredit] = useState(0)
    const [idcModifiedCredit, setIdcModifiedCredit] = useState(0)
    const [idcFixedCompleted, setIdcFixedCompleted] = useState(0)

    const { onSubmiteditRouteCDP, register, control, idcFinalValue, disable,CancelFunction } = useEditrouteCDP(modifiedIdcCountercredit, idcModifiedCredit, idcFixedCompleted);

    return (
        <div className="main-page">
            <div className="card-table gap-0 mb-24px">
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Editar ruta CDP</div>
                </section>
                <FormComponent
                    id="editRouteCDP"
                    className="form-signIn"
                    action={onSubmiteditRouteCDP}
                >
                    <section className="card-user">
                        <label className="text-black biggest mb-24px">Fechas</label>
                        <section className='funcionality-filters-container'>
                            <DatePickerComponent
                                idInput="date"
                                control={control}
                                label={"Fecha  documento"}
                                // errors={errors}
                                classNameLabel="text-black biggest text-required"
                                className="dataPicker-basic"
                                placeholder="DD/MM/YYYY"
                                dateFormat="dd/mm/yy"
                                disabled
                            />
                            <InputComponent
                                idInput="exercise"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Vigencia"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            // direction={EDirection.column}
                            //errors={errors}
                            />
                            <InputComponent
                                idInput="month"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Mes expedición"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <InputComponent
                                idInput="consecutive"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="No. CDP Aurora"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                        </section>
                        <div className=''>
                            <Controller
                                control={control}
                                name={"contractObject"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <TextAreaCountComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Descripción"
                                            className="text-area-basic"
                                            classNameLabel="text-black biggest"
                                            rows={4}
                                            placeholder="Escribe aquí"
                                            register={register}
                                            onChange={field.onChange}
                                            characters={5000}
                                            disabled
                                        ></TextAreaCountComponent>
                                    );
                                }}
                            />
                        </div>
                        <section className="one-filter-container">
                            <InputComponent
                                idInput="sapConsecutive"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="No. consecutivo CDP SAP"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                        </section>
                    </section>

                    <section className="card-user mt-24px">
                        <div className="title-area">
                            <label className="text-black biggest">Ruta presupuestal</label>
                        </div>
                        <div className="routes-denomination-container">
                            <InputComponent
                                idInput="numberProject"
                                className="input-basic "
                                typeInput="text"
                                register={register}
                                label="Proyecto"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <InputComponent
                                idInput="nameProject"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Nombre proyecto"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                        </div>
                        <section className='grid-form-3-container-area mt-5px'>
                            <InputComponent
                                idInput="numberFound"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Fondo"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <InputComponent
                                idInput="numberPospre"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Pospre"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <InputComponent
                                idInput="areaNumber"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Área funcional"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                        </section>

                        <section className='grid-form-3-container-area mt-5px'>
                            <InputComponent
                                idInput="managementCenter"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Centro gestor"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <InputComponent
                                idInput="div"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="DIV"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <InputComponent
                                idInput="cdpPosition"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Posición"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                        </section>

                        <label className="text-black biggest mt-24px">Importe</label>
                        <section className='funcionality-filters-container mt-24px'>
                            <InputComponent
                                idInput="amount"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Valor inicial"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <InputComponent
                                idInput="modifiedIdcCountercredit"
                                className="input-basic"
                                typeInput="number"
                                register={register}
                                label="Modificado contracrédito"
                                classNameLabel="text-black biggest"
                                onChange={(e) => setModifiedIdcCountercredit(Number(e.target.value))}
                            />
                            <InputComponent
                                idInput="idcModifiedCredit"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Modificado crédito"
                                classNameLabel="text-black biggest"
                                onChange={(e) => setIdcModifiedCredit(Number(e.target.value))}
                            />
                            <InputComponent
                                idInput="idcFixedCompleted"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Fijado concluído"
                                classNameLabel="text-black biggest"
                                onChange={(e) => setIdcFixedCompleted(Number(e.target.value))}
                            />
                        </section>
                        <section className='one-filter-container'>
                            <InputComponent
                                idInput="idcFinalValue"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Valor final"
                                classNameLabel="text-black biggest text-required"
                                disabled
                                //value={String(idcFinalValue)}
                            />
                        </section>

                    </section>

                </FormComponent>
            </div>
            <hr />
            <section className="container-button-core-adicion ">
                <div className="display-align-flex-center">
                    <>
                        <ButtonComponent
                            form="editRouteCDP"
                            value="Cancelar"
                            type="button"
                            className="button-clean-fields bold"
                            action={() => CancelFunction()}
                        />
                        <ButtonComponent
                            form="editRouteCDP"
                            className="button-search"
                            value="Guardar"
                            type="submit"
                            disabled={disable}


                        />
                    </>
                </div>
            </section>
        </div>
    )

}

export default React.memo(RoutesCDPEditPage);