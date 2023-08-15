
import React, { useState } from 'react'
import { BiPlusCircle } from 'react-icons/bi'
import { FaRegCopy } from 'react-icons/fa'
import { Control, useFieldArray } from 'react-hook-form';
import { ButtonComponent, SelectComponent } from '../../common/components/Form';

interface IAppProps {
    titleAdd: string,
    control: any
}

function AreaCreateExpense({ titleAdd, control }: IAppProps ){

    const { fields, append, remove } = useFieldArray({
        control,
        name: titleAdd
    });

    return (
        <div className="card-user mt-14px">
            <div className="title-area"> 
                <label className="text-black biggest"> Lista de { titleAdd } </label>
                <div className='display-justify-flex-center p-rating'>
                    <div className="title-button text-three large"> Pegar <FaRegCopy/> </div>
                    <div className="title-button text-three large" onClick={append}> Añadir { titleAdd } <BiPlusCircle/> </div>
                </div>
            </div>

            {
            fields.map((field, index) => (
                <div key={field.id}>
                    <div className='card-user mt-14px'>
                        <div className="title-area">
                            <label className="text-black biggest"> {index + 1}. {titleAdd}</label>
                            <ButtonComponent
                                value={"Eliminar"}
                                type="button"
                                action={() => { remove(index) }}
                                className="button-delete biggest bold"         
                            />
                           
                        </div>
                        <div>
                            <section className='grid-form-2-container-reverse mt-5px'>
                                <SelectComponent
                                    idInput={`familiar.${index}.gender`} //cambiar
                                    control={control}                               
                                    label={'Centro gestor'}
                                    className="select-basic medium"
                                    classNameLabel="text-black big bold text-required"
                                    placeholder={'Seleccionar'}                
                                    fieldArray={true}
                                />
                                <SelectComponent
                                    idInput={`familiar.${index}.gender`} //cambiar
                                    control={control}                               
                                    label={'Id - Proyecto nombre'}
                                    className="select-basic medium"
                                    classNameLabel="text-black big bold text-required"    
                                    placeholder={'Seleccionar'}               
                                    fieldArray={true}
                                />
                            </section>
                            <section className='grid-form-3-container-area mt-5px'>
                                <SelectComponent
                                    idInput={`familiar.${index}.gender`} //cambiar
                                    control={control}                               
                                    label={'Área funcional'}
                                    className="select-basic medium"
                                    classNameLabel="text-black big bold text-required"
                                    placeholder={'Seleccionar'}                
                                    fieldArray={true}
                                />
                                <SelectComponent
                                    idInput={`familiar.${index}.gender`} //cambiar
                                    control={control}                               
                                    label={'Fondo'}
                                    className="select-basic medium"
                                    classNameLabel="text-black big bold text-required"    
                                    placeholder={'Seleccionar'}               
                                    fieldArray={true}
                                />
                                <SelectComponent
                                    idInput={`familiar.${index}.gender`} //cambiar
                                    control={control}                               
                                    label={'Pospre'}
                                    className="select-basic medium"
                                    classNameLabel="text-black big bold text-required"    
                                    placeholder={'Seleccionar'}               
                                    fieldArray={true}
                                />
                                 <SelectComponent
                                    idInput={`familiar.${index}.gender`} //cambiar
                                    control={control}                               
                                    label={'Valor'}
                                    className="select-basic medium"
                                    classNameLabel="text-black big bold text-required"    
                                    placeholder={'Seleccionar'}               
                                    fieldArray={true}
                                />
                            </section>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    )
}

export default React.memo(AreaCreateExpense);
