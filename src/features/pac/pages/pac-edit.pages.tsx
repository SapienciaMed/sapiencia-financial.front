import React from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { usePacEdit } from "../hook/pac-edit.hook";
import PacMonths from "./pac-moths";

function PacEditPages() {

    const {control, errors, pacMoths, isMothEnabled, entitiesData, handleSubmit, register} = usePacEdit()

    return (
        <div className="crud-page full-height">
            <section className='main-page full-height'>
                <div className='card-table gap-0'>
                    <section className="title-area">
                        <div className="text-black weight-500 extra-large">Editar PAC</div>
                    </section>
                    <FormComponent action={() => {}} id="edit-pac-form">
                        <SelectComponent
                            idInput="pacType"
                            className="select-basic big width-33"
                            errors={errors}
                            label="Tipo PAC"
                            classNameLabel="text-black weight-500 big text-required"
                            direction={EDirection.column}
                            data={[
                                { id: "2", name: "Programado", value: "2" },
                                { id: "3", name: "Recaudado", value: "3" },
                                { id: "4", name: "Ambos", value: "4" },
                            ]}
                            control={control}
                            
                        />
                        <section className="card-user mt-14px">
                            <div className="title-area">
                                <div className="text-black weight-500 biggest">Ruta presupuestal</div>
                            </div>

                            <div className="funcionality-filters-container">
                                <SelectComponent
                                    idInput='managerCenter'
                                    control={control}
                                    label='Centro gestor'
                                    className="select-basic big"
                                    classNameLabel="text-black weight-500 big text-required"
                                    placeholder={'Seleccionar'}
                                    fieldArray
                                    data={[{ id: "91500000", name: "91500000", value: "91500000" }]}
                                    disabled
                                />
                                    {/* Eliminar? */}
                                <SelectComponent
                                    idInput='Pospre'
                                    control={control}
                                    label='pospre'
                                    className="select-basic big"
                                    classNameLabel="text-black weight-500 big"
                                    data={[]}
                                    disabled
                                />
                            
                                <SelectComponent
                                    idInput='pospreSapiencia'
                                    control={control}
                                    label='Pospre Sapiencia'
                                    className="select-basic big"
                                    classNameLabel="text-black weight-500 big"
                                    fieldArray={true}
                                    data={entitiesData?.pospreSapiencia}
                                    disabled
                                />
                            </div>

                            <div className="funcionality-filters-container">
                                <SelectComponent
                                    idInput='fundsSapiencia'
                                    control={control}
                                    label='Fondo Sapiencia'
                                    className="select-basic big"
                                    classNameLabel="text-black weight-500 big text-required"
                                    placeholder={'Seleccionar'}
                                    fieldArray={true}
                                    data={entitiesData?.fundsSapiencia}
                                    disabled
                                />
                                {/* Eliminar? */}
                                <SelectComponent
                                    idInput='funds'
                                    control={control}
                                    label='Fondo'
                                    className="select-basic big"
                                    classNameLabel="text-black weight-500 big text-required"
                                    placeholder={'Seleccionar'}
                                    data={[]}
                                    disabled
                                />
                                <SelectComponent
                                    idInput='functionalArea'
                                    control={control}
                                    label='Área funcional'
                                    className="select-basic big"
                                    classNameLabel="text-black weight-500 big text-required"
                                    placeholder={'Seleccionar'}
                                    fieldArray={true}
                                    data={entitiesData?.functionalArea}
                                    disabled
                                />
                            </div>

                            <div className="funds-form ">
                                <div className="fund-denomination-container col-gap-1">
                                    <SelectComponent
                                        idInput='project'
                                        control={control}
                                        className="select-basic big"
                                        label='Proyecto'
                                        classNameLabel="text-black weight-500 big text-required"
                                        placeholder={'Seleccionar'}   
                                        fieldArray={true}
                                        data={entitiesData?.project}
                                        disabled
                                    />
                                    <InputComponent
                                        idInput='projectName'
                                        label="Nombre proyecto"
                                        typeInput="text"
                                        className="input-basic big"                     
                                        classNameLabel="text-black weight-500 big text-required"
                                        register={register}
                                        disabled
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="card-user mt-14px">
                            <div className="title-area">
                                <div className="text-black weight-500 biggest">Presupuesto</div>
                            </div>

                            <div className="funcionality-filters-container">
                                <InputNumberComponent
                                    control={control}
                                    idInput='budgetSapi'
                                    label='Presupuesto Sapiencia'
                                    className='inputNumber-basic big'
                                    classNameLabel="text-black big weight-500 "
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
                                    fieldArray={true}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                    disabled={!isMothEnabled.programed}
                                    errors={errors}
                                />
                                <InputComponent
                                    idInput='exercise'
                                    className="input-basic "
                                    typeInput="number"
                                    register={register}
                                    label="Vigencia"
                                    classNameLabel="text-black weight-500 big text-required"
                                    direction={EDirection.column}
                                    disabled
                                />
                                <InputNumberComponent
                                    control={control}
                                    idInput='totalProgrammed'
                                    label='Total programado'
                                    className="inputNumber-basic big"
                                    classNameLabel="text-black big weight-500 "
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                    disabled
                                />
                            </div>
                            <div className="funcionality-filters-container">
                                <InputNumberComponent
                                    control={control}
                                    idInput='totalCollected'
                                    label='Total recaudado'
                                    className="inputNumber-basic big"
                                    classNameLabel="text-black big weight-500 "
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                    disabled
                                />
                                <InputNumberComponent
                                    control={control}
                                    idInput='totalFunds'
                                    label='Tipo de recurso'
                                    className="inputNumber-basic big"
                                    classNameLabel="text-black big weight-500 "
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
                                    fieldArray={true}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                    disabled
                                />
                                <div></div>
                            </div>
                        </section>

                    </FormComponent>
                </div>
                <section className="card-user mt-14px">
                        <div className="title-area">
                            <div className="text-black weight-500 big">Programado</div>
                        </div>
                            <div className="grid-form-3-container-area grid-column-repet-4">
                            {
                        
                                Object.keys(pacMoths[0]).map((monthKey, index) => {
                                    return (
                                        <PacMonths
                                            key={`${monthKey}+${index}`}
                                            monthKey={monthKey}
                                            labelProgrammed={pacMoths[0][monthKey]}
                                            control={control}
                                            register={register}
                                            typePac="programmed"
                                            isDisabled={isMothEnabled.programed}
                                        />
                                    )
                                })
                            }
                                
                        </div>
                </section>
                <section className="card-user mt-14px">
                        <div className="title-area">
                            <div className="text-black weight-500 big">Recaudado</div>
                        </div>
                            <div className="grid-form-3-container-area grid-column-repet-4">
                            {
                        
                                Object.keys(pacMoths[0]).map((monthKey, index) => {
                                    return (
                                        <PacMonths
                                        key={`${monthKey}+${index}`}
                                            monthKey={monthKey}
                                            labelProgrammed={pacMoths[0][monthKey]}
                                            control={control}
                                            register={register}
                                            typePac="collected"
                                            isDisabled={isMothEnabled.collected}
                                        />
                                    )
                                })
                            }
                                
                        </div>
                </section>
            </section>
            <section className="container-button-bot-2">
                <div></div>
                <div className="buttons-bot">
                    <span
                        className="bold text-center button"
                        onClick={() => {}}
                    >
                        Cancelar
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Guardar"
                        type="submit"
                        form="edit-pac-form"
                    />
                </div>
            </section>

        </div>
    )
    
}

export default React.memo(PacEditPages);