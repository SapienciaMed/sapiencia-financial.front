import React from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { ButtonComponent, FormComponent, InputComponent } from '../../../common/components/Form';
import { EDirection } from '../../../common/constants/input.enum';
import { useBudgetRoutesData } from '../hooks/budget-routes.hook';
import TableComponent from '../../../common/components/table.component';
import { Controller } from 'react-hook-form';

interface IAppProps { }

function BudgetRoutesPage(props: IAppProps): React.JSX.Element {
    const { navigate, tableComponentRef, control, isBtnDisable, showTable, setShowTable,
        register, reset, onSubmit, tableColumns, tableActions } = useBudgetRoutesData();
    return (
        <div className='main-page'>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Ruta presupuestal</div>
                </div>
                <FormComponent action={onSubmit}>
                    <div className="card-form">
                        <div className="title-area">
                            <label className="text-black biggest bold">
                                Consultar Proyecto
                            </label>
                            <div className="title-button text-three biggest">
                                <span style={{ marginRight: '0.5em' }} onClick={() => { navigate('./create') }}> Crear ruta presupuestal</span>
                                {<AiOutlinePlusCircle size={20} color="533893" />}
                            </div>
                        </div>

                        <div className="one-filter-container">
                            <Controller
                                control={control}
                                name={"idProjectVinculation"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        className="input-basic"
                                        typeInput="text"
                                        register={register}
                                        label="ID Proyecto"
                                        classNameLabel="text-black biggest bold text-required"
                                        direction={EDirection.column}
                                        onChange={field.onChange}
                                    /> 
                                    )
                                }}
                            />
                        </div>
                    </div>
                    <div className="funcionality-buttons-container">
                        <span className="bold text-center button" onClick={() => {
                            reset();
                            if(showTable)  {
                                tableComponentRef.current.emptyData();
                                setShowTable(false)
                            }
                        }}>
                            Limpiar campos
                        </span>
                        <ButtonComponent
                            className="button-main huge hover-three"
                            value="Buscar"
                            type="submit"
                            disabled={!isBtnDisable}
                        />
                    </div>
                </FormComponent>

                {
                    showTable && 
                        <div className="card-form">
                            <TableComponent
                                ref={tableComponentRef}
                                url={`${process.env.urlApiFinancial}/api/v1/budget-routes/get-paginated`}
                                columns={tableColumns}
                                actions={tableActions}
                                isShowModal={true}
                                titleMessageModalNoResult='Ruta presupuestal'
                            />
                        </div>
                }
            </div>
        </div>
    )
}

export default React.memo(BudgetRoutesPage);