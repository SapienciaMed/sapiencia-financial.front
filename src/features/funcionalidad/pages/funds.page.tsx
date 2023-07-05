import { FormComponent, InputComponent, DatePickerComponent} from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { EDirection } from "../../../common/constants/input.enum";
import { useFoundData } from "../hooks/funds.hook";

interface IAppProps { }

function FoundsPage(props: IAppProps): React.JSX.Element {
    const { tableActions, tableColumns, tableComponentRef, onSubmit, register, errors } = useFoundData();
    return (
        <div>
            <FormComponent action={onSubmit}>
                <div className="card-form">
                    <label className="text-black biggest bold">
                        Datos personales
                    </label>
                    <div className="fonds-container">
                        <InputComponent
                            idInput="entity"
                            className="input-basic"
                            typeInput="text"
                            register={register}
                            label="Entidad CP"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            errors={errors}
                        />
                        <InputComponent
                            idInput="funds"
                            className="input-basic"
                            typeInput="text"
                            register={register}
                            label="Fondos"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            errors={errors}
                        />
                        <DatePickerComponent 
                            idInput="dateFrom"
                            className="input-basic"
                            direction={EDirection.row}
                            register={register}
                            errors={errors}
                            label="Validez de"
                            classNameLabel="text-black biggest bold"
                        />
                    </div>
                </div>
            </FormComponent>
            <div className="card-form">
                <TableComponent
                    ref={tableComponentRef}
                    url={`${process.env.urlApiAuth}/api/v1/role/get-paginated`}
                    columns={tableColumns}
                    actions={tableActions}
                />
            </div>
        </div>
    )
}

export default FoundsPage;