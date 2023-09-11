
import React, { useState } from 'react'
import { useFieldArray, useFormState, useWatch } from 'react-hook-form';
import { IAddFunds } from '../interfaces/TransferAreaCrudInterface';
import { FaRegCopy } from 'react-icons/fa';
import { BiPlusCircle } from 'react-icons/bi';
import { AddFormCardPage } from '../pages/add-form-card.page';
import { Paginator } from 'primereact/paginator';
import { paginatorFooter } from '../../../../common/components/table.component';


function CreateFundsDestination({ control, titleAdd, register, arrayDataSelect, setValue, getValues}: IAddFunds) {

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
    
    return (
        <div className="card-user mt-14px">
            <div className="title-area">
                <label className="text-black biggest"> Traslado {titleAdd} </label>
                <div className='display-justify-flex-center p-rating'>
                    <div className="title-button text-three large" id='pages' onClick={() => {}}> Pegar <FaRegCopy /> </div>
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
                                remove={remove} 
                                count={startIndex + index} 
                                errors={errors} 
                                register={register} 
                                cardId={field.id}
                                setValue={setValue}
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