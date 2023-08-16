
import React from 'react'
import {  ButtonComponent, FormComponent, SelectComponent } from '../../../common/components/Form';
import TabManagerAdditionPage from './tab-manager-addition.page';
import { useAdditionAreaCrud } from '../hooks/addition-area-crud.hook';

interface IAppProps {
    action: "new" | "edit";
}

function AdditionAreaCrud({action}: IAppProps) {

    const {controlRegister, errors, AdditionsByDistrictData, AdditionsBySapienciaData , onSubmit, showModal} = useAdditionAreaCrud()
    
    return (
        <div className="crud-page">
            <div className="main-page full-height">
                <p className="text-black extra-large"> { action === "new" ? "Crear adición" : "Editar adición" } </p>
                <FormComponent action={onSubmit} >
                    <div className="card-user">
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

                            <TabManagerAdditionPage control={controlRegister} errors={errors} showModal={showModal}/>

                            <label className="text-black biggest ml-16px mt-14px"> Total ingreso: $ </label>

                    </div>
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
                </FormComponent>
            </div>
        </div>
    )
}

export default React.memo(AdditionAreaCrud);