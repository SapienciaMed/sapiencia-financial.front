import { useParams } from "react-router-dom";
import TabListComponent from "../../../../common/components/tab-list.component";
import { useBudgetView } from "../hooks/budget-view.hook";
import { IBudgetViewPage } from "../../interfaces/Budgets";

function BudgetViewPage( values: IBudgetViewPage ) {

    const { actions, upDatePospreData, upDateVinculationData } = values;
    
    const { id, option } = useParams();
    const { tabs, start } = useBudgetView(id, option, { actions, upDatePospreData, upDateVinculationData } );
   
    return (
        <div>
            <TabListComponent tabs={tabs} start={start}/>
        </div>
    )

}

export default BudgetViewPage;