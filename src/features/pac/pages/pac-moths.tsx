import { Control, UseFormRegister } from 'react-hook-form';
import { InputNumberComponent } from '../../../common/components/Form/input-number.component';

interface Iprop {
    monthKey: string;
    labelProgrammed: any;
    control: Control<any, any>;
    register: UseFormRegister<any>;
    typePac: 'programmed' | 'collected'
    isDisabled: boolean
}
function PacMonths({control, monthKey, labelProgrammed, typePac, isDisabled}: Iprop) {
    return (
        <div>
            <InputNumberComponent
                control={control}
                idInput={`${typePac}.${monthKey}`}
                label={labelProgrammed}
                className={`inputNumber-basic medium`}
                classNameLabel="text-black weight-500 big"
                mode="currency"
                currency="COP"
                locale="es-CO"
                fieldArray={true}
                minFractionDigits={0}
                maxFractionDigits={0}
                disabled={!isDisabled}
            />
        </div>
    );
}

export default PacMonths;