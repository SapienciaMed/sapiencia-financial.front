import { useParams } from "react-router-dom";
import { useLinkData } from "../hooks/link.hook.";
import TabListComponent from "../../../common/components/tab-list.component";

interface IAppProps { }

function LinkPage(props: IAppProps) : React.JSX.Element {
    const { pospre, option } = useParams();
    const { tabs, start } = useLinkData(pospre, option);
    return (
        <div className='main-page'>
            <div className='card-table'>
                <TabListComponent tabs={tabs} start={start}/>
            </div>
        </div>
    )
}

export default LinkPage;