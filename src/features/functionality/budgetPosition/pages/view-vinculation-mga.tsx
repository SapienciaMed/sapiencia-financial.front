import { useParams } from "react-router-dom";
import TableComponent from "../../../../common/components/table.component";
import { useVinculationMGAData } from "../../hooks/vinculation-mga.hook";
import { IBudgetViewPage } from "../../interfaces/Budgets";

function ViewVinculationMGA( actions: IBudgetViewPage): React.JSX.Element {

    const { id: budgetsId } = useParams();
    const { tableComponentRef, tableColumnsView, tableActionsView, tableColumnsEdit } = useVinculationMGAData(budgetsId);

    return(
        <div className="card-form no-box-shadow">
            <TableComponent
                ref={tableComponentRef}
                url={`${process.env.urlApiFinancial}/api/v1/vinculation-mga/get-detailed-activities-api-planning`}
                columns={ actions.actions == 'view' ? tableColumnsView : tableColumnsEdit }
                actions={ tableActionsView }
                isShowModal={false}
            />
        </div>
    )
    
}

export default ViewVinculationMGA;