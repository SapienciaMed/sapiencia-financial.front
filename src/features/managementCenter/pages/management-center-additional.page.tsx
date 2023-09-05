import React from 'react'
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from '../../../common/components/Form';
import { BiPlusCircle } from 'react-icons/bi';
import TableComponent from '../../../common/components/table.component';
import { useManagementCenterAdditional } from '../hook/management-center-additional.hook';
import { EDirection } from '../../../common/constants/input.enum';
import { Controller } from 'react-hook-form';

function ManagementCenterAdditionalPage(): React.JSX.Element{

    const { errors, controlRegister, isBtnDisable, tableComponentRef, showTable, tableActions, tableColumns, 
        reset, onSubmit, navigate, setShowTable, register } = useManagementCenterAdditional()

    return (
        <div className='main-page'>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Adición</div>
                </div>
                <FormComponent action={onSubmit} >
                    <div className="card-form">
                        <div className="title-area"> 
                            <label className="text-black biggest bold"> Consultar adición </label>
                            <div className="title-button text-three large" onClick={() => { navigate('./create') }}> Crear adición <BiPlusCircle/> </div>
                        </div>
                        
                        <div className="funcionality-filters-container">
                           <Controller
                                control={controlRegister}
                                name={"adminDistrict"}
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
                                            label="Acto administrativo distrito"
                                            classNameLabel="text-black biggest bold text-required"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={field.onChange}
                                        /> 
                                    )
                                }}
                            />
                            <Controller
                                control={controlRegister}
                                name={"adminSapiencia"}
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
                                            label="Acto administrativo sapiencia"
                                            classNameLabel="text-black biggest bold text-required"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={field.onChange}
                                        /> 
                                    )
                                }}
                            />
                        </div>
                    </div>
                    <div className="funcionality-buttons-container mt-24px">
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