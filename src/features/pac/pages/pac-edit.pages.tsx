import React from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { usePacEdit } from "../hook/pac-edit.hook";
import PacMonths from "./pac-moths";
import { ProgressSpinner } from "primereact/progressspinner";

function PacEditPages() {

    const {control, errors, pacMoths, isMothEnabled, entitiesData, showSpinner, isBtnDisable, onSubmit, register, confirmClose} = usePacEdit()

    return (
        <div className="crud-page">
            <section className='main-page'>
                <div className='card-table gap-0'>
                    <section className="title-area">
                        <div className="text-black weight-500 extra-large">Editar PAC</div>
                    </section>
                    <FormComponent action={onSubmit} id="edit-pac-form">
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
                            disabled={showSpinner}
                        />
                        {
                            showSpinner && (
                                <ProgressSpinner style={{width: '20px', height: '20px', marginTop: '1rem'}}  animationDuration=".5s" />
                            )              
                        }
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
                            </div>

                            <div className="funcionality-filters-container">
                               
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
                            </div>

                            <div className="funcionality-filters-container">
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
                                    classNameLabel="text-black big weight-500 text-required"
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
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
                                  <InputComponent
                                    idInput='resourceType'
                                    className="input-basic "
                                    typeInput="text"
                                    register={register}
                                    label="Tipo de recurso"
                                    classNameLabel="text-black weight-500 big text-required"
                                    direction={EDirection.column}
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
                        onClick={confirmClose}
                    >
                        Cancelar
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Guardar"
                        type="submit"
                        form="edit-pac-form"
                        disabled={!isBtnDisable}
                    />
                </div>
            </section>

        </div>
    )
    
}

export default React.memo(PacEditPages);