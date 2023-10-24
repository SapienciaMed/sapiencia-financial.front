import React from 'react'
import { ButtonComponent, FormComponent, SelectComponent } from '../../../../common/components/Form';
import { Controller } from 'react-hook-form';
import { InputComponent } from '../../../../../../sapiencia-payroll.front/src/common/components/Form/input.component';
import { EDirection } from '../../../../common/constants/input.enum';
import { useAssociatePac } from '../hook/associate-pac-pages.hook';
import ProgramedMoths from './programed-moths';
import { InputNumberComponent } from '../../../../common/components/Form/input-number.component';

function AssociatePacPages() {

    const {control, errors, programmed, isBtnDisable, onSubmit, register, handleChangeExercise, confirmClose} = useAssociatePac()
    
    return(
        <div className='main-page'>
            <div className='card-table gap-0'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Asociar al PAC</div>
                </section>

                <FormComponent action={onSubmit}>
                    <section className="card-user">
                    <section className="title-area">
                        <div className="text-black weight-500 large">Ruta presupuestal</div>
                    </section>
                        <div className="funcionality-filters-container">
                            <Controller
                                control={control}
                                name={"exercise"}
                                defaultValue='' 
                                render={({ field }) => {
                                    return(
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            className="input-basic color-default-value"
                                            typeInput="number"
                                            register={register}
                                            label="Vigencia"
                                            classNameLabel="text-black weight-500 biggest text-required"
                                            direction={EDirection.column}
                                            onChange={(value) => {
                                                field.onChange(value);
                                                handleChangeExercise(value)
                                            }}
                                            errors={errors}

                                    />
                                    )
                                }}
                            />
                            <SelectComponent
                                idInput="resourceType"
                                className="select-basic"
                                errors={errors}
                                label="Tipo de recurso"
                                classNameLabel="text-black weight-500 biggest text-required"
                                direction={EDirection.column}
                                data={[
                                    { id: '1', name: 'Seleccione', value: null},
                                    { id: "2", name: "Transferencias distritales", value: "Transferencias distritales" },
                                    { id: "3", name: "Recursos propios", value: "Recursos propios" }
                                ]}
                                control={control}
                                isValidateName={false}
                            />
                              <SelectComponent
                                    idInput='managerCenter'
                                    control={control}
                                    label='Centro gestor'
                                    className="select-basic"
                                    classNameLabel="text-black weight-500 biggest text-required"
                                    placeholder={'Seleccionar'}
                                    filter={true}
                                    data={[{ id: "91500000", name: "91500000", value: "91500000" }]}
                                    errors={errors}
                                />
                        </div>

                        <div className="funcionality-filters-container">
                            <SelectComponent
                                idInput='projectId'
                                control={control}
                                className="select-basic"
                                label='Proyecto'
                                classNameLabel="text-black weight-500 biggest text-required"
                                placeholder={'Seleccionar'}   
                                data={[]}
                                filter={true}
                                isValidateName={false}
                                errors={errors} 
                            />
                            <SelectComponent
                                idInput='fundsSapiencia'
                                control={control}
                                label='Fondo Sapiencia'
                                className="select-basic"
                                classNameLabel="text-black weight-500 biggest text-required"
                                placeholder={'Seleccionar'}
                                filter={true}
                                isValidateName={false}
                                data={[]}
                                errors={errors}
                            />
                            <SelectComponent
                                idInput='pospreSapiencia'
                                control={control}
                                label='Pospre Sapiencia'
                                className="select-basic"
                                classNameLabel="text-black weight-500 biggest text-required"
                                placeholder={'Seleccionar'}
                                filter={true}
                                isValidateName={false}
                                data={[]}
                                errors={errors}
                            />
                        </div>

                        <div className="funds-form mt-5px">
                            <div className='fund-denomination-container'>
                                <SelectComponent
                                    idInput='functionalArea'
                                    control={control}
                                    label='Área funcional'
                                    className="select-basic"
                                    classNameLabel="text-black weight-500 biggest text-required"
                                    placeholder={'Seleccionar'}
                                    filter={true}
                                    data={[]}
                                    errors={errors}
                                />
                                <InputComponent
                                    idInput='projectName'
                                    label="Nombre proyecto"
                                    typeInput="text"
                                    className="input-basic"                     
                                    classNameLabel="text-black weight-500 biggest text-required"
                                    errors={errors}
                                    register={register}
                                />

                            </div>
                        </div>

                        <section className='mt-16px'>
                            <div className="title-area">
                                <div className="text-black weight-500 large">Presupuesto</div>
                            </div>

                            <div className="funcionality-filters-container">
                                <InputNumberComponent
                                    control={control}
                                    idInput="sapienciaBudget"
                                    label="Presupuesto Sapiencia"
                                    className="inputNumber-basic medium"
                                    classNameLabel="text-black big bold "
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
                                    fieldArray={true}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                                 <InputNumberComponent
                                    control={control}
                                    idInput="totalProgrammed"
                                    label="Total programado"
                                    className="inputNumber-basic medium"
                                    classNameLabel="text-black big bold "
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
                                    fieldArray={true}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                    disabled
                                />
                            </div>

                        </section>
                           
                    </section>

                    <section className="card-user mt-14px">
                        <div className="title-area">
                            <div className="text-black weight-500 large">Programado</div>
                        </div>

                        <div className="grid-form-3-container-area grid-column-repet">
                            {
                        
                                Object.keys(programmed[0]).map((monthKey, index) => {
                                    return (
                                        <ProgramedMoths
                                            key={index}
                                            monthKey={monthKey}
                                            labelProgrammed={programmed[0][monthKey]}
                                            control={control}
                                            register={register}
                                        />
                                    )
                                })
                            }
                              
                        </div>
                    </section>

                    <div className="funcionality-buttons-container">
                        <ButtonComponent
                            form='useQueryForm'
                            value="Cancelar"
                            type="button"
                            className="button-clean-fields bold"
                            action={confirmClose}
                        />
                        <ButtonComponent
                            className="button-main huge hover-three"
                            value="Guardar"
                            type="submit"
                            disabled={!isBtnDisable}
                        />
                    </div>
                </FormComponent>

            </div>
        </div>
    )
}

export default React.memo(AssociatePacPages);