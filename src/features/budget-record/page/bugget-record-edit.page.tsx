import React from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { TextAreaCountComponent } from "../../../common/components/Form/input-text-area-count.component";
import { Controller } from 'react-hook-form';
import { useBudgeRecordEdit } from "../hook/budget-record-edit.hook";


function BudgetRecordEditPage() {

    const { control, register, dependeciesData,componentsData } = useBudgeRecordEdit();

    return (
        <div className="crud-page">
            <div className="main-page full-height">
                <p className="text-black extra-large">Editar ruta RP</p>
                <FormComponent
                    action={"onSubmitRP"}
                    id="form-pac"
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
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <InputComponent
                                idInput="name"
                                className="input-basic "
                                typeInput="text"
                                register={register}
                                label="Contratista"
                                classNameLabel="text-black biggest text-required"
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
                                classNameLabel="text-black big bold text-required"
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
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <SelectComponent
                                idInput="componentId"
                                control={control}
                                label="Componente"
                                className="select-basic"
                                classNameLabel="text-black big bold text-required"
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
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <InputComponent
                                idInput="projectName"
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
                                idInput="fund"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Fondo"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            />
                            <InputComponent
                                idInput="pospreSapiencia"
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
                                //register={register}
                                label="Modificado contracrédito"
                                classNameLabel="text-black biggest"

                            />
                            <InputComponent
                                idInput="idcModifiedCredit"
                                className="input-basic"
                                typeInput="text"
                                //register={register}
                                label="Modificado crédito"
                                classNameLabel="text-black biggest"

                            />
                            <InputComponent
                                idInput="idcFixedCompleted"
                                className="input-basic"
                                typeInput="text"
                                //register={register}
                                label="Fijado concluído"
                                classNameLabel="text-black biggest"

                            />
                        </section>
                        <section className='one-filter-container'>
                            <InputComponent
                                idInput="idcFinalValue"
                                className="input-basic"
                                typeInput="text"
                                //register={register}
                                label="Valor final"
                                classNameLabel="text-black biggest text-required"
                                disabled
                            //value={String(idcFinalValue)}
                            />
                        </section>

                        {/*   <div className='mt-24px'>
                            <Controller
                                //control={control}
                                name={"contractObject"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <TextAreaCountComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Objeto contractual"
                                            className="text-area-basic"
                                            classNameLabel="text-black biggest"
                                            rows={4}
                                            placeholder="Escribe aquí"
                                            // register={register}
                                            onChange={field.onChange}
                                            characters={5000}
                                            disabled
                                        ></TextAreaCountComponent>
                                    );
                                }}
                            />
                        </div> */}
                    </section>

                    <hr />

                    <section className="container-button-core-adicion ">
                        <div className="display-align-flex-center">
                            <>
                                <ButtonComponent
                                    form="editRouteCDP"
                                    value="Cancelar"
                                    type="button"
                                    className="button-clean-fields bold"
                                //action={() => CancelFunction()}
                                />
                                <ButtonComponent
                                    form="editRouteCDP"
                                    className="button-search"
                                    value="Guardar"
                                    type="submit"
                                //disabled={disable}


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