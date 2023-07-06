import { AiOutlinePlusCircle } from "react-icons/ai";
import { FormComponent, InputComponent, DatePickerComponent, SelectComponent, ButtonComponent } from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { EDirection } from "../../../common/constants/input.enum";
import { useFundsData } from "../hooks/funds.hook";

interface IAppProps { }

function FoundsPage(props: IAppProps): React.JSX.Element {
    const { tableActions, tableColumns, tableComponentRef, onSubmit, register, errors, setValueRegister, reset, entitySelected, setEntitySelected, dateFrom, dateTo, setDateFrom, setDateTo, entitiesData } = useFundsData();
    return (
        <div>
            <FormComponent action={onSubmit}>
                <div className="card-form">
                    <div className="title-area">
                        <label className="text-black biggest bold">
                            Datos personales
                        </label>

                        <div className="title-button text-three biggest" onClick={() => { }}>
                            Crear <AiOutlinePlusCircle />
                        </div>
                    </div>
                    <div className="funcionality-filters-container">
                        <SelectComponent
                            idInput="entity"
                            className="select-basic"
                            register={register}
                            setValueRegister={setValueRegister}
                            errors={errors}
                            label="Entidad CP"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            data={entitiesData}
                            stateProps={{ state: entitySelected, setState: setEntitySelected }}
                        />
                        <InputComponent
                            idInput="number"
                            className="input-basic"
                            typeInput="number"
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
                            setValueRegister={setValueRegister}
                            errors={errors}
                            label="Validez de"
                            classNameLabel="text-black biggest bold"
                            stateProps={{ setState: setDateFrom, state: dateFrom }}
                        />
                        <DatePickerComponent
                            idInput="dateTo"
                            direction={EDirection.row}
                            setValueRegister={setValueRegister}
                            register={register}
                            errors={errors}
                            label="Validez de"
                            classNameLabel="text-black biggest bold"
                        />
                    </div>
                </div>
                <div className="funcionality-buttons-container">
                    <span className="bold text-center button" onClick={() => {
                        reset();
                        setEntitySelected(null);
                    }}>
                        Limpiar campos
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Buscar"
                        type="submit"
                    />
                </div>
            </FormComponent>
            <div className="card-form">
                <TableComponent
                    ref={tableComponentRef}
                    url={`${process.env.urlApiFinancial}/api/v1/funds/get-paginated`}
                    columns={tableColumns}
                    actions={tableActions}
                />
            </div>
        </div>
    )
}

export default FoundsPage;