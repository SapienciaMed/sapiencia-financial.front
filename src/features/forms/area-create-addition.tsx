
import React, { useEffect, useState } from 'react'
import { BiPlusCircle } from 'react-icons/bi'
import { FaRegCopy } from 'react-icons/fa'
import {  useFieldArray } from 'react-hook-form';
import { ButtonComponent, SelectComponent } from '../../common/components/Form';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { paginatorFooter } from '../../common/components/table.component';
import TestPage from '../functionality/pages/test.page';

interface IAppProps {
    titleAdd: string,
    control: any
}

function AreaCreateAddition({ titleAdd, control }: IAppProps ){

    const { fields, append, remove } = useFieldArray({
        control,
        name: titleAdd
    });

    const [perPage, setPerPage] = useState<number>(2);
    const [page, setPage] = useState<number>(0);
    const [first, setFirst] = useState<number>(0);
    const [resultData, setResultData] = useState<number>(0);

    function onPageChange(event: PaginatorPageChangeEvent): void {
        setPerPage(event.rows);
        setFirst(event.first);
        setPage(event.page);
      }

    useEffect(() => {
      setResultData(fields.length)
    },[fields])

    return (
        <div className="card-user mt-14px">
            <div className="title-area"> 
                <label className="text-black biggest"> Lista de { titleAdd } </label>
                <div className='display-justify-flex-center p-rating'>
                    <div className="title-button text-three large"> Pegar <FaRegCopy/> </div>
                    <div className="title-button text-three large" onClick={append}> Añadir { titleAdd } <BiPlusCircle/> </div>
                </div>
            </div>
            <TestPage/>
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
                                    idInput={`centro.gestor.${index}`} 
                                    control={control}                               
                                    label={'Centro gestor'}
                                    className="select-basic medium"
                                    classNameLabel="text-black big bold text-required"
                                    placeholder={'Seleccionar'}
                                    data={[
                                        {
                                            name: "1",
                                            value: "1234"
                                        }
                                    ]}               
                                    fieldArray={true}
                                />
                                <SelectComponent
                                    idInput={`id.proyecto.nombre.${index}`} 
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
                                    idInput={`area.funcional.${index}`} 
                                    control={control}                               
                                    label={'Área funcional'}
                                    className="select-basic medium"
                                    classNameLabel="text-black big bold text-required"
                                    placeholder={'Seleccionar'}                
                                    fieldArray={true}
                                />
                                <SelectComponent
                                    idInput={`fondo.${index}`} 
                                    control={control}                               
                                    label={'Fondo'}
                                    className="select-basic medium"
                                    classNameLabel="text-black big bold text-required"    
                                    placeholder={'Seleccionar'}               
                                    fieldArray={true}
                                />
                                <SelectComponent
                                    idInput={`pospre.${index}`} 
                                    control={control}                               
                                    label={'Pospre'}
                                    className="select-basic medium"
                                    classNameLabel="text-black big bold text-required"    
                                    placeholder={'Seleccionar'}               
                                    fieldArray={true}
                                />
                                 <SelectComponent
                                    idInput={`valor.${index}`} 
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
            {
                fields.length >= 2 && 
                    <div className="spc-common-table">
                        <Paginator
                            className="spc-table-paginator"
                            template={paginatorFooter}
                            first={first}
                            rows={perPage}
                            totalRecords={resultData}
                            onPageChange={onPageChange}
                        /> 
                    </div>
            }
        </div>
    )
}

export default React.memo(AreaCreateAddition);
