import { useParams } from "react-router-dom";
import TableComponent from "../../../../common/components/table.component";
import { useVinculationMGAData } from "../../hooks/vinculation-mga.hook";

function ViewVinculationMGA(): React.JSX.Element {

    const { id: budgetsId } = useParams();
    const { tableComponentRef, tableColumnsView, tableActions } = useVinculationMGAData(budgetsId);

    return(
        <div className="card-form no-box-shadow">
            <TableComponent
                ref={tableComponentRef}
                url={`${process.env.urlApiFinancial}/api/v1/vinculation-mga/get-detailed-activities-api-planning`}
                columns={tableColumnsView}
                actions={tableActions}
                isShowModal={false}
            />
        </div>
    )
    
}

export default ViewVinculationMGA;