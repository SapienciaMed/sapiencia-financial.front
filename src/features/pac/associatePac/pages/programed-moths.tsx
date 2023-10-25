import { Control, UseFormRegister } from 'react-hook-form';
import { IAssocciatePac } from '../interface/AssocciatePac';
import { InputNumberComponent } from '../../../../common/components/Form/input-number.component';

interface Iprop {
    monthKey: string;
    labelProgrammed: any;
    control: Control<IAssocciatePac, any>;
    register: UseFormRegister<IAssocciatePac>;
}
function ProgramedMoths({control, monthKey, labelProgrammed}: Iprop) {
    return (
        <div>
            <InputNumberComponent
                control={control}
                idInput={`programmed.${monthKey}`}
                label={labelProgrammed}
                className="inputNumber-basic medium"
                classNameLabel="text-black big bold "
                mode="currency"
                currency="COP"
                locale="es-CO"
                fieldArray={true}
                minFractionDigits={0}
                maxFractionDigits={0}
            />
        </div>
    );
}

export default ProgramedMoths;