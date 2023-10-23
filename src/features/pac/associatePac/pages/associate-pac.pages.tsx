import React from 'react'
import { ButtonComponent, FormComponent, SelectComponent } from '../../../../common/components/Form';
import { useForm, Controller } from 'react-hook-form';
import { InputComponent } from '../../../../../../sapiencia-payroll.front/src/common/components/Form/input.component';
import { EDirection } from '../../../../common/constants/input.enum';

function AssociatePacPages() {

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()
    
    return(
        <div className='main-page'>
            <div className='card-table gap-0'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Asociar al PAC</div>
                </section>

                <section className="card-user">
                    <section className="title-area">
                        <div className="text-black weight-500 large">Ruta presupuestal</div>
                    </section>
                    <FormComponent action={() => {}}>
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
                             <Controller
                                control={control}
                                name={"version"}
                                defaultValue=''
                                render={({ field }) => {
                                    return(
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            className="input-basic"
                                            typeInput="number"
                                            register={register}
                                            label="Versión"
                                            classNameLabel="text-black weight-500 biggest text-required"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        />
                                    )
                                }}
                            />
                        </div>

                        <div className="funcionality-filters-container">
                            <SelectComponent
                                idInput='idProjectVinculation'
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
                                idInput='idFund'
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
                                idInput='idPospreSapiencia'
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

                        <div className="funcionality-filters-container">
                            <SelectComponent
                                idInput='functionalArea'
                                control={control}
                                label='Área funcional'
                                className="select-basic"
                                classNameLabel="text-black weight-500 biggest text-required"
                                placeholder={'Seleccionar'}
                                filter={true}
                                fieldArray={true}
                                data={[]}
                                errors={errors}
                            />
                        </div>
                        <div className="funcionality-filters-container">
                            <InputComponent
                                idInput='projectName'
                                label="Nombre proyecto"
                                typeInput="text"
                                className="input-basic"                     
                                classNameLabel="text-black weight-500 biggest text-required"
                                errors={errors}
                                register={register}
                                fieldArray={true}
                            />

                        </div>

                        <section className="title-area">
                            <div className="text-black weight-500 large">Presupuesto</div>
                        </section>

                        <div className="funcionality-filters-container">
                            <Controller
                                control={control}
                                name={"sapienciaBudget"}
                                defaultValue='' 
                                render={({ field }) => {
                                    return(
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            className="input-basic color-default-value"
                                            typeInput="number"
                                            register={register}
                                            label="Presupuesto Sapiencia"
                                            classNameLabel="text-black weight-500 biggest text-required"
                                            direction={EDirection.column}
                                            onChange={(value) => {
                                                field.onChange(value);
                                               
                                            }}
                                            errors={errors}

                                    />
                                    )
                                }}
                            />
                             <Controller
                                control={control}
                                name={"totalProgrammed"}
                                defaultValue='0'
                                render={({ field }) => {
                                    return(
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            className="input-basic"
                                            typeInput="number"
                                            register={register}
                                            label="Total programado"
                                            classNameLabel="text-black weight-500 biggest text-required"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={(value) => {
                                                field.onChange(value);
                                            }}
                                            disabled
                                        />
                                    )
                                }}
                            />
                        </div>
                           
                        <div className="funcionality-buttons-container">
                            <ButtonComponent
                                form='useQueryForm'
                                value="Limpiar campos"
                                type="button"
                                className="button-clean-fields bold"
                                action={() => { 
                                    reset() 
                                    
                                }}
                            />
                            <ButtonComponent
                                className="button-main huge hover-three"
                                value="Buscar"
                                type="submit"
                                // disabled={!isBtnDisable}
                            />
                        </div>

                    </FormComponent>
                </section>
            </div>
        </div>
    )
}

export default React.memo(AssociatePacPages);