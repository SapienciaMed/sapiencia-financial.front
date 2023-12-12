import { IoIosArrowForward } from 'react-icons/io';
import { ButtonComponent } from '../../../common/components/Form';

interface IRowTableProps {
    data: IDataDetails
}

interface IDataDetails {
    title: string,
    value: string,
    id: string
}

interface IDetailsProps {
    rows: IRowTableProps[]
    total: number,
    onOk: () => void,
    onShowModalDetail: (title: string, id: string, totalTransfer: string) => void
}

function DetailsRouteValuesComponent({ rows, total, onOk, onShowModalDetail }: IDetailsProps): React.JSX.Element {

    const onTableRow = (title: string, id: string, totalTransfer: string) => {
        onOk()
        onShowModalDetail(title, id, totalTransfer)
    }

    return (
        <div className="display-flex-direction-column full-width">
            <label className="text-black large">Detalle de la ruta</label>
            <table className="details-table-2 card-grid-item">
                {
                    rows?.map((datos) => {
                        const { data } = datos
                        return (
                            <tr key={data.title} onClick={() => onTableRow( data?.title, data.id, data?.value )} >
                                <th className="th-title">{data?.title}</th>
                                <th className="th-content">
                                    $ {data?.value}
                                    <IoIosArrowForward style={{color: '#533893'}}/>
                                </th>
                            </tr>
                        )
                    })
                }
            </table>

            <footer className='container-button-descripcion-modal'>
                <div className='content-label'>
                    <label className="text-black biggest"> Total Traslado:</label>
                    <label className="text-black biggest" style={{color: '#533893'}}> $ {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} </label>
                </div>
                <div className="buttons-bot">
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Aceptar"
                        action={onOk}
                    />
                </div>
            </footer>
        </div>
    );
}

export default DetailsRouteValuesComponent;