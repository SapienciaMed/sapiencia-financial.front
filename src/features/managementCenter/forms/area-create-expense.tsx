
import React, { useEffect, useState } from 'react'
import { BiPlusCircle } from 'react-icons/bi'
import { FaRegCopy } from 'react-icons/fa'
import { UseFormGetValues, useFieldArray, useFormState, useWatch, Control, UseFormRegister } from 'react-hook-form';
import { Detail, IAdditionsForm } from '../interfaces/Additions';
import { IArrayDataSelect, IMessage } from '../../../common/interfaces/global.interface';
import { AddValidHeaders } from '../../../common/constants/doc.enum';
import ScreenAddIncomePage from '../pages/screen-add-income.page';
import { Paginator } from 'primereact/paginator';
import { paginatorFooter } from '../../../common/components/table.component';
import { generarIdAleatorio } from '../../../common/utils/randomGenerate';
import { useAdditionAreaEdit } from '../hook/addition-area-edit.hook';

interface IAppProps {
    titleAdd: "ingreso"|"gasto",
    controlRegister: Control<IAdditionsForm, any>,
    arrayDataSelect: IArrayDataSelect,
    showModal: (values: IMessage) => void,
    getValues: UseFormGetValues<IAdditionsForm>,
    register: UseFormRegister<IAdditionsForm>,
    invalidCardsAdditionSt: any;
    setValue: any;
    watch: any;
}

function AreaCreateExpense({ titleAdd, controlRegister, getValues, arrayDataSelect, showModal, register, invalidCardsAdditionSt, setValue, watch }: IAppProps) {

    const { aditionData } = useAdditionAreaEdit();
   

    useEffect(() => {
        if (aditionData) {
            aditionData.details.forEach((item: Detail) => {
                if (item.type == "Gasto") {
                    append({
                        managerCenter: item.budgetRoute.managementCenter,
                        projectId: item.budgetRoute.projectVinculation.id,
                        projectName: item.budgetRoute.projectVinculation.conceptProject,
                        functionalArea: item.budgetRoute.projectVinculation.areaFuntional.id,
                        funds: item.budgetRoute.fund.id,
                        posPre: item.budgetRoute.pospreSapiencia.id,
                        value: item.value,
                        cardId: generarIdAleatorio(20) 
                    });
                }                
            });           
        }
    }, [aditionData]);
    
     

    const [isSearchByName, setIsSearchByName] = useState(false)

    const { fields, append, remove } = useFieldArray({
        control: controlRegister,
        name: 'gasto'
    });

    const { errors, isValid, dirtyFields } = useFormState({
        control: controlRegister
    })

    const watchIncome = useWatch({
        control: controlRegister,
        name: 'gasto'
    })

    const [dataPaste, setDataPaste] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleFields = fields.slice(startIndex, startIndex + itemsPerPage);

    const onPaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            constructJSONFromPastedInput(text);
            setIsSearchByName(true)
        } catch (error) {
            console.log(error);
        }
    }

    const constructJSONFromPastedInput = (pastedInput) => {
        let rawRows = pastedInput.split("\n");
        let headersArray = rawRows[0].split("\t");
        let output = [];

        (headersArray.every(value => AddValidHeaders.includes(value)) && headersArray.length == AddValidHeaders.length) ?
            rawRows.forEach((rawRow, idx) => {
                if (rawRow != '') {
                    if (idx > 0) {
                        let rowObject = {};
                        let values = rawRow.split("\t");
                        headersArray.forEach((header, idx) => {
                            Reflect.set(rowObject, header.trim().replaceAll(" ", ""), values[idx].trim())
                        });
                        output.push(rowObject);
                    }
                }
            })
            :
            showModal({
                title: "Validación de datos",
                //description: "Se ha encontrado un error en los datos,revisa las rutas presupuestales",
                description: "Se ha encontrado un error en los datos valida inclusion de titulos o datos completos",
                show: true,
                OkTitle: "Aceptar",
            })

        try {
            output.length > 0 && setDataPaste(output.map((item: any, index: number) => {
                if (item.VALOR == "" || item.NOMBREPROYECTO == "" || item.CENTROGESTOR == "" || item.POSPRE == "") {
                    throw new Error('Todos los campos deben estar diligenciados');
                }

                return ({
                    isPaste: true,
                    cardId: generarIdAleatorio(10),
                    managerCenter: item.CENTROGESTOR,
                    projectId: (arrayDataSelect.functionalArea.find(e => e.name == item.PROYECTO)).id,
                    functionalArea: Object(arrayDataSelect.functionalArea.filter(e => e.value != null).find((e: any) => e.area[0].name == item.ÁREAFUNCIONAL)).area[0].id,
                    funds: (arrayDataSelect.funds.find(e => e.name == item.FONDO)).id,
                    posPre: (arrayDataSelect.posPre.find(e => e.name == item.POSPRE)).id,
                    value: item.VALOR.replaceAll('.', ''),
                    projectName: item.NOMBREPROYECTO
                })
            }))


        } catch (error) {
            showModal({
                title: "Validación de datos",
                description: "Se ha encontrado un error en los datos, verifiqué que no tenga campos vacios o valores invalidos",
                show: true,
                OkTitle: "Aceptar",
            })
        }


    }

    const onPageChange = event => {
        setCurrentPage(event.page + 1);
    };

    const calculateTotal = () => {
        const values = getValues('gasto');
        const total = values?.reduce((acc, curr) => {
            //const value = parseFloat(curr.value.replace(/\./g, '').replace(/,/g, '.'));
            const value = parseFloat(curr.value)
            return acc + (isNaN(value) ? 0 : value);
        }, 0);
        return total;
    };

    const formatMoney = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    useEffect(() => {
        if (dataPaste.length > 0) {
            append(dataPaste);
        }
    }, [dataPaste])

    useEffect(() => {
        errors?.gasto?.message == 'datos duplicados en el sistema' && showModal({
            title: 'Validación de datos',
            description: errors?.gasto?.message,
            show: true,
            OkTitle: 'Aceptar',
        });
    }, [errors?.gasto?.message, isValid, dirtyFields])


    return (
        <div className="card-user mt-14px">
            <div className="title-area">
                <label className="text-black biggest"> Lista de {titleAdd} </label>
                <div className='display-justify-flex-center-adicion p-rating'>
                    <div className="title-button text-three large" id='pages' onClick={onPaste}> Pegar <FaRegCopy /> </div>
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
                            }); setIsSearchByName(false)
                        }}
                    > Añadir {titleAdd} <BiPlusCircle /> </div>
                </div>
            </div>
            {
                visibleFields.map((field, index) => (
                    <div key={field.id}>
                        <ScreenAddIncomePage controlRegister={controlRegister} titleAdd={titleAdd} fields={fields} arrayDataSelect={arrayDataSelect}
                            remove={remove} count={startIndex + index} errors={errors} register={register} cardId={field.id} invalidCardsAdditionSt={invalidCardsAdditionSt} setValue={setValue} watch={watch} />
                    </div>
                ))
            }
            {
                fields.length >= 6 &&
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
                watchIncome.some(use => use.value != '') &&
                <label className="text-black biggest ml-16px mt-14px"> Total gastos: $  {formatMoney(calculateTotal())} </label>

            }
        </div>
    )
}

export default React.memo(AreaCreateExpense);
