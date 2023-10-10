
import React from 'react'
import { InputNumberComponent } from '../../../../common/components/Form/input-number.component';
import { IFormPacmonths } from '../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface';

function FormPacmonths({ count, control, titleAdd, pacTypeMonth,titleActive }: IFormPacmonths) {

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