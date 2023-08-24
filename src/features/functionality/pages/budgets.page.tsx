import { FormComponent, InputComponent, SelectComponent, ButtonComponent } from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { EDirection } from "../../../common/constants/input.enum";
import { useBudgetsData } from "../hooks/budgets.hook";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useState } from "react";
interface IAppProps { }


function BudgetsPage(props: IAppProps): React.JSX.Element {
    const { tableActions, tableColumns, tableComponentRef, navigate, onSubmit, register, errors, reset, entitiesData, controlRegister } = useBudgetsData();

    const { pospre, option } = useParams();
    const [isTableShow, setIsTableShow] = useState(false)

    const action = () => {
        setIsTableShow(true)
    }

    return (
        <div>
            <FormComponent action={onSubmit}>
                <div className="card-form">
                    <div className="title-area">
                        <label className="text-black biggest bold">
                            Consultar Posición Presupuestaria
                        </label>
                        <div className="title-button text-three biggest">
                            <span style={{ marginRight: '0.5em' }} onClick={() => { navigate('./create') }}> Crear Pospre</span>
                            {<AiOutlinePlusCircle size={20} color="533893" />}
                        </div>
                    </div>

                    <div className="one-filter-container">
                        <InputComponent
                            idInput="number"
                            className="input-basic"
                            typeInput="number"
                            register={register}
                            label="Posición presupuestaria"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            errors={errors}
                            min={0}
                        />
                    </div>
                </div>
                <div className="funcionality-buttons-container">
                    <span className="bold text-center button" onClick={() => {
                        reset(); setIsTableShow(false);
                    }}>
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Buscar"
                        type="submit"
                        action={action}
                    />
                </div>
            </FormComponent>
            {
                isTableShow && (
                    <div className="card-form">
                        <TableComponent
                            ref={tableComponentRef}
                            url={`${process.env.urlApiFinancial}/api/v1/budgets/get-paginated`}
                            columns={tableColumns}
                            actions={tableActions}
                            isShowModal={false}
                        />
                    </div>
                )
            }
        </div>
    )
}
export default BudgetsPage;