import { useEffect, useState } from "react";
import TableDataPropComponent from "../../../common/components/tableDataProp.component";
import { useWidth } from "../../../common/hooks/use-width";
import CdpHeadFormComponent from "../components/cdp-head-form.component";
import { useCdpCrud } from "../hooks/use-cdp";


const CdpViewPage = () => {
    const { width } = useWidth();
    const { control, register, tableComponentRef, tableColumns } = useCdpCrud();

    const [dataTableSt, setDataTableSt] = useState<any[]>([])

    useEffect(() => {
        setDataTableSt([])
    }, [])

    return (
        <div className="main-page">
            <div className="card-table gap-0">
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Visualizar CDP</div>
                </section>
                <section className="card-user">
                    <CdpHeadFormComponent isDisabled={true}/>
                </section>
            </div>
            <br />
            <div className="card-table gap-0">

                <TableDataPropComponent
                    ref={tableComponentRef}
                    dataTable={dataTableSt}
                    columns={tableColumns}
                    isShowModal={false}
                    titleMessageModalNoResult={"No se encontraron registros"}
                    secondaryTitle="CDP"
                />

            </div>
        </div>
    )



}

export default CdpViewPage;