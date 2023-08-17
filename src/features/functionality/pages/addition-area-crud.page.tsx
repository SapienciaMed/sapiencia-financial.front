
import React from 'react'
import {  ButtonComponent, FormComponent, SelectComponent } from '../../../common/components/Form';
import TabManagerAdditionPage from './tab-manager-addition.page';
import { useAdditionAreaCrud } from '../hooks/addition-area-crud.hook';
import { useManagementCenterAdditional } from '../hooks/management-center-additional.hook';

interface IAppProps {
    action: "new" | "edit";
}

function AdditionAreaCrud({action}: IAppProps) {

    const {controlRegisterTabs, errosTabs, isNextTab,
        onSubmitTab, showModal } = useAdditionAreaCrud()

    const {controlRegister, errors, AdditionsByDistrictData, 
        AdditionsBySapienciaData, onSubmit} = useManagementCenterAdditional()
    
    return (
        <div className="crud-page">
            <div className="main-page full-height">
                <p className="text-black extra-large"> { action === "new" ? "Crear adición" : "Editar adición" } </p>
                    <div className="card-user">
                        <FormComponent action={onSubmit} >
                            <section className="card-form">
                                <div className="funcionality-filters-container">
                                    <SelectComponent
                                        idInput="actAdministrativeDistrict"
                                        className="select-basic"
                                        label="Acto administrativo distrito"
                                        classNameLabel="text-black biggest text-required"
                                        errors={errors}
                                        control={controlRegister}
                                        data={AdditionsByDistrictData}
                                        filter={true}
                                    />
                                    <SelectComponent
                                        idInput="actAdministrativeSapiencia"
                                        className="select-basic"
                                        label="Acto administrativo sapiencia"
                                        classNameLabel="text-black biggest text-required"
                                        errors={errors}
                                        control={controlRegister}
                                        data={AdditionsBySapienciaData}
                                        filter={true}
                                    />
                                </div>
                            </section>

                            

                            {/* <label className="text-black biggest ml-16px mt-14px"> Total ingreso: $ </label>  */}
                        </FormComponent>

                        <FormComponent action={onSubmitTab} >
                            <TabManagerAdditionPage controlRegister={controlRegisterTabs} 
                                errors={errosTabs} showModal={showModal} isNextTab={isNextTab} onSubmitTab={onSubmitTab}/> 
                        </FormComponent>
                        <section className="container-button-core mt-24px">
                            <div className="display-justify-space-between">
                                <ButtonComponent
                                    form='useQueryForm'
                                    value="Cancelar"
                                    type="button"
                                    className="button-clean-fields bold"
                                    action={() => {}}
                                />
                                <ButtonComponent
                                    className="button-search"
                                    value="Guardar"
                                    type="submit"
                                    // disabled={!isBtnDisable}
                                />
                            </div>
                        </section>     
                    </div>
            </div>
        </div>
    )
}

export default React.memo(AdditionAreaCrud);