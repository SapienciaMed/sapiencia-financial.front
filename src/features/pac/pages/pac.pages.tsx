import React from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IoWalletOutline } from "react-icons/io5";
import { useWidth } from "../../../common/hooks/use-width";
import { usePacData } from "../hook/pac.hook";
import { Controller } from 'react-hook-form';
import TableComponent from "../../../common/components/table.component";
import { ProgressSpinner } from "primereact/progressspinner";


function PacPages() {
    const {width} = useWidth()

    const {control, errors, isBtnDisable, showTable, tableComponentRef, tableActions, showSpinner,
        tableColumns, navigate, setShowTable, register, onSubmit, reset} = usePacData()
    
    return (
        <div className='main-page'>
            <div className='card-table gap-0'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Consultar  PAC</div>

                    <div className={`${width < 800 ? 'display-justify-space-between-pac' : 'display-align-flex-end'} gap-0 gap-05`}>
                        <div
                            className="title-button font-big"
                            onClick={() => {}}
                        >
                            Asociar al PAC <AiOutlinePlusCircle />
                        </div>
                        <div
                            className="title-button font-big"
                            onClick={() => {navigate('./traslado')}}
                        >
                            Traslado <IoWalletOutline />
                        </div>
                        <div
                            className="title-button font-big"
                            onClick={() => { navigate('./cargar') }}
                        >
                            Cargar archivo <AiOutlinePlusCircle />  
                        </div>

                    </div>

                </section>
                
                <section className="card-user">
                    <FormComponent action={onSubmit}>
                        <div className="funcionality-filters-container">
                            <Controller
                                control={control}
                                name={"validity"}
                                defaultValue={String(new Date().getFullYear())} 
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
                                            onChange={field.onChange}
                                            errors={errors}
                                    />
                                    )
                                }}
                            />
                            <SelectComponent
                                idInput="pacType"
                                className="select-basic"
                                errors={errors}
                                label="Tipo de recurso"
                                classNameLabel="text-black weight-500 biggest text-required"
                                direction={EDirection.column}
                                data={[
                                    { id: '1', name: 'Seleccione', value: null},
                                    { id: "2", name: "Transferencias distritales", value: "Transferencias distritales" },
                                    { id: "3", name: "Recursos propios", value: "Recursos propios" },
                                    { id: "4", name: "Todas", value: "Todas" },
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
                                            onChange={field.onChange}
                                        />
                                    )
                                }}
                            />
                        </div>
                        <div className="funcionality-filters-container">
                            <SelectComponent
                                idInput='projectId'
                                control={control}
                                className="select-basic"
                                label='Proyecto'
                                classNameLabel="text-black weight-500 big"
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
                                classNameLabel="text-black weight-500 big"
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
                                classNameLabel="text-black weight-500 big"
                                placeholder={'Seleccionar'}
                                filter={true}
                                isValidateName={false}
                                data={[]}
                                errors={errors}
                            />
                        </div>
                            {
                                showSpinner && (
                                    <ProgressSpinner style={{width: '20px', height: '20px'}}  animationDuration=".5s" />

                                )              
                            }
                        <div className="funcionality-buttons-container">
                            <ButtonComponent
                                form='useQueryForm'
                                value="Limpiar campos"
                                type="button"
                                className="button-clean-fields bold"
                                action={() => { 
                                    reset() 
                                    if(showTable)  {
                                        tableComponentRef.current.emptyData();
                                        setShowTable(false)
                                    }
                                }}
                            />
                            <ButtonComponent
                                className="button-main huge hover-three"
                                value="Buscar"
                                type="submit"
                                disabled={!isBtnDisable}
                            />
                        </div>

                    </FormComponent>

                </section>
                {
                    showTable && (
                        <div className="card-user mt-2rem">
                            <TableComponent
                                ref={tableComponentRef}
                                url={`${process.env.urlApiFinancial}/api/v1/tran`}
                                columns={tableColumns}
                                actions={tableActions}
                                isShowModal={true}
                                titleMessageModalNoResult="No hay resultados"
                                secondaryTitle="PAC"
                            />
                        </div>
                    )
                }

            </div>
        </div>
    );

}

export default React.memo(PacPages);