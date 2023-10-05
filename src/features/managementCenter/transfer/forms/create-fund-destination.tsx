
import React, { useContext, useEffect, useState } from 'react'
import { useFieldArray, useFormState, useWatch } from 'react-hook-form';
import { IAddFunds } from '../interfaces/TransferAreaCrudInterface';
import { BiPlusCircle } from 'react-icons/bi';
import { AddFormCardPage } from '../../../../common/components/add-form-card.page';
import { Paginator } from 'primereact/paginator';
import { paginatorFooter } from '../../../../common/components/table.component';
import { AppContext } from '../../../../common/contexts/app.context';


function CreateFundsDestination({ control, titleAdd, register, arrayDataSelect, dataPaste, setValue, getValues, setDataPaste, invalidCardsAdditionSt, watch}: IAddFunds) {

    const { fields, append, remove } = useFieldArray({
        control,
        name: titleAdd  
    });

    const { errors } = useFormState({ control })

    const watchIncome = useWatch({
        control,
        name: titleAdd
    })

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleFields = fields.slice(startIndex, startIndex + itemsPerPage);
    const { setMessage } = useContext(AppContext);

    const onPageChange = event => setCurrentPage(event.page + 1);

    const formatMoney = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const calculateTotal = () => {
        const values = getValues(titleAdd);
        const total = values?.reduce((acc, curr) => {
            const value = parseFloat(curr.value);
            return acc + (isNaN(value) ? 0 : value);
        }, 0);
        return total;
    };

    const dataReset = (index?: number | number[])=>{
        remove(index);
        setDataPaste([]);
    }

    useEffect(() => {
        let dataPasteToCreate = dataPaste.filter(item => item.typeTransfer == 'Destino' )
        const set1 = new Set(fields);
        const set2 = new Set(dataPasteToCreate);
        // Usa el método every() para verificar si todos los elementos de set1 no están en set2
        let validPaste = Array.from(set2).every(item => !set1.has(item));

        if(dataPaste.length > 0 && fields.length==0)   {
             append( dataPaste.filter(item => item.typeTransfer == 'Destino' ) ) 
            }else if(!validPaste){
             append( dataPaste.filter(item => item.typeTransfer == 'Destino' ) ) 
         }
    }, [dataPaste])
    
    return (
        <div className="card-user mt-14px">
            <div className="title-area">
                <label className="text-black biggest"> Traslado {titleAdd} </label>
                <div className='display-justify-flex-center p-rating'>
                    <div className="title-button text-three large"
                        onClick={() => {
                            append({
                                managerCenter: '',
                                projectId: '',
                                projectName: '',
                                functionalArea: '',
                                funds: '',
                                posPre: '',
                                value: '',
                                cardId: ''
                            })
                        }}
                    > Añadir {titleAdd} <BiPlusCircle /> </div>
                </div>
            </div>
            {
                visibleFields.map((field, index) => {
                    return (
                        <div key={field.id + titleAdd}>
                            <AddFormCardPage
                                control={control} 
                                titleAdd={titleAdd} 
                                arrayDataSelect={arrayDataSelect}
                                removeCard={dataReset} 
                                count={startIndex + index} 
                                errors={errors} 
                                register={register} 
                                cardId={field.id}
                                setValue={setValue}
                                titleLabelValue='Valor crédito'
                                invalidCardsAdditionSt={invalidCardsAdditionSt}
                                watch={watch}
                            />
                        </div>
                    )
                })
            }
            {
                fields.length >= 4 &&
                    <div className="spc-common-table">
                        <Paginator
                            className="spc-table-paginator"
                            template={paginatorFooter}
                            first={startIndex}
                            rows={itemsPerPage}
                            totalRecords={fields.length}
                            onPageChange={onPageChange}
                        />
                    </div>
            }
            {

                watchIncome?.some(use => use.value != '' && parseInt(use.value) != 0 && use.value != null) &&
                    <div>
                        <label className="text-black biggest ml-16px mt-14px"> Total {titleAdd.toLowerCase()}</label>
                        <label className="text-black biggest" style={{color: '#533893'}}> $ {formatMoney(calculateTotal())} </label>
                    </div>

            }
        </div>
    )
}

export default React.memo(CreateFundsDestination);