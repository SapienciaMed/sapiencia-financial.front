import { useParams } from "react-router-dom";
import TabListComponent from "../../../../common/components/tab-list.component";
import { useBudgetView } from "../hooks/budget-view.hook";

function BudgetViewPage() {
    
    const { id, option } = useParams();
    const { tabs, start } = useBudgetView(id, option );
   
    return (
        <div>
            <TabListComponent tabs={tabs} start={start}/>
        </div>
    )

}

export default BudgetViewPage;