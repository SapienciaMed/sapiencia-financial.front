import { FormComponent, InputComponent, SelectComponent, ButtonComponent } from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { EDirection } from "../../../common/constants/input.enum";
import { useBudgetsData } from "../hooks/budgets.hook";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
interface IAppProps { }


function BudgetsPage(props: IAppProps): React.JSX.Element {
    const [inputBuggetPosition, setInputBuggetPosition] = useState('')
    const [isBtnDisable, setIsBtnDisable] = useState(false)
    const { tableActions, tableColumns, tableComponentRef, navigate, onSubmit, register, errors, reset, showTable, setShowTable, controlRegister } = useBudgetsData();

   
    const handleChange = (e:any)=>{
        setInputBuggetPosition(e.target.value)
    }

    useEffect(() => {
        inputBuggetPosition.length>0 
            ? setIsBtnDisable(true)
            : setIsBtnDisable(false)
    }, [inputBuggetPosition])

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
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="funcionality-buttons-container">
                    <span className="bold text-center button" onClick={() => {
                        reset();
                        setIsBtnDisable(false)
                        if(showTable)  {
                            tableComponentRef.current.emptyData();
                            setShowTable(false)
                        }
                    }}>
                        Limpiar campos
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Buscar"
                        type="submit"
                        disabled={!isBtnDisable}
                        //disabled={false}
                    />
                </div>
            </FormComponent>
            {
            showTable && (
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