

import React, { useEffect, useState } from 'react'
import { ButtonComponent, InputComponent, SelectComponent } from '../../../../common/components/Form'
import { InputNumberComponent } from '../../../../common/components/Form/input-number.component'
import { IAddFormCard } from '../interfaces/TransferAreaCrudInterface'
import { useWatch } from 'react-hook-form';
import { IDropdownPropsFuctionalArea } from '../../../../common/interfaces/global.interface';
import { useBudgetRoutesService } from '../../../budget-routes/hooks/budget-routes-service.hook';

export const AddFormCardPage = ({ arrayDataSelect, control, titleAdd, errors, count, cardId, titleLabelValue, register, removeCard, setValue, invalidCardsAdditionSt, watch }: IAddFormCard) => {

    const { functionalArea, funds, posPre, } = arrayDataSelect
    const { GetFundsByProjectId, GetPospreByProjectAndFundId } = useBudgetRoutesService();
    const formOrigen = useWatch({ control, name: titleAdd })

    const [projectIdSelectedSt, setProjectIdSelectedSt] = useState<string>('')
    const [areaIdSelectedSt, setAreaIdSelectedSt] = useState<number | string>()
    const [areasByProjectSt, setAreasByProjectSt] = useState<IDropdownPropsFuctionalArea[]>()
    const [projectName, setProjectName] = useState('')

    const [fundsListFilterSt, setFundsListFilterSt] = useState([])
    const [pospreListFilterSt, setPospreListFilterSt] = useState([])
    useEffect(() => {
        GetPospreByProjectAndFundId(Number(formOrigen[count].projectId), Number(formOrigen[count].funds)).then(res => {
            let pospreListFixed = res.data.map(e => {
                return ({ name: e.number, value: e.id, id: e.id })
            })
            setPospreListFilterSt(pospreListFixed)
        })

    }, [formOrigen])

    useEffect(() => {
        GetFundsByProjectId(Number(formOrigen[count].projectId)).then(res => {
            let fundsListFixed = res.data.map(e => {
                return ({ name: e.number, value: e.id, id: e.id })
            })
            setFundsListFilterSt(fundsListFixed)
        })

    }, [formOrigen])


    useEffect(() => {
        if (projectName != "") {
            setValue(`${titleAdd.toLowerCase()}[${count}].cardId`, cardId)
            setValue(`${titleAdd.toLowerCase()}[${count}].functionalArea`, (areasByProjectSt.find(e => e.value != null)).id ?? areaIdSelectedSt)
            setValue(`${titleAdd.toLowerCase()}[${count}].projectName`, projectName)
        }
    }, [projectIdSelectedSt])

    useEffect(() => {
        processFunctionalArea(formOrigen[count].projectId)
    }, [projectName])

    const optionSelected = (option: any) => {
        if (option) {
            setProjectName(functionalArea.find(e => e.value == option)?.description)
            processFunctionalArea(option)
        }
    }

    const processFunctionalArea = (option: any) => {
        const areaList: IDropdownPropsFuctionalArea[] = functionalArea.filter(props => props.value != null).map(propsFunctionalArea => {
            Object(propsFunctionalArea).area[0]['projectId'] = propsFunctionalArea?.id
            return Object(propsFunctionalArea).area
        });
        const area = areaList.flat().filter(propsAreaList => propsAreaList.projectId == option && propsAreaList.value !== null);

        setProjectIdSelectedSt(option)
        setAreaIdSelectedSt(area[0]?.id)
        setAreasByProjectSt(area)
    }

    let invalidStyleCard = {
        background: invalidCardsAdditionSt?.find(e => e?.idCard == watch(`${titleAdd.toLowerCase()}[${count}].cardId`)) ? 'rgba(255, 0, 0, 0.30)' : 'none',
        border: invalidCardsAdditionSt?.find(e => e?.idCard == watch(`${titleAdd.toLowerCase()}[${count}].cardId`)) ? '1px solid #F00' : ''
    }

    return (
        <div className='card-user mt-14px' style={invalidStyleCard}>
            <div className="title-area">
                <label className="text-black biggest"> {count + 1}. {titleAdd.charAt(0).toUpperCase() + titleAdd.slice(1)} </label>
                <ButtonComponent
                    value={"Eliminar"}
                    type="button"
                    action={() => { removeCard(count) }}
                    className="button-delete biggest bold"
                />
            </div>
            <div>
                <section className='grid-form-2-container-reverse mt-5px'>
                    <SelectComponent
                        idInput={`${titleAdd}[${count}].managerCenter`}
                        control={control}
                        label='Centro gestor'
                        className="select-basic medium"
                        classNameLabel="text-black big bold text-required"
                        placeholder={'Seleccionar'}
                        data={[{ id: "91500000", name: "91500000", value: "91500000" }]}
                        filter={true}
                        fieldArray={true}
                        errors={errors}
                    />
                    <SelectComponent
                        idInput={`${titleAdd}[${count}].projectId`}
                        control={control}
                        label='Proyecto'
                        className="select-basic medium"
                        classNameLabel="text-black big bold text-required"
                        placeholder={'Seleccionar'}
                        data={functionalArea}
                        filter={true}
                        fieldArray={true}
                        errors={errors}
                        optionSelected={optionSelected}
                    />
                    <SelectComponent
                        idInput={`${titleAdd}[${count}].functionalArea`}
                        control={control}
                        label='Área funcional'
                        className="select-basic medium"
                        classNameLabel="text-black big bold text-required"
                        placeholder={'Seleccionar'}
                        filter={true}
                        fieldArray={true}
                        data={areasByProjectSt}
                        errors={errors}
                    />
                </section>
                <section className='grid-form-3-container-area mt-5px'>

                    <SelectComponent
                        idInput={`${titleAdd}[${count}].funds`}
                        control={control}
                        label='Fondo'
                        className="select-basic medium"
                        classNameLabel="text-black big bold text-required"
                        placeholder={'Seleccionar'}
                        filter={true}
                        fieldArray={true}
                        data={fundsListFilterSt/* funds */}
                        errors={errors}
                    />

                    <SelectComponent
                        idInput={`${titleAdd}[${count}].posPre`}
                        control={control}
                        label='Pospre'
                        className="select-basic medium"
                        classNameLabel="text-black big bold text-required"
                        placeholder={'Seleccionar'}
                        filter={true}
                        fieldArray={true}
                        data={pospreListFilterSt/* posPre */}
                        errors={errors}
                    />

                    <InputNumberComponent
                        control={control}
                        idInput={`${titleAdd}[${count}].value`}
                        label={`${titleLabelValue}`}
                        className="inputNumber-basic medium"
                        placeholder={'Seleccionar'}
                        classNameLabel="text-black big bold text-required"
                        errors={errors}
                        mode="currency"
                        currency="COP"
                        locale="es-CO"
                        fieldArray={true}
                        minFractionDigits={0}
                        maxFractionDigits={0}
                    />

                </section>
                <section className='grid-form-1-container-area mt-5px'>
                    <InputComponent
                        idInput={`${titleAdd}[${count}].projectName`}
                        label="Nombre proyecto"
                        typeInput="text"
                        className="input-basic large"
                        placeholder={'Seleccionar'}
                        classNameLabel="text-black biggest bold text-required"
                        errors={errors}
                        register={register}
                        fieldArray={true}
                    />
                </section>
            </div>
        </div>
    )
}
