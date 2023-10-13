
import React, { useEffect } from 'react'
import { InputNumberComponent } from '../../../../common/components/Form/input-number.component';
import { IFormPacmonths } from '../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface';
import { validateTypePac } from '../util/validate-type-pac';

function FormPacmonths({ count, control, titleAdd, pacTypeMonth, titleActive, pacTypeState, annualDataRoutes, setValue }: IFormPacmonths) {

    useEffect(() => {
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.january`, annualDataRoutes.jan)
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.february`, annualDataRoutes.feb)
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.march`, annualDataRoutes.mar)
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.april`, annualDataRoutes.abr)
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.may`, annualDataRoutes.may)
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.june`, annualDataRoutes.jun)
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.july`, annualDataRoutes.jul)
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.august`, annualDataRoutes.ago)
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.september`, annualDataRoutes.sep)
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.october`, annualDataRoutes.oct)
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.november`, annualDataRoutes.nov)
        setValue(`${titleAdd}[${count}].${pacTypeMonth}.december`, annualDataRoutes.dec)
    },[annualDataRoutes])


    return(
        <section className="display-flex-direction-column gap-1 mt-3rem">
            <label className="text-black weight-500 biggest text-center"> {titleActive} </label>
            <section className="transfer-pac">
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.january`}
                    label='Enero'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.february`}
                    label='Febrero'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />

            </section>
            <section className="transfer-pac">
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.march`}
                    label='Marzo'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.april`}
                    label='Abril'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
            </section>
            <section className="transfer-pac">
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.may`}
                    label='Mayo'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.june`}
                    label='Junio'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
            </section>
            <section className="transfer-pac">
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.july`}
                    label='Julio'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.august`}
                    label='Agosto'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
            </section>
            <section className="transfer-pac">
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.september`}
                    label='Septiembre'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.october`}
                    label='Octubre'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
            </section>
            <section className="transfer-pac">
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.november`}
                    label='Noviembre'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].${pacTypeMonth}.december`}
                    label='Diciembre'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
            </section>
        </section>
    )
    
}

export default React.memo(FormPacmonths);