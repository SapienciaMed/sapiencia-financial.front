import React from 'react'
import TabAddFundsPage from './tab-add-funds.page';
import { ButtonComponent, FormComponent } from '../../../../common/components/Form';
import { useAddFundsCrud } from '../hook/add-funds-crud.hook';
import { FaRegCopy } from 'react-icons/fa';

function AddFundsCrudPage() {

    const {control, arrayDataSelect, totalTransfer,  
        onSubmitTab, formatMoney, onCancel, setValue, register, getValues, invalidCardsAdditionSt, watch } = useAddFundsCrud()
    
    return (
        <div className="crud-page full-height">
            <section className="main-page full-height">
                <div className="card-table">
                    <p className="text-black extra-large">
                        Añadir valores
                    </p>
                    <FormComponent action={onSubmitTab} id="add-fund-form">
                        <TabAddFundsPage 
                            control={control} 
                            register={register} 
                            arrayDataSelect={arrayDataSelect} 
                            setValue={setValue} 
                            getValues={getValues}
                            invalidCardsAdditionSt={invalidCardsAdditionSt}
                            watch={watch}
                        />
                    </FormComponent>
                </div>
            </section>
            <section className="container-button-bot-2">
                <div className='content-label'>
                    <label className="text-black biggest"> Total Traslado:</label>
                    <label className="text-black biggest" style={{color: '#533893'}}> $ {formatMoney(totalTransfer)} </label>
                </div>
                <div className='buttons-bot'>
                    <span
                        className="bold text-center button"
                        onClick={onCancel}
                    >
                        Cancelar
                    </span>
                     <ButtonComponent
                        className="button-main huge hover-three"
                        value="Agregar"
                        type="submit"
                        form="add-fund-form"
                    />
                </div>
            </section>
        </div>
    )
}

export default React.memo(AddFundsCrudPage);