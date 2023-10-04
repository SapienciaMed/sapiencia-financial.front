import { useParams } from "react-router-dom";
import TableComponent from "../../../../common/components/table.component";
import { useVinculationMGAData } from "../../hooks/vinculation-mga.hook";
import { IBudgetViewPage } from "../../interfaces/Budgets";

function ViewVinculationMGA( values: IBudgetViewPage): React.JSX.Element {

    const { actions, upDateVinculationData } = values;
    
    const { pospre: budgetsId } = useParams();
    const { tableComponentRef, tableColumnsView, tableActionsView, tableColumnsEdit } = useVinculationMGAData(budgetsId, { actions, upDateVinculationData } );

    return(
        <div className="card-form no-box-shadow">
            <TableComponent
                ref={tableComponentRef}
                url={`${process.env.urlApiFinancial}/api/v1/vinculation-mga/get-detailed-activities-api-planning-yesuseonpospre/${budgetsId}`}
                columns={ actions == 'view' ? tableColumnsView : tableColumnsEdit }
                actions={ tableActionsView }
                isShowModal={false}
                secondaryTitle="Vinculación MGA"
            />
        </div>
    )
    
}

export default ViewVinculationMGA;