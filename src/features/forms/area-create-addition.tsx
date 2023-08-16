
import React, { useContext, useEffect, useState } from 'react'
import { BiPlusCircle } from 'react-icons/bi'
import { FaRegCopy } from 'react-icons/fa'
import { useFieldArray, FieldErrors } from 'react-hook-form';
import { ButtonComponent, InputComponent, SelectComponent } from '../../common/components/Form';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { paginatorFooter } from '../../common/components/table.component';
import ScreenAddIncome from '../functionality/pages/screen-add-income.page';
import { IAdditionsIncome } from '../functionality/interfaces/Additions';
import { AppContext } from '../../common/contexts/app.context';
import { IMessage } from '../../common/interfaces/global.interface';

interface IAppProps {
    titleAdd: string,
    control: any,
    errors: FieldErrors<IAdditionsIncome>,
    showModal: (values: IMessage) => void
}

function AreaCreateAddition({ titleAdd, control, errors, showModal }: IAppProps ){

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ingreso'
    });
    
    const [perPage, setPerPage] = useState<number>(2);
    const [page, setPage] = useState<number>(0);
    const [first, setFirst] = useState<number>(0);
    const [resultData, setResultData] = useState<number>(0);
    const [dataPaste, setDataPaste] = useState([])
    const [isPaste, setIsPaste] = useState<boolean>(false)

    function onPageChange(event: PaginatorPageChangeEvent): void {
        setPerPage(event.rows);
        setFirst(event.first);
        setPage(event.page);
    }

    const onPaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            constructJSONFromPastedInput(text);
        } catch (error) {
            console.log(error);
        }
    }

    const arregloValido = [
        " CENTRO GESTOR  ",
        " POS PRE  ",
        " FONDO  ",
        " ÁREA FUNCIONAL ",
        " PROYECTO ",
        " VALOR  ",
        " NOMBRE PROYECTO  \r"
      ];
    
    let constructJSONFromPastedInput = (pastedInput) => {
        let rawRows = pastedInput.split("\n");
        let headersArray = rawRows[0].split("\t");  
        let output = [];
        
        (headersArray.every(value => arregloValido.includes(value)) && headersArray.length == arregloValido.length) ?
            rawRows.forEach((rawRow, idx) => {
                if (rawRow != '') {
                    if (idx > 0) {
                        let rowObject = {};
                        let values = rawRow.split("\t");
                        headersArray.forEach((header, idx) => {
                            Reflect.set(rowObject, header.trim().replaceAll(" ", ""), values[idx].trim())
                        });
                        output.push(rowObject);
                        setIsPaste(true)
                    }
                } 
            })
        : 
        showModal({
            title: "Validación de datos",
            description: "Se ha encontrado un error en los datos,revisa las rutas presupuestales",
            show: true,
            OkTitle: "Aceptar",
        })
        

        output.length > 0 && setDataPaste(output.map(item => ({
            managerCenter: item.CENTROGESTOR,
            projectId: `${item.PROYECTO} - ${item.NOMBREPROYECTO}` ,
            functionalArea: item.ÁREAFUNCIONAL,
            funds: item.FONDO,
            posPre: item.POSPRE,
            value: item.VALOR
        })))  
    }

    useEffect(() => {
        dataPaste.length > 0 && append(dataPaste)
    },[dataPaste])


    useEffect(() => {
      setResultData(fields.length)
    },[fields])

    return (
        <div className="card-user mt-14px">
            <div className="title-area"> 
                <label className="text-black biggest"> Lista de { titleAdd } </label>
                <div className='display-justify-flex-center p-rating'>
                    <div className="title-button text-three large" id='pages' onClick={onPaste}> Pegar <FaRegCopy/> </div>
                    <div className="title-button text-three large" 
                        onClick={() =>{ append({
                            managerCenter: '',
                            projectId: '',
                            functionalArea: '',
                            funds: '',
                            posPre: '',
                            value: ''
                        })
                        setIsPaste(false)
                    }}
                    > Añadir { titleAdd } <BiPlusCircle/> </div>
                </div>
            </div>

            {
                fields.map((field, index) => (
                    <div key={field.id}>
                        <ScreenAddIncome control={control} titleAdd={titleAdd} isPaste={isPaste}
                            remove={remove} count={index} errors={errors}/>
                    </div>
                ))
            }
            {/* {
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
            } */}
        </div>
    )
}

export default React.memo(AreaCreateAddition);
