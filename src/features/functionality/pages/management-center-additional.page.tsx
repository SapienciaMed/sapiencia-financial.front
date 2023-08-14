import React from 'react'
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from '../../../common/components/Form';
import { BiPlusCircle } from 'react-icons/bi';
import TableComponent from '../../../common/components/table.component';
import { useManagementCenterAdditional } from '../hooks/management-center-additional.hook';

function ManagementCenterAdditionalPage(): React.JSX.Element{

    const { errors, controlRegister, projectsData, isBtnDisable, tableComponentRef, showTable, tableActions, tableColumns, 
        reset, onSubmit, navigate, setShowTable,} = useManagementCenterAdditional()

    return (
        <div>
            <FormComponent action={onSubmit} >
                <div className="card-form">
                    <div className="title-area"> 
                        <label className="text-black biggest bold"> Consultar adición </label>
                        <div className="title-button text-three large" onClick={() => { navigate('./create') }}> Crear adición <BiPlusCircle/> </div>
                    </div>
                    
                    <div className="funcionality-filters-container">
                        <SelectComponent
                            idInput="adminDistrict"
                            className="select-basic"
                            label="Acto administrativo distrito"
                            classNameLabel="text-black biggest bold"
                            errors={errors}
                            control={controlRegister}
                            data={projectsData}
                            filter={true}
                        />
                        <SelectComponent
                            idInput="adminSapiencia"
                            className="select-basic"
                            label="Acto administrativo sapiencia"
                            classNameLabel="text-black biggest bold"
                            errors={errors}
                            control={controlRegister}
                            data={[{name: "91500000",value: "0111"}]}
                            filter={true}
                        />
                    </div>
                </div>
                <div className="container-button-core mt-24px">
                    <div className="display-justify-space-between">
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
                            className="button-search"
                            value="Buscar"
                            type="submit"
                            disabled={!isBtnDisable}
                        />
                    </div>                
                </div>
            </FormComponent>
            {
                showTable && 
                    <div className="card-form">
                        <TableComponent
                            ref={tableComponentRef}
                            url={`${process.env.urlApiFinancial}/api/v1/budgets/get-paginated`}
                            columns={tableColumns}
                            actions={tableActions}
                            isShowModal={false}
                        />
                    </div>
            }
        </div>
    )
}

export default ManagementCenterAdditionalPage;