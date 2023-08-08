import React from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { ButtonComponent, FormComponent, InputComponent } from '../../../common/components/Form';
import { EDirection } from '../../../common/constants/input.enum';
import { useBudgetRoutesData } from '../hooks/budget-routes.hook';
import TableComponent from '../../../common/components/table.component';

interface IAppProps { }

function BudgetRoutesPage(props: IAppProps): React.JSX.Element {
    const { navigate, tableComponentRef, register, reset, errors, onSubmit, tableColumns, tableActions } = useBudgetRoutesData();
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
                                Consultar ruta presupuestal
                            </label>
                            <div className="title-button text-three biggest">
                                <span style={{ marginRight: '0.5em' }} onClick={() => { navigate('./create') }}> Crear ruta presupuestal</span>
                                {<AiOutlinePlusCircle size={20} color="533893" />}
                            </div>
                        </div>

                        <div className="one-filter-container">
                            <InputComponent
                                idInput="idProjectVinculation"
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                label="Posición presupuestaria"
                                classNameLabel="text-black biggest bold"
                                direction={EDirection.row}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className="funcionality-buttons-container">
                        <span className="bold text-center button" onClick={() => {
                            reset();
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
                    url={`${process.env.urlApiFinancial}/api/v1/budget-routes/get-paginated`}
                    columns={tableColumns}
                    actions={tableActions}
                    isShowModal={false}
                />
            </div>
            </div>
        </div>
    )
}

export default React.memo(BudgetRoutesPage);