import { FormComponent, InputComponent, DatePickerComponent, SelectComponent, ButtonComponent } from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { EDirection } from "../../../common/constants/input.enum";
import { useFoundData } from "../hooks/funds.hook";

interface IAppProps { }

function FoundsPage(props: IAppProps): React.JSX.Element {
    const { tableActions, tableColumns, tableComponentRef, onSubmit, register, errors, setValueRegister } = useFoundData();
    return (
        <div>
            <FormComponent action={onSubmit}>
                <div className="card-form">
                    <label className="text-black biggest bold">
                        Datos personales
                    </label>
                    <div className="fonds-container">
                        <SelectComponent
                            idInput="entity"
                            className="select-basic"
                            register={register}
                            setValueRegister={setValueRegister}
                            errors={errors}
                            label="Fondos"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            data={[{value: 1,name: "hola" }, { value: 2,name: "hola2",}]}
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
                            direction={EDirection.row}
                            register={register}
                            errors={errors}
                            label="Validez de"
                            classNameLabel="text-black biggest bold"
                        />
                        <DatePickerComponent
                            idInput="dateTo"
                            direction={EDirection.row}
                            register={register}
                            errors={errors}
                            label="Validez de"
                            classNameLabel="text-black biggest bold"
                        />
                    </div>
                </div>
                <div>
                    <span className="bold text-center" onClick={() => console.log("limpiar")}>
                        Limpiar campos
                    </span>
                    <ButtonComponent
                        className="button-main big hover-three"
                        value="Buscar"
                        type="submit"
                    />
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