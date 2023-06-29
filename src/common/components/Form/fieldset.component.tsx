import { Fieldset } from 'primereact/fieldset';

interface IFieldsetProps<T> {
    children: React.JSX.Element | React.JSX.Element[];
    legend: string;
    className?: string;
}

export function FieldsetComponent({ children, legend, className }: IFieldsetProps<any>) {
    return (
        <Fieldset legend={legend} className={className}>
            {children}
        </Fieldset>
    )
}