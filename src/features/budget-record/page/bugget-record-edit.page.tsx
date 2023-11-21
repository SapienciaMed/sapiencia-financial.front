import React from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { TextAreaCountComponent } from "../../../common/components/Form/input-text-area-count.component";
import { Controller } from 'react-hook-form';
import { useBudgeRecordEdit } from "../hook/budget-record-edit.hook";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";


function BudgetRecordEditPage() {

  

    const { control, register, dependeciesData, componentsData, disabledButton, onSubmiteditRp, CancelFunction, totalCautation, RP } = useBudgeRecordEdit();

    return (
        <div className="crud-page">
            <div className="main-page full-height">
                <p className="text-black extra-large">Editar ruta RP</p>
                <FormComponent
                    action={onSubmiteditRp}
                    id="editRp"
                    className="form-pac"
                >

                    <div className="card-user">
                        <section className="grid-form-3-container-area mt-5px"><h3>Tercero</h3></section>
                        <section className="grid-form-3-container-area mt-5px">
                            <InputComponent
                                idInput="taxIdentification"
                                className="input-basic "
                                typeInput="text"
                                register={register}
                                label="Acreedor e ID fiscal"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <InputComponent
                                idInput="document"
                                className="input-basic "
                                typeInput="text"
                                register={register}
                                label="Identificación"
                                classNameLabel="text-black biggest"
                                disabled
                            />
                            <InputComponent
                                idInput="name"
                                className="input-basic "
                                typeInput="text"
                                register={register}
                                label="Contratista"
                                classNameLabel="text-black biggest"
                                disabled
                            />
                        </section>

                        <section className="grid-form-3-container-area mt-5px"><h3>Dependencia</h3></section>
                        <section className="grid-form-3-container-area mt-5px">
                            <SelectComponent
                                idInput="dependencyId"
                                control={control}
                                label="Dependencia"
                                className="select-basic"
                                classNameLabel="text-black biggest"
                                placeholder={"Seleccionar"}
                                data={dependeciesData}
                                filter={true}
                                disabled
                            />
                            <InputComponent
                                idInput="contractualObject"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Actividad del objeto contractual"
                                classNameLabel="text-black biggest"
                                disabled
                            />
                            <SelectComponent
                                idInput="componentId"
                                control={control}
                                label="Componente"
                                className="select-basic"
                                classNameLabel="text-black biggest"
                                placeholder={"Seleccionar"}
                                data={componentsData}
                                filter={true}
                                disabled

                            />
                        </section>
                    </div>



                    <section className="card-user mt-24px mb-24px">
                        <div className="title-area">
                            <p className="text-black extra-large">Datos básicos</p>
                        </div>
                        <div className="routes-denomination-container">
                            <InputComponent
                                idInput="numberProject"
                                className="input-basic "
                                typeInput="text"
                                register={register}
                                label="Proyecto"
                                classNameLabel="text-black biggest "
                                disabled
                            />
                            <InputComponent
                                idInput="projectName"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Nombre proyecto"
                                classNameLabel="text-black biggest "
                                disabled
                            />
                        </div>
                        <section className='grid-form-3-container-area mt-5px'>
                            <InputComponent
                                idInput="fund"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Fondo"
                                classNameLabel="text-black biggest "
                                disabled
                            />
                            <InputComponent
                                idInput="pospreSapiencia"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Pospre"
                                classNameLabel="text-black biggest "
                                disabled
                            />
                            <InputComponent
                                idInput="areaNumber"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Área funcional"
                                classNameLabel="text-black biggest "
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
                                classNameLabel="text-black biggest "
                                disabled
                            />
                            <InputComponent
                                idInput="div"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="DIV"
                                classNameLabel="text-black biggest "
                                disabled
                            />
                            <InputComponent
                                idInput="cdpPosition"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Posición"
                                classNameLabel="text-black biggest "
                                disabled
                            />
                        </section>

                        <label className="text-black biggest mt-24px">Importe</label>
                        <section className='funcionality-filters-container mt-24px'>
                         
                          <Controller
                                control={control}
                                name={"amount"}
                                defaultValue='0'
                                render={({ field }) => {
                                    return (
                                        <InputNumberComponent
                                            control={control}
                                            idInput={field.name}
                                            label="Valor inicial"
                                            className="inputNumber-basic"
                                            classNameLabel="text-black biggest text-required"
                                            mode="currency"
                                            currency="COP"
                                            locale="es-CO"
                                            minFractionDigits={0}
                                            maxFractionDigits={0}
                                        //errors={errors}
                                        disabled
                                        />
                                    )
                                }}
                            />


                            <Controller
                                control={control}
                                name={"againtsAmount"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <InputNumberComponent
                                        control={control}
                                        idInput={field.name}
                                        label="Modificado contracrédito"
                                        className="inputNumber-basic"
                                        classNameLabel="text-black biggest text-required"
                                        mode="currency"
                                        currency="COP"
                                        locale="es-CO"
                                        minFractionDigits={0}
                                        maxFractionDigits={0}
                                    //errors={errors}
                                    />
                                    )
                                }}
                            />

                         

                            <Controller
                                control={control}
                                name={"creditAmount"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <InputNumberComponent
                                            control={control}
                                            idInput={field.name}
                                            label="Modificado crédito"
                                            className="inputNumber-basic"
                                            classNameLabel="text-black biggest text-required"
                                            mode="currency"
                                            currency="COP"
                                            locale="es-CO"
                                            minFractionDigits={0}
                                            maxFractionDigits={0}
                                        //errors={errors}
                                        />
                                    )
                                }}
                            />

                        

                            <Controller
                                control={control}
                                name={"fixedCompleted"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <InputNumberComponent
                                            control={control}
                                            idInput={field.name}
                                            label="Fijado concluído"
                                            className="inputNumber-basic"
                                            classNameLabel="text-black biggest text-required"
                                            mode="currency"
                                            currency="COP"
                                            locale="es-CO"
                                            minFractionDigits={0}
                                            maxFractionDigits={0}
                                        //errors={errors}
                                        />
                                    )
                                }}
                            />

                        </section>
                        <section className='one-filter-container'>
                            <Controller
                                control={control}
                                name={"idcFinalValue"}
                                defaultValue='0'
                                render={({ field }) => {
                                    return (
                                        <InputNumberComponent
                                            control={control}
                                            idInput={field.name}
                                            label="Valor final"
                                            className="inputNumber-basic"
                                            classNameLabel="text-black biggest text-required"
                                            mode="currency"
                                            currency="COP"
                                            locale="es-CO"
                                            minFractionDigits={0}
                                            maxFractionDigits={0}
                                        //errors={errors}
                                        disabled
                                        />
                                    )
                                }}
                            />
                        </section>

                        <div className='mt-24px'>
                            <Controller
                                control={control}
                                name={"observation"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <TextAreaCountComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Observación"
                                            className="text-area-basic"
                                            classNameLabel="text-black biggest"
                                            rows={4}
                                            placeholder="Escribe aquí"
                                            register={register}
                                            onChange={field.onChange}
                                            characters={500}

                                        ></TextAreaCountComponent>
                                    );
                                }}
                            />
                            <label>CDP: {RP}</label>
                            <br />
                            <label>Causación: {totalCautation}</label>
                            <br />
                            <br />

                            <label>Modificado contracrédito no puede ser mayor a la Causación</label><br />
                            <label>Modificado crédito no puede ser mayor al RP</label><br />
                            <label>El total causacion debe ser menor al RP</label><br />
                        </div>
                    </section>

                    <hr />

                    <section className="container-button-core-adicion ">
                        <div className="display-align-flex-center">
                            <>
                                <ButtonComponent
                                    form="editRp"
                                    value="Cancelar"
                                    type="button"
                                    className="button-clean-fields bold"
                                    action={() => CancelFunction()}
                                />
                                <ButtonComponent
                                    form="editRp"
                                    className="button-search"
                                    value="Guardar"
                                    type="submit"
                                    disabled={disabledButton}


                                />
                            </>
                        </div>
                    </section>
                </FormComponent>
            </div>
        </div>
    )
}

export default React.memo(BudgetRecordEditPage);