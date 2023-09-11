import React from 'react'
import TabAddFundsPage from './tab-add-funds.page';
import { ButtonComponent, FormComponent } from '../../../../common/components/Form';
import { useAddFundsCrud } from '../hook/add-funds-crud.hook';

function AddFundsCrudPage() {

    const {control, arrayDataSelect, onSubmitTab, setValue, register, getValues } = useAddFundsCrud()
    
    return (
        <div className="crud-page full-height">
            <section className="main-page full-height">
                <div className="card-table">
                    <p className="text-black extra-large">
                        Añadir valores
                    </p>
                    <FormComponent action={onSubmitTab} id="add-fund-form">
                        <TabAddFundsPage control={control} register={register} arrayDataSelect={arrayDataSelect} setValue={setValue} getValues={getValues}/>
                    </FormComponent>
                </div>
            </section>
            <section className="container-button-bot-2">
                <label className="text-black biggest"> Total Traslado: $   </label>
                <div className="buttons-bot">
                    <ButtonComponent
                        form="useQueryForm"
                        value="Cancelar"
                        type="button"
                        className="button-cancel-field bold"
                    />
                    {
                        true && 
                            <ButtonComponent
                                className="button-main huge hover-three"
                                value="Guardar"
                                type="submit"
                                form="add-fund-form"
                            />
                    }
                </div>
            </section>
        </div>
    )
}

export default React.memo(AddFundsCrudPage);