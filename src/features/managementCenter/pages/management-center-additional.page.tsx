import React from 'react'
import { ButtonComponent, FormComponent, SelectComponent } from '../../../common/components/Form';
import { BiPlusCircle } from 'react-icons/bi';
import TableComponent from '../../../common/components/table.component';
import { useManagementCenterAdditional } from '../hook/management-center-additional.hook';

function ManagementCenterAdditionalPage(): React.JSX.Element{

    const { errors, controlRegister, AdditionsByDistrictData, isBtnDisable, tableComponentRef, showTable, tableActions, tableColumns, 
        AdditionsBySapienciaData, reset, onSubmit, navigate, setShowTable } = useManagementCenterAdditional()

    return (
        <div className='main-page'>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Adicion</div>
                </div>
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
                                data={AdditionsByDistrictData}
                                filter={true}
                            />
                            <SelectComponent
                                idInput="adminSapiencia"
                                className="select-basic"
                                label="Acto administrativo sapiencia"
                                classNameLabel="text-black biggest bold"
                                errors={errors}
                                control={controlRegister}
                                data={AdditionsBySapienciaData}
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
                                url={`${process.env.urlApiFinancial}/api/v1/additions/get-paginated`}
                                columns={tableColumns}
                                actions={tableActions}
                                isShowModal={true}
                                titleMessageModalNoResult='Adición'
                            />
                        </div>
                }
           </div> 
        </div>
    )
}

export default ManagementCenterAdditionalPage;